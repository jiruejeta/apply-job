import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2';
import session from 'express-session';
import multer from 'multer';
import bodyParser from 'body-parser';
import fs from "fs";

const app = express();
const PORT = 3000;

// ES module __dirname workaround
// ES module __dirname workaround
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Path to uploads
const uploadDir = path.join(__dirname,  "uploads");

// Create folder if it doesn't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
// Serve everything inside "public" (c,  "ss, js, images, uploads, etc.)
app.use(express.static(path.join(__dirname, "../public")));
app.use('/uploads', express.static(path.join(__dirname,'uploads')));
// ----------------- Database -----------------
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '129791@Jiru',
  database: 'vision_fund'
});

db.connect(err => {
  if (err) throw err;
  console.log('✅ Connected to MySQL database');
});

// ----------------- Middleware -----------------
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));


// ----------------- Session -----------------
app.use(session({
  secret: 'adminsecret',
  resave: false,
  saveUninitialized: false
}));


// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // save inside public/uploads
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // unique file name
  }
});

// Export the upload middleware
export const upload = multer({ storage });
// ----------------- Helper -----------------
function requireAdminLogin(req, res, next) {
  if (!req.session.admin) return res.redirect('/admin/login/login.html');
  next();
}

// ----------------- Routes -----------------

// Homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "NGO", "applicant", "home", "index.html"));
});

app.use(express.static(path.join(__dirname, "../public")));

// Admin login page
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '/admin/login/login.html'));
});

// Admin login POST
app.post('/admin/login', (req, res) => {
  const { email, password } = req.body;
  const sql = 'SELECT * FROM admins WHERE email = ? AND password = ?';
  db.query(sql, [email, password], (err, results) => {
    if (err) {
      console.error(err);
      return res.redirect('/admin/login/login.html');
    }
    if (results.length > 0) {
      req.session.admin = results[0];
      return res.redirect('/admin/dashboard');
    } else {
      return res.redirect('/admin/login/login.html');
    }
  });
});

// Admin dashboard
app.get('/admin/dashboard', requireAdminLogin, (req, res) => {
  res.sendFile(path.join(__dirname, '/admin/dashboard/dashboard.html'));
});

// Admin logout
app.post('/admin/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/admin/login/login.html');
  });
});

// ----------------- Jobs -----------------

// Post Job
app.post('/admin/post-job', requireAdminLogin, (req, res) => {
  const { jobTitle, department, minGPA, minExam, description, deadLine } = req.body;
  if (!jobTitle || !department || !minGPA || !minExam || !description || !deadLine) {
    return res.status(400).send('All job fields are required.');
  }

  const deptStr = Array.isArray(department) ? department.join(',') : department;
  const sql = "INSERT INTO jobs (jobTitle, department, minGPA, minExam, description, postedAt, deadLine) VALUES (?, ?, ?, ?, ?, NOW(), ?)";
  const values = [jobTitle.trim(), deptStr, parseFloat(minGPA), parseFloat(minExam), description.trim(), deadLine];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("❌ DB Insert Error:", err);
      return res.status(500).send("Error saving job.");
    }
    res.redirect("/admin/dashboard");
  });
});

// Get all jobs
app.get("/api/jobs", (req, res) => {
  db.query("SELECT * FROM jobs ORDER BY postedAt DESC", (err, results) => {
    if (err) return res.status(500).json({ error: "DB fetch failed" });
    res.json(results);
  });
});

// API: Apply applicant (CV + Screenshot)
app.post('/api/apply', upload.fields([
  { name: 'cvFile', maxCount: 1 },
  { name: 'screenshot', maxCount: 1 }
]), (req, res) => {
  try {
    const { name, email, phone, jobTitle, department, gpa, exitExam, status } = req.body;
    if (!req.files || !req.files.cvFile || !req.files.screenshot) {
      return res.status(400).json({ error: 'CV and Screenshot are required' });
    }

    const cvPath = '/uploads/' + req.files.cvFile[0].filename;
    const screenshotPath = '/uploads/' + req.files.screenshot[0].filename;

    const sql = "INSERT INTO applicants (name, email, phone, jobTitle, department, gpa, exitExam, status, cvFile, screenshot) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    const values = [name, email, phone, jobTitle, department, parseFloat(gpa), parseFloat(exitExam), status, cvPath, screenshotPath];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error('❌ Applicant DB Insert Error:', err);
        return res.status(500).json({ error: 'Failed to save applicant' });
      }
      res.json({ message: 'Application submitted successfully!' });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ Admin route: View all applicants with CV and screenshot
app.get('/api/applicants', (req, res) => {
  const sql = "SELECT id, name, jobTitle, department, gpa, exitExam, email, phone, status, cvFile, screenshot FROM applicants ORDER BY jobTitle, status DESC, gpa DESC";

  db.query(sql, (err, results) => {
    if (err) {
      console.error('❌ Error fetching applicants:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    const applicants = results.map(row => ({
      id: row.id,
      name: row.name,
      jobTitle: row.jobTitle,
      department: row.department,
      gpa: row.gpa,
      exitExam: row.exitExam,
      email: row.email,
      phone: row.phone,
      status: row.status,
      cvFileName: row.cvFile ? row.cvFile.split('-').slice(1).join('-') : null,
      cvData: row.cvFile ? "/uploads/" + row.cvFile : null,
      screenshotName: row.screenshot ? row.screenshot.split('-').slice(1).join('-') : null,
      screenshotData: row.screenshot ? "/uploads/" + row.screenshot : null
    }));

    res.json(applicants);
  });
  });
//------------- Start Server -----------------
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});