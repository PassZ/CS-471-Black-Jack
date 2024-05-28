let deck = [];
let players = [];
let dealerHand = [];
let playerHands = [];

function startGame(numPlayers) {
    // Clear existing hands
    players = [];
    dealerHand = [];

    // Create deck and shuffle
    deck = createDeck();
    shuffleDeck(deck);

    // Deal cards to players and dealer
    dealCards(numPlayers);

    // Update hands on UI
    updateHands();
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

function dealCards(numPlayers) {
    // Clear hands
    playerHands = [];
    dealerHand = [];

    // Burn the first card
    deck.pop();

    // Deal one card to each player
    for (let i = 0; i < numPlayers; i++) {
        playerHands.push([deck.pop()]); // Each player starts with a single card
    }

    // Deal one card to the dealer
    dealerHand.push(deck.pop());

    // Deal one more card to each player
    for (let i = 0; i < numPlayers; i++) {
        playerHands[i].push(deck.pop());
    }

    // Deal one more card to the dealer
    dealerHand.push(deck.pop());

    return { players: playerHands, dealer: dealerHand };
}


function playerHits(playerIndex) {
    console.log('Player hits');
    players[playerIndex].push(deck.pop());
    updateHands();
}

function playerStands(playerIndex) {
    // Player stands, no action needed
    // Implement logic for dealer's turn
    dealerTurn();
}

function dealerTurn() {
    let dealerTotal = calculateTotal(dealerHand);

    // Dealer hits until their total is 17 or higher
    while (dealerTotal < 17) {
        dealerHand.push(deck.pop());
        dealerTotal = calculateTotal(dealerHand);
    }

    // Update hands on UI
    updateHands();
}


function playerSplit(playerIndex) {
    players[playerIndex].push(deck.pop());
    updateHands();
}

function calculateTotal(hand) {
    let total = 0;
    let aceCount = 0;

    for (let card of hand) {
        if (card.value === 'J' || card.value === 'Q' || card.value === 'K') {
            total += 10;
        } else if (card.value === 'A') {
            aceCount++;
            total += 11;
        } else {
            total += parseInt(card.value);
        }
    }

    // Adjust total for aces
    while (total > 21 && aceCount > 0) {
        total -= 10;
        aceCount--;
    }

    return total;
}

function updateHands() {
    // Implement UI update logic here
}
function renderHands() {
    const playerHandDiv = document.getElementById('player-hand');
    const dealerHandDiv = document.getElementById('dealer-hand');
    playerHandDiv.innerHTML = '';
    dealerHandDiv.innerHTML = '';

    for (let card of playerHand) {
        const cardImg = document.createElement('img');
        cardImg.src = `img/cards/${card.value}_of_${card.suit}.png`;
        playerHandDiv.appendChild(cardImg);
    }

    for (let card of dealerHand) {
        const cardImg = document.createElement('img');
        cardImg.src = `img/cards/${card.value}_of_${card.suit}.png`;
        dealerHandDiv.appendChild(cardImg);
    }
}
document.getElementById('hit-btn').addEventListener('click', function() {
    playerHits();
});