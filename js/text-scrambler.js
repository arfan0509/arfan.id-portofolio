document.addEventListener("DOMContentLoaded", function () {
    // Kelas TextScramble untuk efek acak teks
    class TextScramble {
        constructor(el) {
            this.el = el;
            this.chars = "!<>-_\\/[]{}—=+*^?#________";
            this.update = this.update.bind(this);
        }

        setText(newText) {
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

            this.el.innerHTML = output;

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

    // Konten alternatif untuk About section
    const alternativeContent = [
        {
            title: "Gaming Tactician",
            description:
                "Sometimes I push rank in Mobile Legends or Honor of Kings, and other times I enjoy hunting monsters with Dual Blades in Monster Hunter. When boredom hits, Call of Duty Mobile is my go-to escape. For me, gaming isn’t just entertainment—it’s a fun way to sharpen strategic thinking, boost reaction time, and strengthen creative problem-solving skills.",
        },
        {
            title: "Movie Enthusiast",
            description:
                "Fantasy, action, horror, romance—as long as the story hits, I’m all in. I love films that make me think, laugh, or even leave me speechless after the credits roll. Sometimes the visuals are stunning, other times the story is simple but deeply moving. Watching movies is my kind of escape, and also a place where I discover new perspectives I never thought of before.",
        },
        {
            title: "Hobby: Swimming & Food Exploration",
            description:
                "My ideal weekend? A refreshing swim followed by a food adventure. Exploring flavors and vibes is just as exciting to me as exploring new tools or frameworks. Swimming clears my mind and gives me balance after long hours at my desk, while trying out new food introduces me to different cultures and ways of seeing the world.",
        },
    ];

    // Dapatkan elemen yang akan diubah
    const titleElement = document.getElementById("about-title");
    const descriptionElement = document.getElementById("about-description");

    if (!titleElement || !descriptionElement) {
        console.warn("Title or description elements not found");
        return;
    }

    // Simpan konten asli
    const originalTitle = titleElement.textContent;
    const originalDescription = descriptionElement.textContent;

    // Tambahkan konten asli ke array
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

        // Update indeks
        currentIndex = (currentIndex + 1) % allContent.length;
        const nextContent = allContent[currentIndex];

        // Scramble judul
        titleScrambler.setText(nextContent.title).then(() => {
            // Setelah scramble judul selesai, scramble deskripsi
            descriptionScrambler.setText(nextContent.description).then(() => {
                isChanging = false;
            });
        });
    }

    // Ganti konten setiap 8 detik
    setInterval(changeContent, 14000);
});
