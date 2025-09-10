document.addEventListener('DOMContentLoaded', function () {
  const tableBody = document.querySelector('#applicantTable tbody');

  fetch('/api/applicants')
    .then(res => res.json())
    .then(applicants => {
      if (!Array.isArray(applicants) || applicants.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="11">No applicants submitted yet.</td></tr>';
        return;
      }

      let rowNumber = 1;
      const groupedByJob = {};

      // Group applicants by job title
      applicants.forEach(app => {
        if (!groupedByJob[app.jobTitle]) groupedByJob[app.jobTitle] = [];
        groupedByJob[app.jobTitle].push(app);
      });

      Object.keys(groupedByJob).forEach(jobTitle => {
        // Add job divider row
        const dividerRow = document.createElement('tr');
        const dividerCell = document.createElement('td');
        dividerCell.colSpan = 11;
        dividerCell.textContent = "📌 Applicants for Job Title: " + jobTitle;
        dividerCell.style.fontWeight = 'bold';
        dividerCell.style.backgroundColor = '#e0e0e0';
        dividerCell.style.padding = '5px';
        dividerRow.appendChild(dividerCell);
        tableBody.appendChild(dividerRow);

        // Add applicants rows
        groupedByJob[jobTitle].forEach(applicant => {
          const row = document.createElement('tr');
          row.classList.add(applicant.status === 'Pass' ? 'pass' : 'fail');

          row.innerHTML =
            '<td>' + rowNumber++ + '</td>' +
            '<td>' + applicant.name + '</td>' +
            '<td>' + applicant.jobTitle + '</td>' +
            '<td>' + applicant.department + '</td>' +
            '<td>' + applicant.gpa + '</td>' +
            '<td>' + applicant.exitExam + '</td>' +
            '<td>' + applicant.email + '</td>' +
            '<td>' + applicant.phone + '</td>' +
            '<td>' + applicant.status + '</td>' +
            '<td>' + (applicant.cvData 
                        ? '<a href="' + applicant.cvData + '" download="' + applicant.cvFileName + '">Download CV</a>'
                        : 'No CV') + '</td>' +
            '<td>' + (applicant.screenshotData 
                        ? '<a href="' + applicant.screenshotData + '" download="' + applicant.screenshotName + '">Download Screenshot</a>'
                        : 'No Screenshot') + '</td>';

          tableBody.appendChild(row);
        });
      });
    })
    .catch(err => {
      console.error('❌ Failed to fetch applicants:', err);
      tableBody.innerHTML = '<tr><td colspan="11">Error loading applicants.</td></tr>';
    });
});