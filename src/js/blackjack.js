const suits = ['clubs', 'diamonds', 'hearts', 'spades'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king', 'ace'];

let deck = [];
let dealerHand = [];
let playerHand = [];
let gameActive = true;

function createDeck() {
    deck = [];
    for (let suit of suits) {
        for (let value of values) {
            deck.push({ value, suit, imageUrl: `img/${value}_of_${suit}.png` });
        }
    }
    shuffleDeck();
}

function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function startGame() {
    gameActive = true;
    createDeck();
    dealerHand = [deck.pop(), deck.pop()];
    playerHand = [deck.pop(), deck.pop()];
    displayHands();
    checkInitialBlackjack();
    updateStatus();
    document.getElementById('play-again-btn').style.display = 'none';
    document.getElementById('game-controls').querySelectorAll('button:not(#play-again-btn)').forEach(button => button.style.display = '');
}

function checkInitialBlackjack() {
    const playerValue = getHandValue(playerHand);
    if (playerValue.value === 21) {
        document.getElementById('status').textContent = "Blackjack! Player wins!";
        gameActive = false;
        displayFullDealerHand();
    }
}

function displayHands() {
    displayHand('dealer-hand', dealerHand, false);
    displayHand('player-hand', playerHand, true);
    autoStandCheck();
}

function displayHand(elementId, hand, isPlayer) {
    const handDiv = document.getElementById(elementId);
    handDiv.innerHTML = '';
    if (elementId === 'dealer-hand' && gameActive) {
        handDiv.innerHTML += `<img src="img/back.png" alt="Face Down Card" class="card-back">`; // Face down for the first card
        handDiv.innerHTML += `<img src="${hand[1].imageUrl}" alt="${hand[1].value} of ${hand[1].suit}">`;
        document.getElementById('dealer-total').textContent = `Dealer's Total: ${getHandValue([hand[1]]).value}`;
    } else {
        hand.forEach(card => handDiv.innerHTML += `<img src="${card.imageUrl}" alt="${card.value} of ${card.suit}">`);
        let total = getHandValue(hand);
        if (isPlayer) {
            document.getElementById('player-total').textContent = `Player Total: ${total.text}`;
        } else {
            document.getElementById('dealer-total').textContent = `Dealer's Total: ${total.text}`;
        }
    }
}

function displayFullDealerHand() {
    const handDiv = document.getElementById('dealer-hand');
    handDiv.innerHTML = '';
    dealerHand.forEach(card => handDiv.innerHTML += `<img src="${card.imageUrl}" alt="${card.value} of ${card.suit}">`);
    let total = getHandValue(dealerHand);
    document.getElementById('dealer-total').textContent = `Dealer's Total: ${total.text}`;
}

function playerHits() {
    if (!gameActive) return;
    playerHand.push(deck.pop());
    displayHands();
    if (getHandValue(playerHand).value > 21) {
        document.getElementById('status').textContent = "Player busts!";
        gameActive = false;
    }
}

function playerStands() {
    if (!gameActive) return;
    gameActive = false;
    updatePlayerTotalOnStand(); // Update the player total on stand if it's a soft total
    dealerPlays();
    document.getElementById('game-controls').querySelectorAll('button:not(#play-again-btn)').forEach(button => button.style.display = 'none');
    document.getElementById('play-again-btn').style.display = '';
}

function updatePlayerTotalOnStand() {
    const playerValue = getHandValue(playerHand);
    // Update the display to show only the higher value if it's a soft total
    if (playerValue.text.indexOf('/') !== -1) {
        document.getElementById('player-total').textContent = `Player Total: ${Math.max(...playerValue.text.split('/'))}`;
    }
}

function autoStandCheck() {
    const playerValue = getHandValue(playerHand);
    // Auto stand if the total is 17 or more and it's not a soft total
    if (playerValue.value >= 17 && playerValue.text.indexOf('/') === -1) {
        document.getElementById('status').textContent = "Auto-stand on hard 17 or higher";
        playerStands();
    }
}

async function dealerPlays() {
    displayHand('dealer-hand', dealerHand, false);
    let dealerValue = getHandValue(dealerHand);
    while (dealerValue.value < 17) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Delay for 1 second
        dealerHand.push(deck.pop());
        displayHand('dealer-hand', dealerHand, false);
        dealerValue = getHandValue(dealerHand);
    }
    endGame();
}

function endGame() {
    const dealerValue = getHandValue(dealerHand);
    const playerValue = getHandValue(playerHand);
    let status = "Draw!";
    if (playerValue.value > 21) {
        status = "Dealer wins, player busts!";
    } else if (dealerValue.value > 21) {
        status = "Player wins, dealer busts!";
    } else if (playerValue.value > dealerValue.value) {
        status = "Player wins!";
    } else if (dealerValue.value > playerValue.value) {
        status = "Dealer wins!";
    }
    document.getElementById('status').textContent = status;
    document.getElementById('play-again-btn').style.display = ''; // Show play again button
    document.getElementById('game-controls').querySelectorAll('button:not(#play-again-btn)').forEach(button => button.style.display = 'none');
}

function getHandValue(hand) {
    let value = 0;
    let softValue = 0;
    let hasAce = false;
    hand.forEach(card => {
        if (card.value === 'ace') {
            hasAce = true;
            value += 1;
            softValue += 11;
        } else if (['jack', 'queen', 'king'].includes(card.value)) {
            value += 10;
            softValue += 10;
        } else {
            value += parseInt(card.value);
            softValue += parseInt(card.value);
        }
    });
    if (softValue > 21) softValue = value;
    return {
        value: softValue,
        text: hasAce && softValue != value ? `${value}/${softValue}` : `${softValue}`
    };
}

function updateStatus() {
    const playerTotal = getHandValue(playerHand);
    document.getElementById('player-total').textContent = `Player Total: ${playerTotal.text}`;
    document.getElementById('status').textContent = "Choose your action!";
}

document.addEventListener('DOMContentLoaded', startGame);
