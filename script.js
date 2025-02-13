const themeToggle = document.getElementById("theme-toggle");

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        themeToggle.textContent = "☀️ Light Mode";
    } else {
        themeToggle.textContent = "🌙 Dark Mode";
    }
});
const textInput = document.getElementById("text-input");
const charCount = document.getElementById("char-count");
const wordCount = document.getElementById("word-count");
const sentenceCount = document.getElementById("sentence-count");
const readingTime = document.getElementById("reading-time");
const excludeSpacesCheckbox = document.getElementById("exclude-spaces");
const charLimitInput = document.getElementById("char-limit");

textInput.addEventListener("input", updateCounts);

function updateCounts() {
    let text = textInput.value;

    if (excludeSpacesCheckbox.checked) {
        text = text.replace(/\s/g, "");  
    }

    charCount.textContent = text.length;
    wordCount.textContent = text.trim() ? text.trim().split(/\s+/).length : 0;
    sentenceCount.textContent = text.split(/[.!?]+/).filter(Boolean).length;
    readingTime.textContent = (wordCount.textContent / 200).toFixed(2);

    if (charLimitInput.value && text.length > charLimitInput.value) {
        textInput.style.border = "2px solid red"; 
    } else {
        textInput.style.border = "2px solid #444";
    }
}
const voiceBtn = document.getElementById("voice-btn");
if ('webkitSpeechRecognition' in window) {
    const recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    voiceBtn.addEventListener("click", () => {
        recognition.start();
        voiceBtn.textContent = "🎙️ Listening...";
    });

    recognition.onresult = (event) => {
        textInput.value += event.results[0][0].transcript + " ";
        recognition.stop();
        voiceBtn.textContent = "🎤 Start Speaking";
    };

    recognition.onerror = () => {
        voiceBtn.textContent = "🎤 Try Again";
    };
} else {
    voiceBtn.disabled = true;
    voiceBtn.textContent = "🚫 Voice Not Supported";
}
const typeSound = new Audio("https://www.fesliyanstudios.com/play-mp3/4387"); // Free typing sound

textInput.addEventListener("keypress", () => {
    typeSound.currentTime = 0; // Reset sound to avoid delay
    typeSound.play();
});
const letterChart = document.getElementById("letterChart").getContext("2d");
let chartInstance;

function updateChart(text) {
    const letters = {};
    text.replace(/[^a-zA-Z]/g, "").split("").forEach(letter => {
        letters[letter] = (letters[letter] || 0) + 1;
    });

    const labels = Object.keys(letters);
    const data = Object.values(letters);

    if (chartInstance) {
        chartInstance.destroy();
    }

    chartInstance = new Chart(letterChart, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Letter Frequency",
                data: data,
                backgroundColor: "rgba(75, 192, 192, 0.6)"
            }]
        }
    });
}
textInput.addEventListener("input", () => {
    updateChart(textInput.value);
});
