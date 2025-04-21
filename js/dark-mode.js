document.addEventListener("DOMContentLoaded", function () {
    // Ambil referensi ke tombol toggle
    const themeToggle = document.getElementById("theme-toggle");

    // Cek preferensi tema dari localStorage
    const isDarkMode = localStorage.getItem("darkMode") === "enabled";

    // Terapkan tema dari preferensi yang tersimpan
    if (isDarkMode) {
        document.documentElement.classList.add("dark");
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        themeToggle.setAttribute("title", "Switch to Light Mode");
    } else {
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        themeToggle.setAttribute("title", "Switch to Dark Mode");
    }

    // Event listener untuk tombol toggle
    themeToggle.addEventListener("click", function () {
        if (document.documentElement.classList.contains("dark")) {
            // Beralih ke Light Mode
            document.documentElement.classList.remove("dark");
            localStorage.setItem("darkMode", "disabled");
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            themeToggle.setAttribute("title", "Switch to Dark Mode");
        } else {
            // Beralih ke Dark Mode
            document.documentElement.classList.add("dark");
            localStorage.setItem("darkMode", "enabled");
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            themeToggle.setAttribute("title", "Switch to Light Mode");
        }
    });
});
