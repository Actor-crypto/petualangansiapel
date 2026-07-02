// ========================================
// Petualangan Si Apel - JavaScript (Video Version)
// ========================================

// === REFERENSI VIDEO ===
const videoPlayer = document.getElementById('organ-video');

// === DATA ORGAN (masing-masing pakai file video terpisah) ===
const organs = [
    {
        name: "Mulut",
        video: "videos/mulut.mp4",
        text: "Makanan dipotong dan dihaluskan secara mekanik oleh gigi serta dicerna secara kimiawi oleh enzim ptialin (amilase) dalam air liur."
    },
    {
        name: "Kerongkongan",
        video: "videos/kerongkongan.mp4",
        text: "Makanan (yang disebut bolus) didorong menuju lambung melalui gerakan peristaltik."
    },
    {
        name: "Lambung",
        video: "videos/lambung.mp4",
        text: "Makanan dicerna dengan bantuan asam lambung (HCl) untuk membunuh bakteri dan enzim seperti pepsin serta renin untuk memecah protein."
    },
    {
        name: "Usus Halus",
        video: "videos/usus_halus.mp4",
        text: "Tempat terjadinya pencernaan kimiawi lanjutan oleh enzim dari pankreas (tripsin, amilopsin, lipase) serta penyerapan sari-sari makanan, vitamin, dan mineral."
    },
    {
        name: "Usus Besar",
        video: "videos/usus_besar.mp4",
        text: "Sisa makanan yang tidak dicerna mengalami penyerapan air, lalu diubah menjadi feses yang kemudian dikeluarkan melalui anus."
    }
];

// === DATA KUIS ===
const quizData = [
    {
        question: "Di organ manakah Si Apel pertama kali dikunyah?",
        options: ["Lambung", "Mulut", "Usus Halus"],
        correct: "Mulut"
    },
    {
        question: "Gerakan mendorong makanan di kerongkongan disebut gerakan...",
        options: ["Peristaltik", "Mengunyah", "Menelan"],
        correct: "Peristaltik"
    },
    {
        question: "Apa yang terjadi pada makanan di dalam lambung?",
        options: ["Diserap vitaminnya", "Dikeluarkan menjadi kotoran", "Diaduk menjadi bubur cair"],
        correct: "Diaduk menjadi bubur cair"
    },
    {
        question: "Di organ manakah zat gizi diserap oleh tubuh?",
        options: ["Usus Besar", "Usus Halus", "Mulut"],
        correct: "Usus Halus"
    },
    {
        question: "Apa fungsi utama dari Usus Besar?",
        options: ["Menyerap air", "Mengunyah makanan", "Menghasilkan asam"],
        correct: "Menyerap air"
    }
];

// === STATE VARIABLES ===
let currentOrganIndex = 0;
let currentQuestionIndex = 0;
let score = 0;
let selectedAnswer = false;
let userAnswers = []; // Menyimpan jawaban user untuk navigasi kuis

// === REFERENSI AUDIO ===
const bgMusic = document.getElementById('bg-music');
let isPlaying = false;

// ========================================
// FUNGSI NAVIGASI
// ========================================

function navigateTo(screenId) {
    document.querySelectorAll('.screen').forEach(function (screen) {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');

    if (screenId === 'main-menu') {
        playMusic();
    }
}

function exitApp() {
    if (confirm("Apakah kamu yakin ingin keluar dari aplikasi?")) {
        document.body.innerHTML = '<div class="exit-message">Terima kasih sudah belajar!<br>👋</div>';
        stopMusic();
    }
}

// ========================================
// FUNGSI MUSIK
// ========================================

function playMusic() {
    if (!isPlaying && bgMusic) {
        bgMusic.play().then(function () {
            isPlaying = true;
            document.getElementById('music-toggle').innerText = "🔊";
        }).catch(function (err) {
            console.log("Autoplay diblokir browser:", err);
        });
    }
}

function stopMusic() {
    if (bgMusic) {
        bgMusic.pause();
    }
    isPlaying = false;
    document.getElementById('music-toggle').innerText = "🔇";
}

function toggleMusic() {
    if (isPlaying) {
        stopMusic();
    } else {
        playMusic();
    }
}

// ========================================
// FUNGSI PETUALANGAN (VIDEO)
// ========================================

/**
 * Dipanggil saat user klik "Mulai Petualangan"
 */
function startAdventure() {
    navigateTo('adventure-page');
    loadOrgan(0);
}

/**
 * Memuat organ: ganti src video dan putar dari awal
 * Menunggu video siap sebelum play() agar tidak error
 */
function loadOrgan(index) {
    currentOrganIndex = index;
    var organ = organs[index];

    document.getElementById('organ-title').innerText = organ.name;
    document.getElementById('organ-text').innerText = organ.text;

    // Ubah label tombol navigasi
    var nextBtn = document.getElementById('organ-next-btn');
    if (index === organs.length - 1) {
        nextBtn.innerText = "Selesai & Kuis 📝";
    } else {
        nextBtn.innerText = "Lanjut ➡";
    }

    // Ganti src video dan tunggu sampai siap baru play
    videoPlayer.pause();
    videoPlayer.muted = true;
    videoPlayer.src = organ.video;
    videoPlayer.load();

    // Setelah video siap, langsung putar
    videoPlayer.oncanplay = function () {
        videoPlayer.play().catch(function (e) {
            console.warn("Autoplay blocked:", e);
        });
        videoPlayer.oncanplay = null; // Hapus handler setelah dipakai sekali
    };
}

// Loop video otomatis saat selesai diputar
videoPlayer.addEventListener('ended', function () {
    videoPlayer.currentTime = 0;
    videoPlayer.play();
});

function nextOrgan() {
    if (currentOrganIndex < organs.length - 1) {
        loadOrgan(currentOrganIndex + 1);
    } else {
        videoPlayer.pause();
        navigateTo('kuis-page');
        startQuiz();
    }
}

function prevOrgan() {
    if (currentOrganIndex > 0) {
        loadOrgan(currentOrganIndex - 1);
    } else {
        videoPlayer.pause();
        navigateTo('main-menu');
    }
}

// ========================================
// FUNGSI KUIS
// ========================================

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    userAnswers = [];

    document.getElementById('quiz-content').style.display = 'flex';
    document.getElementById('result-container').style.display = 'none';
    document.getElementById('next-btn').style.display = 'none';

    loadQuestion();
}

function loadQuestion() {
    selectedAnswer = false;
    document.getElementById('next-btn').style.display = 'none';
    document.getElementById('quiz-back-btn').style.display = 'inline-block';

    var currentQuestion = quizData[currentQuestionIndex];
    var questionNo = currentQuestionIndex + 1;

    // Progress bar
    document.getElementById('progress-bar').style.width =
        (questionNo / quizData.length) * 100 + '%';

    // Teks pertanyaan
    document.getElementById('question-text').innerText =
        questionNo + '. ' + currentQuestion.question;

    // Render opsi
    var optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = "";

    currentQuestion.options.forEach(function (option) {
        var button = document.createElement('button');
        button.innerText = option;
        button.classList.add('option-btn');

        // Jika user sudah pernah menjawab soal ini
        if (userAnswers[currentQuestionIndex] !== undefined) {
            selectedAnswer = true;
            button.disabled = true;

            if (option === currentQuestion.correct) {
                button.classList.add('correct');
            }
            if (option === userAnswers[currentQuestionIndex] && option !== currentQuestion.correct) {
                button.classList.add('wrong');
            }

            document.getElementById('next-btn').style.display = 'inline-block';
        } else {
            button.onclick = function () {
                selectAnswer(button, option);
            };
        }

        optionsContainer.appendChild(button);
    });
}

function selectAnswer(button, selectedOption) {
    if (selectedAnswer) return;
    selectedAnswer = true;

    var correctAnswer = quizData[currentQuestionIndex].correct;
    var allOptions = document.querySelectorAll('.option-btn');

    // Simpan jawaban
    userAnswers[currentQuestionIndex] = selectedOption;

    if (selectedOption === correctAnswer) {
        button.classList.add('correct');
        score++;
    } else {
        button.classList.add('wrong');
        allOptions.forEach(function (opt) {
            if (opt.innerText === correctAnswer) {
                opt.classList.add('correct');
            }
        });
    }

    allOptions.forEach(function (opt) {
        opt.disabled = true;
    });

    document.getElementById('next-btn').style.display = 'inline-block';
}

function prevQuestion() {
    if (currentQuestionIndex === 0) {
        navigateTo('main-menu');
    } else {
        currentQuestionIndex--;
        loadQuestion();
    }
}

function showResult() {
    document.getElementById('quiz-content').style.display = 'none';
    document.getElementById('result-container').style.display = 'flex';

    // Hitung ulang skor dari jawaban tersimpan
    score = 0;
    userAnswers.forEach(function (answer, idx) {
        if (answer === quizData[idx].correct) {
            score++;
        }
    });

    var wrongScore = quizData.length - score;
    var finalScoreValue = (score / quizData.length) * 100;

    document.getElementById('correct-count').innerText = score;
    document.getElementById('wrong-count').innerText = wrongScore;
    document.getElementById('final-score').innerText = finalScoreValue;

    var feedback = "";
    if (finalScoreValue === 100) {
        feedback = "Luar biasa! Kamu sangat paham! 🌟";
    } else if (finalScoreValue >= 60) {
        feedback = "Bagus sekali! Terus belajar ya! 👍";
    } else {
        feedback = "Jangan menyerah! Yuk ulangi lagi. 📚";
    }

    document.getElementById('score-description').innerText = feedback;
}

// ========================================
// EVENT LISTENERS & INISIALISASI
// ========================================

// Tombol "Lanjut" kuis
document.getElementById('next-btn').addEventListener('click', function () {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizData.length) {
        loadQuestion();
    } else {
        showResult();
    }
});

// Splash screen → menu utama setelah 3 detik
setTimeout(function () {
    navigateTo('main-menu');
}, 3000);
