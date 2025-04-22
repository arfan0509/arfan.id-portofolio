document.addEventListener("DOMContentLoaded", function () {
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
      } else if (!this.isTitle && newText.length > 355) {
        // Batasi description tetap 350 karakter
        newText = newText.substring(0, 355);
      }

      // Simpan state sebelum animasi
      const scrollPos = window.scrollY;

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

      // Kunci layout selama animasi
      document.body.style.overflowX = "hidden";

      cancelAnimationFrame(this.frameRequest);
      this.frame = 0;

      // Mulai update
      requestAnimationFrame(() => {
        this.update();
        // Pertahankan posisi scroll
        window.scrollTo(0, scrollPos);
      });

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
        // Animasi selesai
        document.body.style.overflowX = "";
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

  if (!titleElement || !descriptionElement) {
    console.warn("Title or description elements not found");
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

  // Fungsi untuk mengganti konten
  function changeContent() {
    if (isChanging) return;
    isChanging = true;

    // Simpan posisi scroll
    const scrollPos = window.scrollY;

    // Update indeks
    currentIndex = (currentIndex + 1) % allContent.length;
    const nextContent = allContent[currentIndex];

    // Scramble judul
    titleScrambler.setText(nextContent.title).then(() => {
      // Setelah scramble judul selesai, scramble deskripsi
      descriptionScrambler.setText(nextContent.description).then(() => {
        isChanging = false;

        // Pastikan layout tetap konsisten
        ensureConsistentLayout();

        // Kembalikan ke posisi scroll semula
        window.scrollTo(0, scrollPos);
      });
    });
  }

  // Ganti konten setiap 14 detik
  setInterval(changeContent, 14000);

  // Fix untuk mobile
  if (window.innerWidth <= 768) {
    // Pastikan particles tidak mengganggu
    const particlesContainer = document.getElementById("particles-js");
    if (particlesContainer) {
      particlesContainer.style.position = "absolute";
      particlesContainer.style.pointerEvents = "none";
    }
  }

  // Tangani event resize untuk responsive
  window.addEventListener("resize", ensureConsistentLayout);
});
