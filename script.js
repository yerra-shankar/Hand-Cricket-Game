// Game state variables
let gameState = {
    phase: 'toss', // 'toss', 'match', 'result'
    tossChoice: null,
    playerBatting: null,
    playerScore: 0,
    systemScore: 0,
    playerBalls: 0,
    systemBalls: 0,
    innings: 1, // 1 or 2
    target: null,
    matchComplete: false
};

// Utility function to generate random number (1-10)
function getRandomNumber() {
    return Math.floor(Math.random() * 10) + 1;
}

// Toss functions
function chooseTossOption(choice) {
    gameState.tossChoice = choice;
    document.getElementById('playerTossChoice').textContent = choice.toUpperCase();
    document.getElementById('tossChoice').style.display = 'block';
}

function performToss() {
    const playerNumber = getRandomNumber();
    const systemNumber = getRandomNumber();
    const total = playerNumber + systemNumber;
    const isOdd = total % 2 === 1;
    const resultType = isOdd ? 'odd' : 'even';
    const playerWon = gameState.tossChoice === resultType;

    // Display toss results
    document.getElementById('playerTossNumber').textContent = playerNumber;
    document.getElementById('systemTossNumber').textContent = systemNumber;
    document.getElementById('tossTotal').textContent = total;
    document.getElementById('tossOddEven').textContent = resultType;
    document.getElementById('tossWinner').textContent = playerWon ? 'You won the toss!' : 'System won the toss!';
    document.getElementById('tossResult').style.display = 'block';

    if (playerWon) {
        document.getElementById('batBowlChoice').style.display = 'block';
    } else {
        // System randomly chooses to bat or bowl
        const systemChoice = Math.random() < 0.5 ? 'bat' : 'bowl';
        gameState.playerBatting = systemChoice === 'bowl';
        document.getElementById('systemInningsChoice').textContent = systemChoice;
        document.getElementById('systemChoice').style.display = 'block';
    }
}

function chooseInningsOption(choice) {
    gameState.playerBatting = choice === 'bat';
    startMatch();
}

function startMatch() {
    gameState.phase = 'match';
    document.getElementById('tossPhase').style.display = 'none';
    document.getElementById('matchPhase').style.display = 'block';
    updateMatchDisplay();
}

// Match functions
function updateMatchDisplay() {
    document.getElementById('playerScore').textContent = gameState.playerScore;
    document.getElementById('systemScore').textContent = gameState.systemScore;
    document.getElementById('playerBalls').textContent = gameState.playerBalls;
    document.getElementById('systemBalls').textContent = gameState.systemBalls;

    // Update current batsman info
    const currentBatsman = gameState.playerBatting ? 'Player' : 'System';
    let inningsText = `${currentBatsman} is batting`;
    
    if (gameState.innings === 2 && gameState.target !== null) {
        const remainingRuns = gameState.target - (gameState.playerBatting ? gameState.playerScore : gameState.systemScore) + 1;
        inningsText += ` (Need ${Math.max(0, remainingRuns)} more runs to win)`;
    }
    
    document.getElementById('currentBatsmanInfo').textContent = inningsText;
    document.getElementById('targetScore').textContent = gameState.target !== null ? gameState.target : '-';
}

function playBall(playerChoice) {
    const systemChoice = getRandomNumber();
    
    // Display ball result
    document.getElementById('lastPlayerChoice').textContent = playerChoice;
    document.getElementById('lastSystemChoice').textContent = systemChoice;
    document.getElementById('ballResultDisplay').style.display = 'block';
    
    let outcome = '';
    let isOut = playerChoice === systemChoice;
    
    if (isOut) {
        outcome = '🚫 OUT! Numbers matched!';
        handleWicket();
    } else {
        // Add runs to current batsman's score
        if (gameState.playerBatting) {
            gameState.playerScore += playerChoice;
            gameState.playerBalls++;
            outcome = `✅ Player scored ${playerChoice} runs!`;
        } else {
            gameState.systemScore += systemChoice;
            gameState.systemBalls++;
            outcome = `✅ System scored ${systemChoice} runs!`;
        }
        
        // Check if target is reached in second innings
        if (gameState.innings === 2 && checkTargetReached()) {
            endMatch();
            return;
        }
    }
    
    document.getElementById('ballOutcome').textContent = outcome;
    updateMatchDisplay();
}

function handleWicket() {
    if (gameState.innings === 1) {
        // Switch innings
        gameState.innings = 2;
        gameState.target = gameState.playerBatting ? gameState.playerScore : gameState.systemScore;
        gameState.playerBatting = !gameState.playerBatting;
        
        setTimeout(() => {
            alert(`First innings complete! Target: ${gameState.target + 1} runs`);
            document.getElementById('ballResultDisplay').style.display = 'none';
            updateMatchDisplay();
        }, 1000);
    } else {
        // Second innings wicket - match ends
        endMatch();
    }
}

function checkTargetReached() {
    if (gameState.innings === 2 && gameState.target !== null) {
        const currentScore = gameState.playerBatting ? gameState.playerScore : gameState.systemScore;
        return currentScore > gameState.target;
    }
    return false;
}

function endMatch() {
    gameState.phase = 'result';
    gameState.matchComplete = true;
    
    document.getElementById('matchPhase').style.display = 'none';
    document.getElementById('resultPhase').style.display = 'block';
    
    // Display final scores
    document.getElementById('finalPlayerScore').textContent = gameState.playerScore;
    document.getElementById('finalSystemScore').textContent = gameState.systemScore;
    document.getElementById('finalPlayerBalls').textContent = gameState.playerBalls;
    document.getElementById('finalSystemBalls').textContent = gameState.systemBalls;
    
    // Determine winner
    let winnerText = '';
    if (gameState.playerScore > gameState.systemScore) {
        winnerText = '🎉 Congratulations! You Won! 🎉';
    } else if (gameState.systemScore > gameState.playerScore) {
        winnerText = '😔 System Wins! Better luck next time! 😔';
    } else {
        winnerText = '🤝 It\'s a Tie! Great game! 🤝';
    }
    
    document.getElementById('matchWinner').textContent = winnerText;
}

function restartGame() {
    // Reset all game state
    gameState = {
        phase: 'toss',
        tossChoice: null,
        playerBatting: null,
        playerScore: 0,
        systemScore: 0,
        playerBalls: 0,
        systemBalls: 0,
        innings: 1,
        target: null,
        matchComplete: false
    };
    
    // Reset UI
    document.getElementById('tossPhase').style.display = 'block';
    document.getElementById('matchPhase').style.display = 'none';
    document.getElementById('resultPhase').style.display = 'none';
    document.getElementById('tossChoice').style.display = 'none';
    document.getElementById('tossResult').style.display = 'none';
    document.getElementById('batBowlChoice').style.display = 'none';
    document.getElementById('systemChoice').style.display = 'none';
    document.getElementById('ballResultDisplay').style.display = 'none';
}
