document.addEventListener("DOMContentLoaded", ready);

class Card {
    constructor(element) {
        this.element = element;
        this.number = null;
        this.isMatched = false;
        this.isflipped = false;
    }

    reset() {
        this.number = null;
        this.isMatched = false;
        this.isflipped = false;
    }

    flip() {
        if (!this.isMatched && !this.isflipped) {
            // this.isflipped = !this.isflipped;
            // this.element.classList.toggle('is-flipped');

            this.isflipped = true;
            this.element.classList.add('is-flipped');
        }
    }

    unFlip() {
        this.isflipped = false;
        this.element.classList.remove('is-flipped');
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

    cardFlipCount() {
        let count = 0;

        this.cards.forEach((card) => {
            if (card.isflipped && !card.isMatched) {
                count++;
            }
        });

        return count;
    }

    unFlipNotMatchedCards() {
        this.cards.forEach((card) => {
            if (card.isflipped && !card.isMatched) {
                card.unFlip();
            }
        });
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

        // Set both cards matched if teh number are the same
        if (card1 && card2 && card1.number == card2.number) {
            card1.isMatched = true;
            card2.isMatched = true;
        }
    }

    debugPrint() {
        console.clear();
        console.log('cardFlipCount', this.cardFlipCount());
        console.log('isStarted', this.isStarted);
        console.log('hasAllCardMatched', this.hasAllCardMatched())
        this.cards.forEach((card) => {
            console.log(card);
        });
    }
}

const numberOfCards = document.querySelectorAll('.card').length;
const cardGame = new CardGame(numberOfCards);
let totalSeconds = 0;
let intervalId;

function ready() {
    cardGame.cards.forEach((card) => {
        card.element.addEventListener('click', () => onCardClick(card));
    })
}

function onCardClick(card) {
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

    // Check every third flip if card not matched
    if (cardGame.cardFlipCount() > 1) {
        cardGame.unFlipNotMatchedCards();
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

function newGame() {
    totalSeconds = 0;

    if (intervalId) {
        clearInterval(intervalId);
    }

    intervalId = setInterval(setTime, 1000);

    cardGame.start();
    cardGame.debugPrint();
}

function setTime() {
    let minutesLabel = document.getElementById("minutes");
    let secondsLabel = document.getElementById("seconds");

    totalSeconds = totalSeconds + 1;
    secondsLabel.innerHTML = pad(totalSeconds % 60);
    minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
}

function pad(val) {
    let valString = val + "";

    if (valString.length < 2) {
        return "0" + valString;
    } else {
        return valString;
    }
}