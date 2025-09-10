const form = document.getElementById('applyForm');
const successMessage = document.getElementById('successMessage');

form.addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent form from reloading the page

    // Display success message
    successMessage.textContent = "You have successfully submitted your application!";

    // Reset the form
    form.reset();

    

});