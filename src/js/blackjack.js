let deck = [];
let playerHand = [];
let dealerHand = [];
let playerStand = false;

function startGame() {
    playerHand = [];
    dealerHand = [];
    playerStand = false;

    deck = createDeck();
    shuffleDeck(deck);

    // Deal initial cards
    while (playerHand.length < 2) {
        playerHand.push(deck.pop());
        dealerHand.push(deck.pop());
    }

    // Update hands on UI
    updateHands();

    document.getElementById('play-again-btn').style.display = 'none';
    document.getElementById('hit-btn').style.display = 'inline-block';
    document.getElementById('stand-btn').style.display = 'inline-block';
    document.getElementById('status').textContent = '';
}

function createDeck() {
    const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const deck = [];
    for (let suit of suits) {
        for (let value of values) {
            deck.push({ suit, value });
        }
    }
    return deck;
}

function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function getCardValue(card) {
    if (card.value === 'A') {
        return 11;
    } else if (['K', 'Q', 'J'].includes(card.value)) {
        return 10;
    } else {
        return parseInt(card.value);
    }
}

function calculateHandTotal(hand) {
    let total = 0;
    let aceCount = 0;
    for (let card of hand) {
        total += getCardValue(card);
        if (card.value === 'A') {
            aceCount++;
        }
    }
    while (total > 21 && aceCount > 0) {
        total -= 10;
        aceCount--;
    }
    return total;
}

function updateHands() {
    const playerTotal = calculateHandTotal(playerHand);
    document.getElementById('player-total').textContent = `Player's Total: ${playerTotal}`;

    if (playerStand) {
        const dealerTotal = calculateHandTotal(dealerHand);
        document.getElementById('dealer-total').textContent = `Dealer's Total: ${dealerTotal}`;
    } else {
        document.getElementById('dealer-total').textContent = `Dealer's Total: ??`;
    }

    renderHands();

    if (playerTotal > 21) {
        document.getElementById('status').textContent = 'Player Busts! Dealer Wins!';
        endGame();
    }
}

function renderHands() {
    const playerHandDiv = document.getElementById('player-hand');
    const dealerHandDiv = document.getElementById('dealer-hand');
    playerHandDiv.innerHTML = '';
    dealerHandDiv.innerHTML = '';

    playerHand.forEach(card => {
        const cardImg = document.createElement('img');
        cardImg.src = `img/cards/${card.value}_of_${card.suit}.png`;
        cardImg.classList.add('card');
        playerHandDiv.appendChild(cardImg);
    });

    dealerHand.forEach((card, index) => {
        const cardImg = document.createElement('img');
        if (index === 0 && !playerStand) {
            cardImg.src = `img/cards/back.png`;
        } else {
            cardImg.src = `img/cards/${card.value}_of_${card.suit}.png`;
        }
        cardImg.classList.add('card');
        dealerHandDiv.appendChild(cardImg);
    });
}

function playerHits() {
    playerHand.push(deck.pop());
    updateHands();
}

function playerStands() {
    playerStand = true;
    dealerTurn();
}

function dealerTurn() {
    let dealerTotal = calculateHandTotal(dealerHand);
    while (dealerTotal < 17) {
        dealerHand.push(deck.pop());
        dealerTotal = calculateHandTotal(dealerHand);
    }
    updateHands();
    determineWinner();
}

function determineWinner() {
    const playerTotal = calculateHandTotal(playerHand);
    const dealerTotal = calculateHandTotal(dealerHand);

    let result = '';
    if (dealerTotal > 21 || playerTotal > dealerTotal) {
        result = 'Player Wins!';
    } else if (playerTotal < dealerTotal) {
        result = 'Dealer Wins!';
    } else {
        result = 'Push!';
    }

    document.getElementById('status').textContent = result;
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
    document.getElementById('play-btn').style.display = ''; // Show play again button
    document.getElementById('game-controls').querySelectorAll('button:not(#play-again-btn)').forEach(button => button.style.display = 'none');
}

document.getElementById('hit-btn').addEventListener('click', playerHits);
document.getElementById('stand-btn').addEventListener('click', playerStands);
document.getElementById('play-again-btn').addEventListener('click', function() {
    startGame();
});

function updateStatus() {
    const playerTotal = getHandValue(playerHand);
    document.getElementById('player-total').textContent = `Player Total: ${playerTotal.text}`;
    document.getElementById('status').textContent = "Choose your action!";
}

function gameInit() {
    document.getElementById('game-controls').querySelectorAll('button:not(#play-btn)').forEach(button => button.style.display = 'none');
}

document.addEventListener('DOMContentLoaded', gameInit);
window.addEventListener('load', startGame);
