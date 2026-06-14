const inputField = document.getElementById('command-input');
const displayArea = document.getElementById('display-area');
const inventoryList = document.getElementById('inventory-list');
const creditsDisplay = document.querySelector('.value.credits');

let gameState = {
    inventory: ['Cyberdeck', 'Energy Cell'],
    hasBotChip: false,
    panelUnlocked: false,
    puzzleActive: false,
    puzzleLevel: 0,
    credits: 13040
};

// Handle enter key
inputField.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        const commandText = inputField.value.trim();
        if (commandText) {
            processCommand(commandText);
        }
        inputField.value = '';
    }
});

function appendMessage(text, className) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${className}`;
    
    if (className === 'user') {
        msgDiv.innerHTML = `<span class="prompt-symbol">&gt;</span> ${text}`;
    } else {
        msgDiv.innerText = text;
    }
    
    displayArea.appendChild(msgDiv);
    
    // Smooth scroll to bottom
    setTimeout(() => {
        displayArea.scrollTo({
            top: displayArea.scrollHeight,
            behavior: 'smooth'
        });
    }, 50);
}

function updateCredits(amount) {
    gameState.credits += amount;
    creditsDisplay.innerText = `${gameState.credits.toLocaleString()} Ƀ`;
    creditsDisplay.style.color = '#39ff14';
    creditsDisplay.style.textShadow = '0 0 10px #39ff14';
    setTimeout(() => {
        creditsDisplay.style.color = '';
        creditsDisplay.style.textShadow = '';
    }, 500);
}

function updateProgress() {
    const hackProgress = document.getElementById('hack-progress');
    if (hackProgress) {
        hackProgress.innerText = `${gameState.puzzleLevel}/3`;
        hackProgress.style.color = '#39ff14';
        hackProgress.style.textShadow = '0 0 10px #39ff14';
        setTimeout(() => {
            hackProgress.style.color = '';
            hackProgress.style.textShadow = '';
        }, 500);
    }
}

function presentPuzzle() {
    switch (gameState.puzzleLevel) {
        case 0:
            appendMessage("SYSTEM: Bypass Sequence Lvl 1. Pattern: 1, 3, 5, 7, [?] - Type 'solve [answer]' to input.", "system");
            break;
        case 1:
            appendMessage("SYSTEM: Bypass Sequence Lvl 2. Pattern: 2, 4, 8, 16, [?] - Type 'solve [answer]' to input.", "system");
            break;
        case 2:
            appendMessage("SYSTEM: Bypass Sequence Lvl 3. Pattern: A, C, E, G, [?] - Type 'solve [answer]' to input.", "system");
            break;
    }
}

function addInventoryItem(name, icon) {
    if (gameState.inventory.includes(name)) return;
    
    gameState.inventory.push(name);
    
    const li = document.createElement('li');
    li.className = 'inventory-item';
    li.innerHTML = `
        <span class="icon">${icon}</span>
        <span class="item-name">${name}</span>
    `;
    
    inventoryList.appendChild(li);
    
    // Flash effect
    li.style.background = 'rgba(57, 255, 20, 0.2)';
    li.style.borderColor = '#39ff14';
    li.style.transform = 'translateX(10px)';
    setTimeout(() => {
        li.style.background = '';
        li.style.borderColor = '';
        li.style.transform = '';
    }, 500);
}

function processCommand(cmd) {
    appendMessage(cmd, 'user');
    
    const args = cmd.toLowerCase().split(' ');
    const action = args[0];
    const target = args[1] || '';
    
    setTimeout(() => {
        switch(action) {
            case 'scan':
                appendMessage("Executing wide-band scan...", "system");
                setTimeout(() => {
                    appendMessage("SCAN COMPLETE: 1 damaged bot (contains usable data). 1 security panel (locked).", "info");
                }, 600);
                break;
                
            case 'inspect':
                if (!target) {
                    appendMessage("ERROR: Missing target. Syntax: inspect [target]", "error");
                } else if (target === 'bot') {
                    if (!gameState.hasBotChip) {
                        appendMessage("The security bot is offline. A [Data Chip] is exposed in its cranial port.", "info");
                    } else {
                        appendMessage("The bot is completely stripped of useful components.", "description");
                    }
                } else if (target === 'panel') {
                    if (gameState.panelUnlocked) {
                        appendMessage("The panel is unlocked. The blast doors remain open.", "info");
                    } else {
                        appendMessage("A heavy blast door control panel. It requires hacking or a keycard to 'solve'.", "description");
                    }
                } else if (target === 'chip') {
                    appendMessage("A standard Militech data storage unit. Looks valuable.", "description");
                } else {
                    appendMessage(`No data available for '${target}'.`, "error");
                }
                break;
                
            case 'take':
            case 'grab':
                if (!target) {
                    appendMessage("ERROR: Missing target. Syntax: take [item]", "error");
                } else if (target === 'chip') {
                    if (!gameState.hasBotChip) {
                        appendMessage("You carefully extract the Data Chip. It holds valuable intel.", "success");
                        addInventoryItem("Data Chip", "💾");
                        gameState.hasBotChip = true;
                        setTimeout(() => {
                            updateCredits(500);
                            appendMessage("SYSTEM: +500 Credits (Intel Bounty)", "system");
                        }, 800);
                    } else {
                        appendMessage("You already took the chip.", "error");
                    }
                } else {
                    appendMessage(`Cannot take '${target}'.`, "error");
                }
                break;
                
            case 'solve':
            case 'hack':
            case 'use':
                if (gameState.panelUnlocked) {
                    appendMessage("The panel is already unlocked. The blast doors remain open.", "error");
                    break;
                }
                
                if (!target) {
                    if (gameState.puzzleActive) {
                        appendMessage("ERROR: Missing answer. Syntax: solve [answer]", "error");
                    } else {
                        appendMessage("ERROR: Missing target. Syntax: solve [target]", "error");
                    }
                } else if (!gameState.puzzleActive) {
                    if (target === 'panel') {
                        appendMessage("Initiating neural bypass protocol...", "system");
                        gameState.puzzleActive = true;
                        setTimeout(() => {
                            presentPuzzle();
                        }, 800);
                    } else {
                        appendMessage(`Cannot solve '${target}'.`, "error");
                    }
                } else {
                    // We are in puzzle mode, target is the user's answer
                    let correct = false;
                    if (gameState.puzzleLevel === 0 && target === '9') correct = true;
                    if (gameState.puzzleLevel === 1 && target === '32') correct = true;
                    if (gameState.puzzleLevel === 2 && target === 'i') correct = true;
                    
                    if (correct) {
                        gameState.puzzleLevel++;
                        updateProgress();
                        if (gameState.puzzleLevel >= 3) {
                            gameState.puzzleActive = false;
                            gameState.panelUnlocked = true;
                            appendMessage("ACCESS GRANTED. All security layers bypassed. The heavy doors slide open with a hiss of pneumatics.", "success");
                        } else {
                            appendMessage(`Layer ${gameState.puzzleLevel} bypassed. Proceeding to next layer...`, "success");
                            setTimeout(() => {
                                presentPuzzle();
                            }, 800);
                        }
                    } else {
                        appendMessage("ACCESS DENIED. Invalid pattern sequence. Try again or type 'hint'.", "error");
                    }
                }
                break;
                
            case 'hint':
                if (!gameState.puzzleActive) {
                    appendMessage("No active puzzle to hint.", "error");
                } else {
                    if (gameState.puzzleLevel === 0) appendMessage("HINT: The sequence consists of odd numbers.", "info");
                    if (gameState.puzzleLevel === 1) appendMessage("HINT: Each number is multiplied by 2.", "info");
                    if (gameState.puzzleLevel === 2) appendMessage("HINT: Skip one letter alphabetically (e.g. A->B->C becomes A->C).", "info");
                }
                break;
                
            case 'help':
                appendMessage("AVAILABLE COMMANDS:", "system");
                appendMessage("- scan : Analyze current environment", "info");
                appendMessage("- inspect [target] : Examine an object closely", "info");
                appendMessage("- take [item] : Add an item to your inventory", "info");
                if (gameState.puzzleActive) {
                    appendMessage("- solve [answer] : Input pattern solution", "info");
                    appendMessage("- hint : Get a clue for current pattern", "info");
                } else {
                    appendMessage("- solve [target] : Interact with a puzzle or mechanism", "info");
                }
                appendMessage("- clear : Wipe terminal display", "info");
                break;
                
            case 'clear':
                // clear everything except the initial messages
                const messages = displayArea.querySelectorAll('.message');
                // keep first 5 messages (system init x2, description x2, hint x1)
                messages.forEach((msg, index) => {
                    if (index > 4) msg.remove();
                });
                appendMessage("Terminal buffer cleared.", "system");
                break;
                
            default:
                appendMessage(`ERROR: Unrecognized command '${action}'. Type 'help' for manual.`, "error");
        }
    }, 300); // Simulate network latency
}

// Keep focus on input area when clicking anywhere in the app
document.addEventListener('click', (e) => {
    // Avoid re-focusing if the user is explicitly trying to select text in the display area
    if (window.getSelection().toString().length === 0) {
        inputField.focus();
    }
});

// Initial boot sequence
window.onload = () => {
    inputField.disabled = true;
    inputField.placeholder = "INITIALIZING...";
    
    setTimeout(() => {
        inputField.disabled = false;
        inputField.placeholder = "ENTER COMMAND...";
        inputField.focus();
    }, 1500);
};
