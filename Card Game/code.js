class LeaderBoard {
    constructor(scores8, scores12, scores16) {

        if (scores8) {
            this.scores8 = scores8;
        }
        else {
            this.scores8 = [];
        }

        if (scores12) {
            this.scores12 = scores12;
        }
        else {
            this.scores12 = [];
        }

        if (scores16) {
            this.scores16 = scores16;
        }
        else {
            this.scores16 = [];
        }
    }
}

class Score {
    constructor(name, ticks) {
        this.name = name;
        this.ticks = ticks;
        this.playAt = new Date();
    }
}

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

        if (this.isflipped) {
            this.unFlip();
            return;
        }

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
        face.innerHTML = `<span class="card-number">${newNumber}</span>`;
    }
}

class CardGame {
    constructor() {
        this.numberOfCards = 0;
        this.cards = [];
        this.isStarted = false;
        this.totalTicks = 0;
        this.intervalId = null;
    }

    init(numberOfCards) {
        this.numberOfCards = numberOfCards;
        this.cards = [];
        this.isStarted = false;
        this.totalTicks = 0;

        let gameBoard = document.getElementById('game-board');
        gameBoard.innerHTML = '';

        for (let i = 0; i < this.numberOfCards; i++) {
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
            card.element.addEventListener('click', (evt) => { this.onCardClick(evt, card) });
            card.element.addEventListener('touchstart', (evt) => { this.onCardClick(evt, card) });

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

        this.totalTicks = 0;

        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.resetCountDown();
        }

        this.intervalId = setInterval(() => { this.countDown(); }, 100);

        this.debugPrint();
    }

    onCardClick(evt, card) {
        evt.preventDefault();

        // do not allow to flip card until the game start
        if (!this.isStarted) {
            return;
        }

        // do not allow to flip card is already matched
        if (card.isMatched) {
            return;
        }

        // flip the card
        card.flip();

        // check matching status again after the card has been flipped
        this.checkCardMatchingStatus();

        // do not allow to flip card if all card have been matched
        if (this.hasAllCardMatched()) {
            this.isStarted = false;

            if (this.intervalId) {
                clearInterval(this.intervalId);
            }

            this.updateLeaderBoard(this.totalTicks);
        }

        this.debugPrint();
    }

    countDown() {
        let minutesLabel = document.getElementById("minutes");
        let secondsLabel = document.getElementById("seconds");
        let ticksLabel = document.getElementById("ticks");

        this.totalTicks = this.totalTicks + 1;
        if (this.totalTicks % 10 == 0) {
            secondsLabel.innerHTML = pad((this.totalTicks / 10) % 60);
            minutesLabel.innerHTML = pad(parseInt((this.totalTicks / 10) / 60));
        }

        ticksLabel.innerHTML = pad(this.totalTicks);
    }

    resetCountDown() {
        let minutesLabel = document.getElementById("minutes");
        let secondsLabel = document.getElementById("seconds");
        let ticksLabel = document.getElementById("ticks");

        secondsLabel.innerHTML = '00';
        minutesLabel.innerHTML = '00';
        ticksLabel.innerHTML = '00';
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

    updateLeaderBoard(ticks) {
        getScores().then(data => {
            if (this.checkIsInTop20(data, ticks)) {
                const name = this.promptToEnterName();
                const newScore = new Score(name, ticks);
                const leaderBoard = new LeaderBoard(data.scores8, data.scores12, data.scores16);

                if (this.numberOfCards == 8) {
                    leaderBoard.scores8.push(newScore);

                    // sort scores
                    leaderBoard.scores8.sort((first, second) => first.ticks - second.ticks);

                    // get the first 20 highest scores
                    leaderBoard.scores8 = leaderBoard.scores8.slice(0, 20);
                }
                else if (this.numberOfCards == 12) {
                    leaderBoard.scores12.push(newScore);

                    // sort scores
                    leaderBoard.scores12.sort((first, second) => first.ticks - second.ticks);

                    // get the first 20 highest scores
                    leaderBoard.scores12 = leaderBoard.scores12.slice(0, 20);
                }
                else if (this.numberOfCards == 16) {
                    leaderBoard.scores16.push(newScore);

                    // sort scores
                    leaderBoard.scores16.sort((first, second) => first.ticks - second.ticks);

                    // get the first 20 highest scores
                    leaderBoard.scores16 = leaderBoard.scores16.slice(0, 20);
                }

                updateScore(leaderBoard).then(data => {
                });
            }
        });
    }

    promptToEnterName() {
        let name = prompt("Enter your name to join the leaderboard", '');

        if (name.trim() == '' || name == null) {
            name = uuidv4();
        }

        return name;
    }

    checkIsInTop20(data, newTicks) {
        if (this.numberOfCards == 8) {
            if (data.scores8 === undefined || data.scores8.length < 20) {
                return true;
            } else {
                for (const score of data.scores8) {
                    if (newTicks < score.ticks)
                        return true;
                }

                return false;
            }
        }
        else if (this.numberOfCards == 12) {
            if (data.scores12 === undefined || data.scores12.length < 20) {
                return true;
            } else {
                for (const score of data.scores12) {
                    if (newTicks < score.ticks)
                        return true;
                }

                return false;
            }
        }
        else if (this.numberOfCards == 16) {
            if (data.scores16 === undefined || data.scores16.length < 20) {
                return true;
            } else {
                for (const score of data.scores16) {
                    if (newTicks < score.ticks)
                        return true;
                }

                return false;
            }
        }

        return false;
    }

    uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
            .replace(/[xy]/g, function (c) {
                const r = Math.random() * 16 | 0,
                    v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
    }

    debugPrint() {
        console.clear();
        console.log('isStarted', this.isStarted);
        console.log('hasAllCardMatched', this.hasAllCardMatched());
        this.cards.forEach((card) => {
            console.log(card);
        });
    }
}

const defaultNumberOfCards = 8;
const cardGame = new CardGame();
const apiUrl = 'https://api.jsonstorage.net/v1/json/5725bb31-8a05-4754-ba35-8f12024e78e4/f0c0ab30-1a01-42a5-b146-361e7a6045de';
const apiKey = '8969a471-87b7-4758-9f34-b090d396d9bb';

window.onload = function () {
    cardGame.init(defaultNumberOfCards);
};

function onStartGame(evt) {
    evt.preventDefault();
    cardGame.start();
}

function onCardNumberSelect(numberOfCards) {
    cardGame.init(numberOfCards);
    cardGame.start();
}

function onShowLeaderBoard(evt) {
    evt.preventDefault();

    let leaderBoardTitle = document.getElementById('leader-board-title');

    if (cardGame.numberOfCards == 8) {
        leaderBoardTitle.innerHTML = '8 cards leader board';
    }
    else if (cardGame.numberOfCards == 12) {
        leaderBoardTitle.innerHTML = '12 cards leader board';
    }
    else if (cardGame.numberOfCards == 16) {
        leaderBoardTitle.innerHTML = '16 cards leader board';
    }

    let leaderBoard = document.getElementById('leader-board');

    if (leaderBoard.style.visibility == 'visible') {
        leaderBoard.style.visibility = 'hidden';
    }
    else {
        leaderBoard.style.visibility = 'visible';
    }

    getScores().then(data => {
        let count = 0;

        if (cardGame.numberOfCards == 8) {
            if (data.scores8 === undefined || data.scores8.length == 0) {
                document.getElementById('leader-board-table-wrapper').innerHTML = ''
            }
            else {
                document.getElementById('leader-board-table-wrapper').innerHTML = [
                    '<table id="leader-board-table"><thead>',
                    // ...Object.keys(data.scores[0]).map(key => `<th>${key}</th>`),
                    '<th>Position</th><th>Name</th><th>Time (minutes:seconds)</th><th>Play at</th>',
                    '</thead><tbody>',
                    ...data.scores8.map(item => { return `<tr><td>${++count}</td><td>${item.name}</td><td>${convertTicksToMinutesSeconds(item.ticks)}</td><td>${convertToLocaleString(item.playAt)}</td></tr>` }),
                    '</tbody></table>'].join("");
            }
        }
        else if (cardGame.numberOfCards == 12 && data.scores12) {
            if (data.scores12 === undefined || data.scores12.length == 0) {
                document.getElementById('leader-board-table-wrapper').innerHTML = ''
            }
            else {
                document.getElementById('leader-board-table-wrapper').innerHTML = [
                    '<table id="leader-board-table"><thead>',
                    // ...Object.keys(data.scores[0]).map(key => `<th>${key}</th>`),
                    '<th>Position</th><th>Name</th><th>Time (minutes:seconds)</th><th>Play at</th>',
                    '</thead><tbody>',
                    ...data.scores12.map(item => { return `<tr><td>${++count}</td><td>${item.name}</td><td>${convertTicksToMinutesSeconds(item.ticks)}</td><td>${convertToLocaleString(item.playAt)}</td></tr>` }),
                    '</tbody></table>'].join("");
            }
        }
        else if (cardGame.numberOfCards == 16 && data.scores16) {
            if (data.scores16 === undefined || data.scores16.length == 0) {
                document.getElementById('leader-board-table-wrapper').innerHTML = ''
            }
            else {
                document.getElementById('leader-board-table-wrapper').innerHTML = [
                    '<table id="leader-board-table"><thead>',
                    // ...Object.keys(data.scores[0]).map(key => `<th>${key}</th>`),
                    '<th>Position</th><th>Name</th><th>Time (minutes:seconds)</th><th>Play at</th>',
                    '</thead><tbody>',
                    ...data.scores16.map(item => { return `<tr><td>${++count}</td><td>${item.name}</td><td>${convertTicksToMinutesSeconds(item.ticks)}</td><td>${convertToLocaleString(item.playAt)}</td></tr>` }),
                    '</tbody></table>'].join("");
            }
        }
    });
}

function onCloseLeaderBoard(evt) {
    evt.preventDefault();

    let leaderBoard = document.getElementById('leader-board');
    leaderBoard.style.visibility = 'hidden';
}

async function getScores() {
    const response = await fetch(apiUrl);

    if (!response) {
        throw new Error('Network response was not ok');
    }

    const data = await response.json();

    return data;
}

async function updateScore(newScores) {
    const requestOptions = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newScores),
    };

    const response = await fetch(`${apiUrl}?apiKey=${apiKey}`, requestOptions);

    if (!response) {
        throw new Error('Network response was not ok');
    }

    const data = await response.json();

    return data;
}

function convertTicksToMinutesSeconds(ticks) {
    const totalSeconds = (ticks / 10);
    let minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds - (minutes * 60));

    return `${pad(minutes)}:${pad(seconds)}`;
}

function convertToLocaleString(playAt) {
    const d = new Date(playAt);

    return d.toLocaleString();
}


function pad(val) {
    let valString = val + "";

    if (valString.length < 2) {
        return "0" + valString;
    } else {
        return valString;
    }
}


