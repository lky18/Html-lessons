function printMessage(message) {
    console.log(message);
}

printMessage('Hello world2');

function Calculate(num1, num2) {
    let ans = num1 + num2;

    return ans;
}

let answer = Calculate(1, 1);

console.log('Anser:', answer);

function concatName(forename, surname) {
    let name = forename + ' ' + surname;
    return name;
}

let myName = concatName('Kelvin', 'Lok');
console.log(myName);

// infinite example
function a1() {
    console.log('a1');
    a2();
}

function a2() {
    console.log('a2');
    a1();
}

a1();