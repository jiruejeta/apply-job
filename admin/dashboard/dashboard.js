



// Logout function
function logoutAdmin() {
  localStorage.removeItem("isAdminLoggedIn");
  alert("You have been logged out.");
  window.location.href = "/admin/login/login.html";
}