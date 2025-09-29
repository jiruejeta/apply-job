// Profiles mapped to codes
const profiles = {
  "GadisaNGO@1": {
    photo: "/images/person1.jpg",
    title: "Gadisa Temesgen",
    subtitle: "Environmental Specialist",
    message: "At Bishoftu district with 17,518 birr.NGOETHIOPIAN"
  },
  "AyantuNGO@1": {
    photo: "/images/person2.jpg",
    title: "Ayantu Tesfaye",
    subtitle: "Finance officer",
    message: "At Ambo district with 17,518 birr.."
  }
  // ➕ Add more codes here
};

function showProfile() {
  const code = document.getElementById("codeInput").value.trim();
  const profile = profiles[code];

  if (profile) {
    document.getElementById("photo").src = profile.photo;
    document.getElementById("title").innerText = profile.title;
    document.getElementById("subtitle").innerText = profile.subtitle;
    document.getElementById("message").innerText = profile.message;
    document.getElementById("profile").style.display = "block";
  } else {
    alert("Invalid code. Please try again.");
  }
}