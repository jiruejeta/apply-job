document.addEventListener('DOMContentLoaded', () => {
  const jobSelect = document.getElementById('jobSelect');
  const departmentSelect = document.getElementById('departmentSelect');
  const applyForm = document.getElementById('applyForm');
  const resultMsg = document.getElementById('resultMsg');
  let jobList = [];

  // Fetch jobs from backend
  fetch('/api/jobs')
    .then(res => res.json())
    .then(jobs => {
      jobList = jobs;
      jobSelect.innerHTML = '<option value="">-- Select Job --</option>';
      departmentSelect.innerHTML = '<option value="">-- Select Department --</option>';
      jobs.forEach(job => {
        const opt = document.createElement('option');
        opt.value = job.jobTitle;
        opt.textContent = job.jobTitle;
        jobSelect.appendChild(opt);

        const depOpt = document.createElement('option');
        depOpt.value = job.department;
        depOpt.textContent = job.department;
        departmentSelect.appendChild(depOpt);
      });
    })
    .catch(err => console.error('Failed to load jobs:', err));

  // Handle form submit
  applyForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const gpa = parseFloat(document.getElementById('gpa').value);
    const exitExam = parseFloat(document.getElementById('exitExam').value);
    const selectedJobTitle = jobSelect.value;
    const selectedDepartment = departmentSelect.value;
    const cvFile = document.getElementById('cvFile').files[0];
    const screenshotFile = document.getElementById('profileImage').files[0];

    if (!cvFile || !screenshotFile) {
      alert('Please upload both CV and Screenshot.');
      return;
    }

    const matchedJob = jobList.find(job => 
      job.jobTitle === selectedJobTitle && job.department === selectedDepartment
    );

    const isQualified = matchedJob ? (gpa >= matchedJob.minGPA && exitExam >= matchedJob.minExam) : false;

    const formData = new FormData();
    formData.append('name', fullName);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('jobTitle', selectedJobTitle);
    formData.append('department', selectedDepartment);
    formData.append('gpa', gpa);
    formData.append('exitExam', exitExam);
    formData.append('status', isQualified ? 'Pass' : 'Fail');
    formData.append('cvFile', cvFile);
    formData.append('screenshot', screenshotFile);

    fetch('/api/apply', {
      method: 'POST',
      body: formData
    })
    .then(res => res.json())
    .then(resp => {
      resultMsg.textContent = isQualified 
        ?  '✅ Application successful! Congratulations Mr./Ms. ' + fullName +
          ', you meet the job requirements for the position of ' + selectedJobTitle +
          ' in the ' + selectedDepartment + ' department. Please wait while we review your application.'
        :  '❌ Sorry, Mr./Ms. ' + fullName +
          ', you do not meet the minimum requirements for ' + selectedJobTitle +
          ' in the ' + selectedDepartment + ' department at this time.';
      resultMsg.style.color = isQualified ? 'green' : 'red';
      applyForm.reset();
      departmentSelect.innerHTML = '<option value="">-- Select Department --</option>';
    })
    .catch(err => {
      console.error('Submission failed:', err);
      alert('There was an error submitting your application.');
    });
  });
});