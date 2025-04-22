document.addEventListener("DOMContentLoaded", function () {
  // Fungsi untuk memeriksa apakah elemen terlihat di viewport
  function isElementInViewport(el) {
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    const windowHeight =
      window.innerHeight || document.documentElement.clientHeight;

    // Element dianggap terlihat jika setidaknya 50% dari elemen terlihat
    // Ini bisa disesuaikan sesuai kebutuhan
    const visibleThreshold = rect.height * 0.5;

    return (
      rect.top <= windowHeight - visibleThreshold &&
      rect.bottom >= visibleThreshold
    );
  }

  // Kelas TextScramble untuk efek acak teks dengan kontrol layout
  class TextScramble {
    constructor(el) {
      this.el = el;
      this.chars = "!<>-_\\/[]{}—=+*^?#________";
      this.update = this.update.bind(this);

      // Simpan dimensi dan posisi awal
      this.saveInitialDimensions();

      // Flag untuk mengetahui apakah ini title atau description
      this.isTitle = el.id === "about-title";
    }

    // Simpan dimensi awal elemen
    saveInitialDimensions() {
      // Tangkap dimensi awal tanpa manipulasi
      this.originalText = this.el.innerText;
      this.originalHeight = this.el.offsetHeight;
      this.originalWidth = this.el.offsetWidth;
      this.originalPosition = this.el.getBoundingClientRect();

      // Set height minimum untuk menjaga konsistensi
      this.el.style.minHeight = `${this.originalHeight}px`;

      // Tambahkan class agar kita bisa melacak elemen ini
      this.el.classList.add("scramble-initialized");
    }

    setText(newText) {
      // Batasi jumlah karakter maksimum berdasarkan jenis elemen
      if (this.isTitle && newText.length > 18) {
        // Batasi title menjadi maksimal 18 karakter
        newText = newText.substring(0, 18);
      } else if (!this.isTitle && newText.length > 350) {
        // Batasi description tetap 350 karakter
        newText = newText.substring(0, 350);
      }

      // Pastikan dimensi tetap konsisten
      this.el.style.minHeight = `${this.originalHeight}px`;

      const oldText = this.el.innerText;
      const length = Math.max(oldText.length, newText.length);
      const promise = new Promise((resolve) => (this.resolve = resolve));
      this.queue = [];

      for (let i = 0; i < length; i++) {
        const from = oldText[i] || "";
        const to = newText[i] || "";
        const start = Math.floor(Math.random() * 40);
        const end = start + Math.floor(Math.random() * 40);
        this.queue.push({ from, to, start, end });
      }

      cancelAnimationFrame(this.frameRequest);
      this.frame = 0;
      this.update();

      return promise;
    }

    update() {
      let output = "";
      let complete = 0;

      for (let i = 0, n = this.queue.length; i < n; i++) {
        let { from, to, start, end, char } = this.queue[i];

        if (this.frame >= end) {
          complete++;
          output += to;
        } else if (this.frame >= start) {
          if (!char || Math.random() < 0.28) {
            char = this.randomChar();
            this.queue[i].char = char;
          }
          output += `<span class="scramble-char">${char}</span>`;
        } else {
          output += from;
        }
      }

      // Update konten
      this.el.innerHTML = output;

      // Pastikan height tetap konsisten selama animasi
      if (this.el.offsetHeight !== this.originalHeight) {
        this.el.style.minHeight = `${this.originalHeight}px`;
      }

      if (complete === this.queue.length) {
        this.resolve();
      } else {
        this.frameRequest = requestAnimationFrame(this.update);
        this.frame++;
      }
    }

    randomChar() {
      return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
  }

  // Memastikan layout konsisten
  function ensureConsistentLayout() {
    // Fix layout untuk tech stack
    const techStack = document.querySelector(".mt-6, .mt-4, .mt-3");
    if (techStack) {
      techStack.style.marginTop = "1rem";
    }

    // Pastikan description wrapper memiliki height yang tepat
    const descriptionWrapper = document.querySelector(".description-wrapper");
    if (descriptionWrapper) {
      const minHeight = window.innerWidth <= 768 ? "120px" : "150px";
      descriptionWrapper.style.minHeight = minHeight;
    }

    // Pastikan title dan description memiliki height yang konsisten
    const titleElement = document.getElementById("about-title");
    const descriptionElement = document.getElementById("about-description");

    if (
      titleElement &&
      !titleElement.classList.contains("scramble-initialized")
    ) {
      titleElement.style.minHeight = `${titleElement.offsetHeight}px`;
    }

    if (
      descriptionElement &&
      !descriptionElement.classList.contains("scramble-initialized")
    ) {
      descriptionElement.style.minHeight = `${descriptionElement.offsetHeight}px`;
    }
  }

  // Dapatkan elemen yang akan diubah
  const titleElement = document.getElementById("about-title");
  const descriptionElement = document.getElementById("about-description");
  const aboutSection = document.getElementById("about");

  if (!titleElement || !descriptionElement || !aboutSection) {
    console.warn("Required elements not found");
    return;
  }

  // Pastikan layout konsisten sebelum inisialisasi
  ensureConsistentLayout();

  // Simpan konten asli
  const originalTitle = titleElement.textContent.trim();
  const originalDescription = descriptionElement.textContent.trim();

  // Konten alternatif dengan panjang terkontrol (TANPA Web Developer)
  const alternativeContent = [
    {
      title: "Gaming Tactician",
      description:
        "Sometimes I push rank in Mobile Legends or Honor of Kings, and other times I enjoy hunting monsters with Dual Blades in Monster Hunter. When boredom hits, Call of Duty Mobile is my go-to escape. For me, gaming isn't just entertainment—it's a fun way to sharpen strategic thinking, boost reaction time, and strengthen creative problem-solving skills.",
    },
    {
      title: "Movie Enthusiast",
      description:
        "Fantasy, action, horror, romance—as long as the story hits, I'm all in. I love films that make me think, laugh, or even leave me speechless after the credits roll. Sometimes the visuals are stunning, other times the story is simple but deeply moving. Watching movies is a place where I can discover new perspectives I never thought of.",
    },
    {
      title: "Chill Adventurer",
      description:
        "My ideal weekend? A refreshing swim and food adventure. Exploring flavors and vibes is just as exciting to me as exploring new tools or frameworks. Swimming clears my mind and gives me balance after long hours at my desk, while trying out new food introduces me to different cultures and ways of seeing the world. It's my perfect balance to coding.",
    },
  ];

  // Pastikan semua title dalam array tidak melebihi 18 karakter
  for (let i = 0; i < alternativeContent.length; i++) {
    if (alternativeContent[i].title.length > 18) {
      alternativeContent[i].title = alternativeContent[i].title.substring(
        0,
        18
      );
    }
  }

  // Tambahkan konten asli di awal array
  const allContent = [
    { title: originalTitle, description: originalDescription },
    ...alternativeContent,
  ];

  // Inisialisasi scramblers
  const titleScrambler = new TextScramble(titleElement);
  const descriptionScrambler = new TextScramble(descriptionElement);

  let currentIndex = 0;
  let isChanging = false;
  let contentInterval = null;

  // Fungsi untuk mengganti konten
  function changeContent() {
    // Periksa apakah hero section terlihat
    if (!isElementInViewport(aboutSection) || isChanging) {
      return;
    }

    isChanging = true;

    // Update indeks
    currentIndex = (currentIndex + 1) % allContent.length;
    const nextContent = allContent[currentIndex];

    // Scramble judul
    titleScrambler.setText(nextContent.title).then(() => {
      // Setelah scramble judul selesai, scramble deskripsi
      descriptionScrambler.setText(nextContent.description).then(() => {
        isChanging = false;
        ensureConsistentLayout();
      });
    });
  }

  // Fungsi untuk start/stop interval berdasarkan visibility
  function manageContentInterval() {
    // Jika hero section terlihat dan interval belum berjalan
    if (isElementInViewport(aboutSection)) {
      if (!contentInterval) {
        // Mulai interval jika belum ada
        contentInterval = setInterval(changeContent, 14000);
      }
    } else {
      // Jika tidak terlihat dan interval sedang berjalan
      if (contentInterval) {
        // Hentikan interval
        clearInterval(contentInterval);
        contentInterval = null;
      }
    }
  }

  // Panggil sekali di awal
  manageContentInterval();

  // Periksa visibility saat scrolling
  window.addEventListener("scroll", manageContentInterval, { passive: true });

  // Periksa kembali saat resize window
  window.addEventListener("resize", function () {
    ensureConsistentLayout();
    manageContentInterval();
  });

  // Fix untuk mobile
  if (window.innerWidth <= 768) {
    // Pastikan particles tidak mengganggu
    const particlesContainer = document.getElementById("particles-js");
    if (particlesContainer) {
      particlesContainer.style.position = "absolute";
      particlesContainer.style.pointerEvents = "none";
    }
  }
});
