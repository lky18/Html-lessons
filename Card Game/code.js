document.addEventListener("DOMContentLoaded", ready);
var timeoutId;
var intervalId;
var openCount = 0;
var card1 = {
    id: '',
    number: null
}
var card2 = {
    id: '',
    number: null
}
const cardCount = 8;
var matchCount = 0;
var totalSeconds = 0;

function ready() {
    init();
}

function init() {
    var cards = document.querySelectorAll('.card');

    cards.forEach((card) => {
        card.addEventListener('click', function () {
            // do not allow to flip the card until the game start
            if (intervalId == null) {
                return;
            }

            // do not allow to flip the card is already matched
            if (card.dataset.match == 'true') {
                return;
            }

            // do not allow to flip until all the unmatched card have been reset
            if (card1.number != null && card2.number != null) {
                return;
            }

            // increase teh open count to only allow two cards to open at the same time
            openCount = openCount + 1;

            if (openCount < 3) {
                // Buffer the two cards have been opened
                if (openCount == 1) {
                    card1.id = card.id.replace('card-', '');
                    card1.number = card.dataset.number;
                }
                else {
                    card2.id = card.id.replace('card-', '');
                    card2.number = card.dataset.number;
                }

                // trigger the flip animation
                card.classList.toggle('is-flipped');

                // If the two cards are the same, mark them as matched
                if (card1.id != card2.id && card1.number == card2.number) {
                    setCardMatch(card1.id);
                    setCardMatch(card2.id);
                    clearTracking();
                    matchCount++;

                    if (matchCount == (cardCount / 2)) {
                        console.log('done');
                        if (intervalId) {
                            clearInterval(intervalId);
                        }
                    }
                }
                // if both card unmatched, flip the cards to hide the number
                else if (openCount == 2) {
                    timeoutId = setTimeout(unFlipCardsIfNotMatch, 1000);
                }
            }

            printCardNumber();
        });
    });
}

function setTime() {
    var minutesLabel = document.getElementById("minutes");
    var secondsLabel = document.getElementById("seconds");

    ++totalSeconds;
    secondsLabel.innerHTML = pad(totalSeconds % 60);
    minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
}

function pad(val) {
    var valString = val + "";
    if (valString.length < 2) {
        return "0" + valString;
    } else {
        return valString;
    }
}

function newGame() {
    reset();
}

function unFlipAllCards() {
    var cards = document.querySelectorAll('.is-flipped');

    cards.forEach((card) => {
        card.classList.remove('is-flipped');
    });
}

function unFlipCardsIfNotMatch() {
    var cards = document.querySelectorAll('.is-flipped');

    cards.forEach((card) => {
        if (card.dataset.match == 'false') {
            card.classList.remove('is-flipped');
        }
    });

    clearTracking();

    if (timeoutId) {
        clearTimeout(timeoutId);
    }
}

function clearTracking() {
    openCount = 0;
    card1.id = '';
    card1.number = null;
    card2.id = '';
    card2.number = null;
}

function reset() {
    totalSeconds = 0;
    matchCount = 0;

    if (intervalId) {
        clearInterval(intervalId);
    }

    intervalId = setInterval(setTime, 1000);

    clearCardNumber();
    assignCardNumber();
    clearTracking();
    unFlipAllCards();

    printCardNumber();
}

function printCardNumber() {
    var cards = document.querySelectorAll('.card');

    console.log('===================');
    cards.forEach((card) => {
        console.log(card.id, card.dataset.number, card.dataset.match);
    });
    console.log('Match count', matchCount);
    console.log('Open count', openCount);
    console.log('===================');
}

function clearCardNumber() {
    var cards = document.querySelectorAll('.card');

    cards.forEach((card) => {
        card.dataset.number = '';
        card.dataset.match = 'false';
    });
}

function assignCardNumber() {
    var cardNumber = 0;
    var assignCount = 0;

    while (!allCardHasNumber()) {
        cardNumber = cardNumber + 1;
        assignCount = 0;

        while (assignCount < 2) {
            var cardId = Math.floor((Math.random() * cardCount) + 1);

            if (!cardHasNumber(cardId)) {
                setCardNumber(cardId, cardNumber);
                assignCount++;
            }
        }
    }
}

function setCardNumber(cardId, number) {
    var card = getCard(cardId);
    card.dataset.number = number;

    var face = card.querySelector('.card__face--back');
    face.innerHTML = number;
}

function setCardMatch(cardId) {
    var card = getCard(cardId);
    card.dataset.match = 'true';
}

function allCardHasNumber() {
    var cards = document.querySelectorAll('.card');

    for (const card of cards) {
        if (card.dataset.number == '')
            return false;
    }

    return true;
}

function cardHasNumber(cardId) {
    var card = getCard(cardId);

    if (card.dataset.number == '')
        return false

    return true;
}

function getCard(cardId) {
    return document.getElementById('card-' + cardId);
}