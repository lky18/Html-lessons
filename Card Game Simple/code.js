document.addEventListener("DOMContentLoaded", ready);
var timeoutId;
var intervalId;
const numberOfCards = 8;
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

            // do not allow to flip card if already has been flipped
            if (card.dataset.flip == 'true') {
                return;
            }

            if (timeoutId) {
                clearTimeout(timeoutId);
            }

            // Check every second card flip if card not matched
            if (cardFlipCount() == 1) {          
                timeoutId = setTimeout(unFlipNotMatchedCards, 1000);
            }

            // Check every third card flip if card not matched
            if (cardFlipCount() == 2) {
               unFlipNotMatchedCards();
            }

            // flip the card
            if (card.dataset.match == 'false' && card.dataset.flip == 'false') {
                // trigger the flip animation
                card.dataset.flip = 'true';
                card.classList.toggle('is-flipped');
            }

            // check matching status again after the card has been flipped
            checkCardMatchingStatus();

            // do not allow to flip card if all card have been matched
            if (hasAllCardMatched()) {
                if (intervalId) {
                    clearInterval(intervalId);
                }
            }

            printCardNumber();
        });
    });
}

function setTime() {
    let minutesLabel = document.getElementById("minutes");
    let secondsLabel = document.getElementById("seconds");

    totalSeconds = totalSeconds + 1;
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
    let cards = document.querySelectorAll('.is-flipped');

    cards.forEach((card) => {
        card.classList.remove('is-flipped');
        card.dataset.flip = 'false';
    });
}

function unFlipNotMatchedCards() {
    let cards = document.querySelectorAll('.is-flipped');

    cards.forEach((card) => {
        if (card.dataset.match == 'false') {
            card.classList.remove('is-flipped');
            card.dataset.flip = 'false';
        }
    });
}

function cardFlipCount() {
    let count = 0;

    let cards = document.querySelectorAll('.card');

    cards.forEach((card) => {
        if (card.dataset.flip == 'true' && card.dataset.match == 'false') {
            count++;
        }
    });

    return count;
}

function checkCardMatchingStatus() {
    let card1 = null;
    let card2 = null;

    let cards = document.querySelectorAll('.card');

    cards.forEach((card) => {
        if (card.dataset.flip == 'true' && card.dataset.match == 'false') {
            if (card1 == null) {
                card1 = card;
            } else if (card2 == null) {
                card2 = card;
            }
        }
    });

    // Set both cards matched if teh number are the same
    if (card1 && card2 && card1.dataset.number == card2.dataset.number) {
        card1.dataset.match = 'true';
        card2.dataset.match = 'true';
    }
}

function hasAllCardMatched() {
    let cardMatchedCount = 0;

    let cards = document.querySelectorAll('.card');

    cards.forEach((card) => {
        if (card.dataset.match == 'true') {
            cardMatchedCount++;
        }
    });

    if (cardMatchedCount == numberOfCards) {
        return true;
    }

    return false;
}

function reset() {
    totalSeconds = 0;

    if (intervalId) {
        clearInterval(intervalId);
    }

    intervalId = setInterval(setTime, 1000);

    clearCardNumber();
    assignCardNumber();
    unFlipAllCards();

    printCardNumber();
}

function printCardNumber() {
    console.clear();
    let cards = document.querySelectorAll('.card');

    console.log('cardFlipCount', cardFlipCount());
    console.log('hasAllCardMatched', hasAllCardMatched());
    cards.forEach((card) => {
        console.log(card.id, card.dataset.number, card.dataset.match);
    });
}

function clearCardNumber() {
    let cards = document.querySelectorAll('.card');

    cards.forEach((card) => {
        card.dataset.number = '';
        card.dataset.match = 'false';
    });
}

function assignCardNumber() {
    let cardNumber = 0;
    let assignCount = 0;

    while (!allCardHasNumber()) {
        cardNumber = cardNumber + 1;
        assignCount = 0;

        while (assignCount < 2) {
            let cardId = Math.floor((Math.random() * numberOfCards) + 1);

            if (!cardHasNumber(cardId)) {
                setCardNumber(cardId, cardNumber);
                assignCount++;
            }
        }
    }
}

function setCardNumber(cardId, number) {
    let card = getCard(cardId);
    card.dataset.number = number;

    let face = card.querySelector('.card-face-back');
    face.innerHTML = `<span class="card-number">${number}</span>`;
}

function setCardMatch(cardId) {
    let card = getCard(cardId);
    card.dataset.match = 'true';
}

function allCardHasNumber() {
    let cards = document.querySelectorAll('.card');

    for (const card of cards) {
        if (card.dataset.number == '')
            return false;
    }

    return true;
}

function cardHasNumber(cardId) {
    let card = getCard(cardId);

    if (card.dataset.number == '')
        return false

    return true;
}

function getCard(cardId) {
    return document.getElementById('card-' + cardId);
}