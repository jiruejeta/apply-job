

  // Detect if the page was restored from bfcache (Back button)
  window.addEventListener("pageshow", function (event) {
    if (event.persisted) {
      // If page was loaded from cache, force a reload
      window.location.reload();
    }
  });

  // Optional: Clear form on every load
  window.onload = function () {
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    if (email) email.value = '';
    if (password) password.value = '';
  };
