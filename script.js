// Word list for the game
const words = [
    'javascript', 'programming', 'computer', 'hangman', 'developer',
    'function', 'variable', 'array', 'object', 'string',
    'number', 'boolean', 'method', 'console', 'document',
    'element', 'style', 'class', 'github', 'coding',
    'website', 'browser', 'keyboard', 'monitor', 'mouse',
    'laptop', 'desktop', 'software', 'hardware', 'internet',
    'network', 'server', 'client', 'database', 'security',
    'password', 'username', 'email', 'message', 'button',
    'image', 'video', 'audio', 'file', 'folder',
    'window', 'screen', 'pixel', 'color', 'design'
];

let selectedWord = '';
let guessedLetters = [];
let wrongLetters = [];
let mistakes = 0;

// Initialize the game
function initGame() {
    // Select a random word
    selectedWord = words[Math.floor(Math.random() * words.length)];
    guessedLetters = [];
    wrongLetters = [];
    mistakes = 0;
    
    // Hide all body parts
    document.querySelectorAll('.body-part').forEach(part => {
        part.style.display = 'none';
    });
    
    // Reset game over display
    document.getElementById('game-over').classList.remove('show');
    
    // Create keyboard
    createKeyboard();
    
    // Display word with underscores
    updateWordDisplay();
    
    // Clear wrong letters display
    document.getElementById('wrong-letters').textContent = '';
}

// Create the on-screen keyboard
function createKeyboard() {
    const keyboard = document.getElementById('keyboard');
    keyboard.innerHTML = '';
    
    // Create buttons for each letter
    for (let i = 65; i <= 90; i++) {
        const letter = String.fromCharCode(i);
        const button = document.createElement('button');
        button.className = 'letter-btn';
        button.textContent = letter;
        button.onclick = () => handleGuess(letter.toLowerCase());
        keyboard.appendChild(button);
    }
}

// Update the word display
function updateWordDisplay() {
    const wordDisplay = document.getElementById('word-display');
    let display = '';
    
    for (let letter of selectedWord) {
        if (guessedLetters.includes(letter)) {
            display += letter;
        } else {
            display += '_';
        }
        display += ' ';
    }
    
    wordDisplay.textContent = display.trim();
}

// Handle letter guess
function handleGuess(letter) {
    // Disable the button
    const buttons = document.querySelectorAll('.letter-btn');
    buttons.forEach(btn => {
        if (btn.textContent.toLowerCase() === letter) {
            btn.disabled = true;
            
            if (selectedWord.includes(letter)) {
                btn.classList.add('correct');
            } else {
                btn.classList.add('wrong');
            }
        }
    });
    
    // Add to guessed letters
    guessedLetters.push(letter);
    
    // Check if letter is in the word
    if (selectedWord.includes(letter)) {
        updateWordDisplay();
        checkWin();
    } else {
        wrongLetters.push(letter);
        document.getElementById('wrong-letters').textContent = wrongLetters.join(' ');
        mistakes++;
        drawBodyPart();
        
        if (mistakes === 6) {
            endGame(false);
        }
    }
}

// Draw body parts
function drawBodyPart() {
    const parts = ['head', 'body', 'left-arm', 'right-arm', 'left-leg', 'right-leg'];
    if (mistakes <= 6) {
        document.getElementById(parts[mistakes - 1]).style.display = 'block';
    }
}

// Check if player won
function checkWin() {
    const wordWithoutSpaces = document.getElementById('word-display').textContent.replace(/\s/g, '');
    if (wordWithoutSpaces === selectedWord) {
        endGame(true);
    }
}

// End the game
function endGame(won) {
    const gameOver = document.getElementById('game-over');
    const message = document.getElementById('game-over-message');
    const revealWord = document.getElementById('reveal-word');
    
    gameOver.classList.add('show');
    message.textContent = won ? 'Congratulations! You won!' : 'Game Over! You lost!';
    message.style.color = won ? '#28a745' : '#dc3545';
    revealWord.textContent = selectedWord.toUpperCase();
    
    // Disable all letter buttons
    document.querySelectorAll('.letter-btn').forEach(btn => {
        btn.disabled = true;
    });
}

// Reset the game
function resetGame() {
    initGame();
}

// Start the game when page loads
window.onload = initGame;