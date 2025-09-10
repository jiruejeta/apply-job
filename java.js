// Load job title from localStorage (optional)
const job = JSON.parse(localStorage.getItem("jobRequirement"));
if (job) {
  document.querySelector("h1").textContent = `Apply for: ${job.title}`;
}
