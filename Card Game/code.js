class Card {
    constructor(element) {
        this.element = element;
        this.number = null;
        this.isMatched = false;
        this.isflipped = false;
        this.timeoutId = null
    }

    reset() {
        this.number = null;
        this.isMatched = false;
        this.isflipped = false;
    }

    flip() {
        // this.isflipped = !this.isflipped;
        // this.element.classList.toggle('is-flipped');

        this.isflipped = true;
        this.element.classList.add('is-flipped');

        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
    }

    unFlip() {
        this.isflipped = false;
        this.element.classList.remove('is-flipped');

        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
    }

    unFlipDelay() {
        this.isflipped = false;
        this.timeoutId = setTimeout(() => { this.element.classList.remove('is-flipped') }, 500);
    }

    setNumber(newNumber) {
        this.number = newNumber;
        let face = this.element.querySelector('.card-face-back');
        face.innerHTML = newNumber;
    }
}

class CardGame {
    constructor(numberOfCards) {
        this.numberOfCards = numberOfCards;
        this.cards = [];
        this.isStarted = false;       
    }

    init() {
        let gameBoard = document.getElementById('game-board');

        for(let i = 0; i < 8; i++) {
            gameBoard.innerHTML += `<div class="card-wrapper">
                <div class="card">
                    <div class="card-face no-select card-face-front"></div>
                    <div class="card-face no-select card-face-back"></div>
                </div>
            </div>`;
        }

        let cardElements = document.querySelectorAll('.card');

        cardElements.forEach((cardElement) => {
            const card = new Card(cardElement)
            this.cards.push(card);
        });
    }

    start() {
        this.unFlipAllCards();
        this.cards.forEach((card) => {
            card.reset();
        });

        this.isStarted = true;
        this.assignCardNumber();
    }

    assignCardNumber() {
        let cardNumber = 0;
        let assignCount = 0;

        while (!this.allCardHasNumber()) {
            cardNumber = cardNumber + 1;
            assignCount = 0;

            while (assignCount < 2) {
                let cardIndex = Math.floor(Math.random() * this.numberOfCards);

                if (this.cards[cardIndex].number == null) {
                    this.cards[cardIndex].setNumber(cardNumber);
                    assignCount++;
                }
            }
        }
    }

    allCardHasNumber() {
        for (const card of this.cards) {
            if (card.number == null)
                return false;
        }

        return true;
    }

    unFlipAllCards() {
        this.cards.forEach((card) => {
            card.unFlip();
        });
    }

    hasAllCardMatched() {
        let cardMatchedCount = 0;

        this.cards.forEach((card) => {
            if (card.isMatched) {
                cardMatchedCount++;
            }
        });

        if (cardMatchedCount == this.numberOfCards) {
            return true;
        }

        return false;
    }

    checkCardMatchingStatus() {
        let card1 = null;
        let card2 = null;

        this.cards.forEach((card) => {
            if (card.isflipped && !card.isMatched) {
                if (card1 == null) {
                    card1 = card;
                } else if (card2 == null) {
                    card2 = card;
                }
            }
        });

        // Set both cards to match if the number are the same
        if (card1 && card2 && card1.number == card2.number) {
            card1.isMatched = true;
            card2.isMatched = true;
        }
        // Set unflip both cards if the number are the same
        else if (card1 && card2 && card1.number != card2.number) {
            card1.unFlipDelay();
            card2.unFlipDelay();
        }
    }

    debugPrint() {
        console.clear();
        console.log('isStarted', this.isStarted);
        console.log('hasAllCardMatched', this.hasAllCardMatched())
        this.cards.forEach((card) => {
            console.log(card);
        });
    }
}

const numberOfCards = 8
let cardGame = new CardGame(numberOfCards);
let totalTicks = 0;
let intervalId;

window.onload = function () {
    cardGame.init();
    
    cardGame.cards.forEach((card) => {
        card.element.addEventListener('click', (evt) => onCardClick(evt, card));
        card.element.addEventListener('touchstart', (evt) => onCardClick(evt, card));
    });
};

function onCardClick(evt, card) {
    evt.preventDefault();

    // do not allow to flip card until the game start
    if (!cardGame.isStarted) {
        return;
    }

    // do not allow to flip card is already matched
    if (card.isMatched) {
        return;
    }

    // do not allow to flip card if already has been flipped
    if (card.isflipped) {
        return;
    }

    // flip the card
    card.flip();

    // check matching status again after the card has been flipped
    cardGame.checkCardMatchingStatus();

    // do not allow to flip card if all card have been matched
    if (cardGame.hasAllCardMatched()) {
        cardGame.isStarted = false;

        if (intervalId) {
            clearInterval(intervalId);
        }
    }

    cardGame.debugPrint();
}

function newGame(evt) {
    totalTicks = 0;

    if (intervalId) {
        clearInterval(intervalId);
        resetCountDown();
    }

    intervalId = setInterval(countDown, 100);

    cardGame.start();
    cardGame.debugPrint();
}

function countDown() {
    let minutesLabel = document.getElementById("minutes");
    let secondsLabel = document.getElementById("seconds");
    let ticksLabel = document.getElementById("ticks");

    totalTicks = totalTicks + 1;
    if (totalTicks % 10 == 0) {
        secondsLabel.innerHTML = pad((totalTicks / 10) % 60);
        minutesLabel.innerHTML = pad(parseInt((totalTicks / 10) / 60));
    }

    ticksLabel.innerHTML = pad(totalTicks);
}

function resetCountDown() {
    let minutesLabel = document.getElementById("minutes");
    let secondsLabel = document.getElementById("seconds");
    let ticksLabel = document.getElementById("ticks");

    secondsLabel.innerHTML = '00';
    minutesLabel.innerHTML = '00';
    ticksLabel.innerHTML = '00';
}

function pad(val) {
    let valString = val + "";

    if (valString.length < 2) {
        return "0" + valString;
    } else {
        return valString;
    }
}