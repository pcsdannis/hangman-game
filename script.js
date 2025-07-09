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

// Multiplayer variables
let players = [];
let currentPlayerIndex = 0;
let gameActive = false;

// Player setup functions
function updatePlayerInputs() {
    const numPlayers = parseInt(document.getElementById('num-players').value);
    const playerNamesDiv = document.getElementById('player-names');
    playerNamesDiv.innerHTML = '';
    
    for (let i = 1; i <= numPlayers; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.id = `player-${i}-name`;
        input.placeholder = `Player ${i} Name`;
        input.required = true;
        playerNamesDiv.appendChild(input);
    }
}

function startGame() {
    const numPlayers = parseInt(document.getElementById('num-players').value);
    players = [];
    
    // Get player names
    for (let i = 1; i <= numPlayers; i++) {
        const playerName = document.getElementById(`player-${i}-name`).value.trim();
        if (!playerName) {
            alert(`Please enter a name for Player ${i}`);
            return;
        }
        players.push({
            name: playerName,
            score: 0,
            won: false
        });
    }
    
    // Hide setup screen and show game
    document.getElementById('player-setup').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';
    
    // Initialize scores display
    updateScoresDisplay();
    
    // Start the game
    initGame();
}

// Initialize the game
function initGame() {
    // Select a random word
    selectedWord = words[Math.floor(Math.random() * words.length)];
    guessedLetters = [];
    wrongLetters = [];
    mistakes = 0;
    gameActive = true;
    
    // Reset current player to first player
    currentPlayerIndex = 0;
    updateCurrentPlayerDisplay();
    
    // Hide all body parts
    document.querySelectorAll('.body-part').forEach(part => {
        part.style.display = 'none';
    });
    
    // Reset game over display
    document.getElementById('game-over').classList.remove('show');
    
    // Hide solve input
    hideSolveInput();
    
    // Create keyboard
    createKeyboard();
    
    // Display word with underscores
    updateWordDisplay();
    
    // Clear wrong letters display
    document.getElementById('wrong-letters').textContent = '';
}

// Update scores display
function updateScoresDisplay() {
    const scoresDiv = document.getElementById('scores');
    scoresDiv.innerHTML = '';
    
    players.forEach((player, index) => {
        const scoreDiv = document.createElement('div');
        scoreDiv.className = 'player-score';
        if (index === currentPlayerIndex) {
            scoreDiv.classList.add('active');
        }
        scoreDiv.textContent = `${player.name}: ${player.score}`;
        scoresDiv.appendChild(scoreDiv);
    });
}

// Update current player display
function updateCurrentPlayerDisplay() {
    document.getElementById('current-player').textContent = players[currentPlayerIndex].name;
    updateScoresDisplay();
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
    if (!gameActive) return;
    
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
        } else {
            // Move to next player
            nextTurn();
        }
    }
}

// Solve puzzle functions
function showSolveInput() {
    if (!gameActive) return;
    document.getElementById('solve-input').style.display = 'block';
    document.getElementById('solve-answer').focus();
}

function hideSolveInput() {
    document.getElementById('solve-input').style.display = 'none';
    document.getElementById('solve-answer').value = '';
}

function solvePuzzle() {
    if (!gameActive) return;
    
    const answer = document.getElementById('solve-answer').value.trim().toLowerCase();
    
    if (answer === selectedWord) {
        // Player wins!
        players[currentPlayerIndex].won = true;
        endGame(true);
    } else {
        // Wrong answer, draw body part and move to next player
        alert('Wrong answer!');
        mistakes++;
        drawBodyPart();
        
        if (mistakes === 6) {
            endGame(false);
        } else {
            hideSolveInput();
            nextTurn();
        }
    }
}

// Move to next player
function nextTurn() {
    if (players.length > 1) {
        currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
        updateCurrentPlayerDisplay();
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
        players[currentPlayerIndex].won = true;
        endGame(true);
    }
}

// End the game
function endGame(won) {
    gameActive = false;
    const gameOver = document.getElementById('game-over');
    const message = document.getElementById('game-over-message');
    const revealWord = document.getElementById('reveal-word');
    
    gameOver.classList.add('show');
    
    if (won) {
        const winner = players[currentPlayerIndex];
        winner.score++;
        message.textContent = `${winner.name} wins!`;
        message.style.color = '#28a745';
    } else {
        message.textContent = 'Game Over! Nobody wins!';
        message.style.color = '#dc3545';
    }
    
    revealWord.textContent = selectedWord.toUpperCase();
    
    // Update scores display
    updateScoresDisplay();
    
    // Disable all letter buttons
    document.querySelectorAll('.letter-btn').forEach(btn => {
        btn.disabled = true;
    });
}

// Reset the game
function resetGame() {
    // Reset player won status
    players.forEach(player => player.won = false);
    initGame();
}

// Don't automatically start the game on page load anymore
window.onload = function() {
    // Just show the setup screen
    document.getElementById('player-setup').style.display = 'block';
    document.getElementById('game-container').style.display = 'none';
};