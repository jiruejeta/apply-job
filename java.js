// Function to redirect to the apply page
function applyNow() {
    // Replace 'apply.html' with the URL of your application page
    window.location.href = 'apply.html';
}

// Add click event listener to all buttons with class "apply-btn"
const applyButtons = document.querySelectorAll('.apply-btn');
applyButtons.forEach(button => {
    button.addEventListener('click', applyNow);
});