document.getElementById("postJobForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const jobTitle = document.getElementById("jobTitle").value.trim();
  const deptSelect = document.getElementById("department");
  const selectedDepartments = Array.from(deptSelect.selectedOptions).map(opt => opt.value);

  const minGPA = parseFloat(document.getElementById("minGPA").value);
  const minExam = parseFloat(document.getElementById("minExam").value);
  const desc = document.getElementById("description").value.trim();
  //const deadLine = parseFloat(document.getElementById("deadLine").value);
  const msg = document.getElementById("msg");

  if (!jobTitle || selectedDepartments.length === 0) {
    alert("Please fill in all required fields.");
    return;
  }

  const job = {
    title: jobTitle,  // now a single string
    departments: selectedDepartments,
    minGPA,
    minExam,
    description: desc,
    //deadline,
    postedAt: new Date().toISOString(),
  };

  let jobs = JSON.parse(localStorage.getItem("jobPosts") || "[]");
  jobs.push(job);
  localStorage.setItem("jobPosts", JSON.stringify(jobs));

  msg.textContent = "✅ Job posted successfully!";
  this.reset();

  setTimeout(() => {
    msg.textContent = "";
  }, 3000);
});
