// Data: moonKnowledge spans from 1959 to 2025+
const moonKnowledge = [
    { year: 1959, agency: 'USSR', name: 'Luna 2', facts: ['First spacecraft to reach the surface of the Moon.', 'Impacted east of Mare Imbrium.'], keyword: 'luna 2' },
    { year: 1959, agency: 'USSR', name: 'Luna 3', facts: ['Returned first photographs of the far side of the Moon.'], keyword: 'luna 3' },
    { year: 1966, agency: 'USSR', name: 'Luna 9', facts: ['First survivable landing on a celestial body.', 'Transmitted photographic data to Earth.'], keyword: 'luna 9' },
    { year: 1966, agency: 'NASA', name: 'Surveyor 1', facts: ['First US soft landing on the Moon.', 'Gathered data for Apollo missions.'], keyword: 'surveyor' },
    { year: 1968, agency: 'NASA', name: 'Apollo 8', facts: ['First crewed spacecraft to orbit the Moon.', 'Famous Earthrise photo taken.'], keyword: 'apollo 8' },
    { year: 1969, agency: 'NASA', name: 'Apollo 11', facts: ['First humans to walk on the Moon.', 'Neil Armstrong and Buzz Aldrin.'], keyword: 'apollo 11' },
    { year: 1969, agency: 'NASA', name: 'Apollo 12', facts: ['Pinpoint landing near Surveyor 3.', 'Deployed ALSEP surface experiments.'], keyword: 'apollo 12' },
    { year: 1970, agency: 'USSR', name: 'Luna 16', facts: ['First successful fully automatic lunar sample return.'], keyword: 'luna 16' },
    { year: 1970, agency: 'USSR', name: 'Lunokhod 1', facts: ['First successful roving remote-controlled robot on the Moon.'], keyword: 'lunokhod' },
    { year: 1971, agency: 'NASA', name: 'Apollo 14', facts: ['Alan Shepard hits a golf ball on the Moon.'], keyword: 'apollo 14' },
    { year: 1971, agency: 'NASA', name: 'Apollo 15', facts: ['First use of the Lunar Roving Vehicle (LRV).'], keyword: 'apollo 15' },
    { year: 1972, agency: 'NASA', name: 'Apollo 16', facts: ['Landed in the Descartes Highlands.'], keyword: 'apollo 16' },
    { year: 1972, agency: 'NASA', name: 'Apollo 17', facts: ['Last crewed mission to the Moon.', 'Eugene Cernan and Harrison Schmitt.'], keyword: 'apollo 17' },
    { year: 1976, agency: 'USSR', name: 'Luna 24', facts: ['Last Soviet lunar mission.', 'Returned samples from Mare Crisium.'], keyword: 'luna 24' },
    { year: 1990, agency: 'JAXA', name: 'Hiten', facts: ['First non-US/Soviet lunar probe.', 'Tested aerobraking techniques.'], keyword: 'hiten' },
    { year: 1994, agency: 'NASA', name: 'Clementine', facts: ['Mapped the lunar surface in multiple wavelengths.'], keyword: 'clementine' },
    { year: 1998, agency: 'NASA', name: 'Lunar Prospector', facts: ['Detected evidence of water ice at lunar poles.'], keyword: 'prospector' },
    { year: 2003, agency: 'ESA', name: 'SMART-1', facts: ['First European mission to the Moon.', 'Used solar electric propulsion.'], keyword: 'smart' },
    { year: 2007, agency: 'JAXA', name: 'Kaguya', facts: ['Obtained global high-definition lunar mapping data.'], keyword: 'kaguya' },
    { year: 2007, agency: 'CNSA', name: 'Chang\'e 1', facts: ['First Chinese lunar orbiter.', 'Created accurate 3D map of the surface.'], keyword: 'change 1' },
    { year: 2008, agency: 'ISRO', name: 'Chandrayaan-1', facts: ['First Indian lunar probe.', 'Moon Impact Probe discovered water molecules.'], keyword: 'chandrayaan 1' },
    { year: 2009, agency: 'NASA', name: 'LRO / LCROSS', facts: ['High-res mapping and confirmed water in Cabeus crater.'], keyword: 'lro' },
    { year: 2010, agency: 'CNSA', name: 'Chang\'e 2', facts: ['Mapped surface at higher resolution, then visited asteroid Toutatis.'], keyword: 'change 2' },
    { year: 2013, agency: 'NASA', name: 'LADEE', facts: ['Studied the lunar exosphere and dust.'], keyword: 'ladee' },
    { year: 2013, agency: 'CNSA', name: 'Chang\'e 3', facts: ['First soft landing since 1976.', 'Deployed Yutu rover.'], keyword: 'change 3' },
    { year: 2018, agency: 'CNSA', name: 'Chang\'e 4', facts: ['First ever soft landing on the far side of the Moon.', 'Deployed Yutu-2 rover.'], keyword: 'change 4' },
    { year: 2019, agency: 'ISRO', name: 'Chandrayaan-2', facts: ['Orbiter successful, but Vikram lander crashed.'], keyword: 'chandrayaan 2' },
    { year: 2020, agency: 'CNSA', name: 'Chang\'e 5', facts: ['First lunar sample return since 1976.'], keyword: 'change 5' },
    { year: 2022, agency: 'NASA', name: 'Artemis I', facts: ['Uncrewed test flight of SLS and Orion spacecraft around the Moon.'], keyword: 'artemis 1' },
    { year: 2022, agency: 'KARI', name: 'Danuri', facts: ['First South Korean lunar orbiter.'], keyword: 'danuri' },
    { year: 2023, agency: 'ISRO', name: 'Chandrayaan-3', facts: ['First soft landing near the lunar south pole.'], keyword: 'chandrayaan 3' },
    { year: 2024, agency: 'JAXA', name: 'SLIM', facts: ['Demonstrated pinpoint landing technology.'], keyword: 'slim' },
    { year: 2024, agency: 'CNSA', name: 'Chang\'e 6', facts: ['First sample return from the lunar far side.'], keyword: 'change 6' },
    { year: 2025, agency: 'NASA', name: 'Artemis II', facts: ['Planned first crewed mission to orbit the Moon since Apollo.'], keyword: 'artemis 2' }
];

// Initialize screen resolution
document.getElementById('res-spec').innerText = `${window.innerWidth}x${window.innerHeight}`;

// System container tilt logic
const sysContainer = document.querySelector('.system-container');
document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    if(sysContainer) {
        sysContainer.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`;
    }
});

// Stats Counters
const statValues = document.querySelectorAll('.stat-value');
const animateCounters = () => {
    statValues.forEach(value => {
        const target = +value.getAttribute('data-target');
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if ((increment > 0 && current < target) || (increment < 0 && current > target)) {
                value.innerText = Math.round(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                value.innerText = target.toLocaleString();
            }
        };
        updateCounter();
    });
};

// Intersection Observer for Stats
const statsSection = document.getElementById('stats');
const observer = new IntersectionObserver((entries) => {
    if(entries[0].isIntersecting) {
        animateCounters();
        observer.unobserve(statsSection);
    }
});
if(statsSection) observer.observe(statsSection);

// Build Timeline
const timelineContainer = document.getElementById('timeline-container');
const buildTimeline = () => {
    // add line
    const line = document.createElement('div');
    line.className = 'timeline-line';
    timelineContainer.appendChild(line);

    moonKnowledge.forEach((item, index) => {
        const isUp = index % 2 === 0;
        
        const el = document.createElement('div');
        el.className = `timeline-item ${isUp ? 'up' : 'down'}`;
        
        el.innerHTML = `
            <div class="timeline-node"></div>
            <div class="timeline-content">
                <div class="timeline-year">${item.year}</div>
                <div class="timeline-badge">${item.agency} - ${item.name}</div>
                <ul class="timeline-bullets">
                    ${item.facts.map(f => `<li>${f}</li>`).join('')}
                </ul>
            </div>
        `;
        timelineContainer.appendChild(el);
    });
    
    // adjust line width
    line.style.width = `${moonKnowledge.length * 350 + 200}px`;
};
buildTimeline();


// Quiz Logic
const quizData = [
    { q: "Which mission was the first to land humans on the Moon?", options: ["Apollo 8", "Apollo 11", "Luna 9", "Chang'e 3"], ans: 1 },
    { q: "What is the average distance from Earth to the Moon?", options: ["150,000 km", "238,900 km", "384,400 km", "500,000 km"], ans: 2 },
    { q: "Which agency achieved the first soft landing near the lunar south pole?", options: ["NASA", "CNSA", "ESA", "ISRO"], ans: 3 },
    { q: "Who was the first person to walk on the Moon?", options: ["Buzz Aldrin", "Yuri Gagarin", "Neil Armstrong", "Michael Collins"], ans: 2 },
    { q: "What was the name of the first successful remote-controlled lunar rover?", options: ["Yutu", "Lunokhod 1", "Pragyan", "Curiosity"], ans: 1 },
    { q: "Which mission returned the first photos of the Moon's far side?", options: ["Luna 3", "Apollo 8", "Ranger 7", "Surveyor 1"], ans: 0 },
    { q: "What is the name of NASA's current program to return humans to the Moon?", options: ["Apollo II", "Constellation", "Artemis", "Orion"], ans: 2 },
    { q: "Which Chinese mission was the first to land on the far side of the Moon?", options: ["Chang'e 2", "Chang'e 3", "Chang'e 4", "Chang'e 5"], ans: 2 },
    { q: "During which mission did Alan Shepard hit a golf ball on the Moon?", options: ["Apollo 12", "Apollo 14", "Apollo 15", "Apollo 17"], ans: 1 },
    { q: "What was the last crewed mission to the Moon (to date)?", options: ["Apollo 15", "Apollo 16", "Apollo 17", "Apollo 18"], ans: 2 }
];

let currentQuestion = 0;
let score = 0;
const quizContent = document.getElementById('quiz-content');
const progressBar = document.getElementById('quiz-progress');

const loadQuestion = () => {
    if(currentQuestion >= quizData.length) {
        showResults();
        return;
    }

    const qData = quizData[currentQuestion];
    quizContent.innerHTML = `
        <div class="quiz-question">${qData.q}</div>
        <div class="quiz-options">
            ${qData.options.map((opt, i) => `<button class="quiz-btn" data-index="${i}">${opt}</button>`).join('')}
        </div>
    `;

    // update progress
    progressBar.style.width = `${(currentQuestion / quizData.length) * 100}%`;

    document.querySelectorAll('.quiz-btn').forEach(btn => {
        btn.addEventListener('click', (e) => handleAnswer(e.target, qData.ans));
    });
};

const handleAnswer = (btn, correctIndex) => {
    // disable buttons
    document.querySelectorAll('.quiz-btn').forEach(b => b.disabled = true);
    
    const selected = parseInt(btn.getAttribute('data-index'));
    
    if(selected === correctIndex) {
        btn.classList.add('correct');
        score++;
    } else {
        btn.classList.add('wrong');
        btn.classList.add('shake');
        // highlight correct
        document.querySelector(`.quiz-btn[data-index="${correctIndex}"]`).classList.add('correct');
    }

    setTimeout(() => {
        currentQuestion++;
        loadQuestion();
    }, 1500);
};

const showResults = () => {
    progressBar.style.width = '100%';
    quizContent.innerHTML = `
        <div class="quiz-question">Assessment Complete!</div>
        <div style="font-size: 2rem; margin-bottom: 2rem; color: var(--solar-gold); text-align: center;">Score: ${score} / ${quizData.length}</div>
        ${score === quizData.length ? '<div style="text-align: center; color: var(--cyan);">Perfect score! Commander status achieved.</div>' : ''}
    `;

    if(score === quizData.length) {
        fireConfetti();
    }
};

const fireConfetti = () => {
    const colors = ['#FBBF24', '#22D3EE', '#6D28D9', '#F8FAFC'];
    for(let i=0; i<100; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.width = Math.random() * 10 + 5 + 'px';
        particle.style.height = particle.style.width;
        
        // start at center of quiz
        const rect = document.querySelector('.quiz-container').getBoundingClientRect();
        particle.style.left = rect.left + rect.width / 2 + 'px';
        particle.style.top = rect.top + rect.height / 2 + 'px';
        
        document.body.appendChild(particle);

        const angle = Math.random() * Math.PI * 2;
        const velocity = 50 + Math.random() * 150;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;

        particle.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            { transform: `translate(${tx}px, ${ty}px) scale(0)`, opacity: 0 }
        ], {
            duration: 1000 + Math.random() * 1000,
            easing: 'cubic-bezier(0, .9, .57, 1)',
            fill: 'forwards'
        });

        setTimeout(() => particle.remove(), 2000);
    }
};

loadQuestion();


// L.U.N.A Voice Engine
const lunaBtn = document.getElementById('luna-button');
const lunaTerminal = document.getElementById('luna-terminal');
const chatLog = document.getElementById('chat-log');
const listeningIndicator = document.getElementById('listening-indicator');
let hasGreeted = false;
let isListening = false;

// Speech Recognition Setup
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;

if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
        isListening = true;
        listeningIndicator.classList.remove('hidden');
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        addMessage(transcript, 'user');
        processCommand(transcript);
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        addMessage(`Error: ${event.error}`, 'luna');
        isListening = false;
        listeningIndicator.classList.add('hidden');
    };

    recognition.onend = () => {
        isListening = false;
        listeningIndicator.classList.add('hidden');
    };
} else {
    addMessage("Web Speech API not supported in this browser.", 'luna');
}

// TTS Setup
const synth = window.speechSynthesis;
let preferredVoice = null;

const loadVoices = () => {
    const voices = synth.getVoices();
    preferredVoice = voices.find(v => v.name === 'Samantha' || v.name === 'Google UK English Female') || voices[0];
};
loadVoices();
if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = loadVoices;
}

const speak = (text) => {
    if (synth.speaking) synth.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    if(preferredVoice) utterance.voice = preferredVoice;
    utterance.pitch = 1.1;
    utterance.rate = 1.0;
    
    synth.speak(utterance);
    addMessage(text, 'luna');
};

const addMessage = (text, sender) => {
    const div = document.createElement('div');
    div.className = `chat-message ${sender}`;
    div.innerText = text;
    chatLog.appendChild(div);
    chatLog.scrollTop = chatLog.scrollHeight;
};

const processCommand = (text) => {
    // Search knowledge base
    const match = moonKnowledge.find(k => text.includes(k.keyword));
    
    if(match) {
        const response = `Information found for ${match.name}. Year: ${match.year}. Agency: ${match.agency}. ${match.facts.join(' ')}`;
        speak(response);
    } else {
        speak("I couldn't find specific mission data matching your query. Try saying a mission name like Apollo 11 or Chang'e 4.");
    }
};

lunaBtn.addEventListener('click', () => {
    lunaTerminal.classList.toggle('hidden');
    
    if(!lunaTerminal.classList.contains('hidden')) {
        if(!hasGreeted) {
            hasGreeted = true;
            speak("Hello, Explorer. I am L.U.N.A, your Lunar Universal Navigation Assistant. State a mission name to query the database.");
        } else if (recognition && !isListening) {
            try {
                recognition.start();
            } catch(e) {}
        }
    } else {
        if (synth.speaking) synth.cancel();
        if (recognition && isListening) recognition.stop();
    }
});
