window.addEventListener('DOMContentLoaded', () => {
  const jobList = document.getElementById('jobList');

  fetch('/api/jobs')
    .then(res => {
      if (!res.ok) throw new Error('Failed to fetch jobs');
      return res.json();
    })
    .then(jobs => {
      jobList.innerHTML = ''; // Clear loading

      if (!Array.isArray(jobs) || jobs.length === 0) {
        jobList.textContent = 'No jobs posted yet.';
        return;
      }

      jobs.forEach(job => {
        const jobDiv = document.createElement('div');

        // Job Title
        const title = document.createElement('h3');
        title.textContent = job.jobTitle;
        jobDiv.appendChild(title);

        // Departments
        const dept = document.createElement('p');
        dept.innerHTML = '<strong>Departments:</strong> ' + 
          (typeof job.department === 'string' ? job.department : job.department.join(', '));
        jobDiv.appendChild(dept);

        // Min GPA
        const gpa = document.createElement('p');
        gpa.innerHTML = '<strong>Min GPA:</strong> ' + job.minGPA;
        jobDiv.appendChild(gpa);

        // Min Exit Exam
        const exam = document.createElement('p');
        exam.innerHTML = '<strong>Min Exit Exam:</strong> ' + job.minExam;
        jobDiv.appendChild(exam);

        // Description
        const desc = document.createElement('p');
        desc.innerHTML = '<strong>Description:</strong> ' + job.description;
        jobDiv.appendChild(desc);

        // Deadline
        const dead = document.createElement('small');
        dead.innerHTML = 'DEADLINE: ' + job.deadLine;
        dead.style.color = "red";
        jobDiv.appendChild(dead);

        // Posted at
        const posted = document.createElement('small');
        posted.textContent = 'Posted at: ' + new Date(job.postedAt).toLocaleString();
        posted.style.color = "green";
        jobDiv.appendChild(posted);

        // Horizontal rule
        const hr = document.createElement('hr');
        hr.style.color = "red";
        jobDiv.appendChild(hr);

        // Add jobDiv to container
        jobList.appendChild(jobDiv);
      });
    })
    .catch(error => {
      console.error('Fetch error:', error);
      jobList.innerHTML = '<p>Error loading job data.</p>';
    });
});