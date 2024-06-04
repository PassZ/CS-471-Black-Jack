let deck = [];
let playerHand = [];
let dealerHand = [];
let playerStand = false;
var betAmount;
let gameEnd = false;
let playerBalance = parseFloat(document.getElementById('bal').textContent);



function startGame() {
    inGame = true;
    playerHand = [];
    dealerHand = [];
    playerStand = false;
    deck = createDeck();
    shuffleDeck(deck);
    // hideMoneyContainer();
    // Here we need to show the correct buttons and hide the correct buttons
    // document.getElementById('player-double-btn').style.display = 'show';
    // Deal initial cards
    while (playerHand.length < 2) {
        playerHand.push(deck.pop());
        dealerHand.push(deck.pop());
    }

    // Update hands on UI
    updateHands();
    checkBlackjack();

    document.getElementById('status').textContent = '';
    document.getElementById('game-controls').style.display = 'block';
    document.getElementById('play-btn').style.display = 'none';
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

    if (playerTotal > 20) {
        determineWinner();
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

function checkBlackjack() {
    const playerTotal = calculateHandTotal(playerHand);
    if (playerTotal === 21) {
        playerStand = true;
        determineWinner();
    }else if (dealerHand[1].value === 'A' ) {
        // impliment logic to ask player if they want insurance
    }

}

function playerHits() {
    if(!playerStand){
        playerHand.push(deck.pop());
        updateHands();
        // document.getElementById('double-btn').style.display = 'none';
    }else{
        alert("Please start a new game.");

    }
}

function playerStands() {
    if(!playerStand) {
        dealerTurn();
        playerStand = true;
    }
    playerStand = true;
}

function playerDoubles() {
    //implement money logic
    document.getElementById('bet').textContent = parseFloat(document.getElementById('bet').textContent) * 2;
    document.getElementById('gameResult').textContent = 'double';
    document.getElementById('double-btn').style.display = 'none';
    inGame = false;
    playerHits();
    playerStands();
}


async function dealerTurn() {
    let dealerTotal = calculateHandTotal(dealerHand);
    const dealerHandDiv = document.getElementById('dealer-hand');
    dealerHandDiv.firstChild.src = `img/cards/${dealerHand[0].value}_of_${dealerHand[0].suit}.png`;
    updateHands();
    while (dealerTotal < 17) {
        await new Promise( resolve => setTimeout( resolve, 1000));
                dealerHand.push(deck.pop());
                dealerTotal = calculateHandTotal(dealerHand);
                updateHands();
    }
    determineWinner();
}

function determineWinner() {
    const playerTotal = calculateHandTotal(playerHand);
    const dealerTotal = calculateHandTotal(dealerHand);
    inGame = false;
    let result = '';
    if( playerTotal > 21 ){
        result = 'Dealer Wins!'
        document.getElementById( 'gameResult' ).textContent = 'lose';

    } else if (dealerTotal > 21 || playerTotal > dealerTotal) {
        result = 'Player Wins!';
        document.getElementById( 'gameResult' ).textContent = 'win';
    } else if (playerTotal < dealerTotal) {
        result = 'Dealer Wins!';
        document.getElementById( 'gameResult' ).textContent = 'lose';
    } else {
        result = 'Push!';
        document.getElementById( 'gameResult' ).textContent = 'tie';
    }
    // showMoneyContainer();
    document.getElementById('status').textContent = result;
    document.getElementById('game-controls').style.display = 'none';
    document.getElementById('play-btn').style.display = 'block';
    document.getElementById('betAmount').value = '';
}

function updateStatus() {
    const playerTotal = calculateHandTotal(playerHand);
    document.getElementById('player-total').textContent = `Player Total: ${playerTotal.text}`;
    document.getElementById('status').textContent = "Choose your action!";
}

function gameInit() {
    if( window.location.pathname.includes( 'game.html')){
        document.getElementById('game-controls').style.display = 'none';
        const playerHandDiv = document.getElementById('player-hand');
        const dealerHandDiv = document.getElementById('dealer-hand');
        playerHandDiv.innerHTML = '';
        dealerHandDiv.innerHTML = '';
        for( let i = 0; i < 2; i++ ){
            const cardImg = document.createElement('img');
            cardImg.src = img/cards/back.png;
            cardImg.classList.add('card');
            playerHandDiv.appendChild(cardImg);
        };
        for( let i = 0; i < 2; i++ ){
            const cardImg = document.createElement('img');
            cardImg.src = img/cards/back.png;
            cardImg.classList.add('card');
            dealerHandDiv.appendChild(cardImg);
        };
    }
}

function showBetModal() {
    document.getElementById( 'betModal').style.display = 'block';
}
function closeBetModal() {
    document.getElementById('betModal').style.display = 'none';
}

function showMoneyContainer() {
    document.getElementById('money-container').style.display = 'block';
}

function hideMoneyContainer() {
    document.getElementById('money-container').style.display = 'none';
}

function startGameWithoutBet() {
    document.getElementById( 'bet' ).textContent = '0';
    document.getElementById('gameResult').textContent = '';
    startGame();
}

function startGameWithBet() {
    betAmount = parseFloat(document.getElementById('betAmount').value);
    playerBalance = parseFloat(document.getElementById('bal').textContent);
    if(betAmount > playerBalance){
        alert("Please enter a bet amount less than your balance.");
    }
    else if (!isNaN(betAmount) && betAmount > 0) {
        document.getElementById( "bet").textContent = betAmount;
        document.getElementById('gameResult').textContent = 'bet';
        closeBetModal();
        startGame();
    } else {
        alert("Please enter a valid bet amount.");
    }
}

window.addEventListener('load', gameInit);
