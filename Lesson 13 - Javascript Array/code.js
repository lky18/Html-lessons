let cars = ['Tesla', 'BMW', 'Ford', 'Honda'];

printCars();

// add car
cars.push('Lambo');

printCars();

// remove car
cars.pop();

printCars();

var result = cars.find(x => x == 'BMW');

if (result == undefined) {
    console.log('=================');
    console.log('Car not exists');    
}
else {
    console.log('=================');
    console.log('Car exists');
}

function printCars() {
    console.log('=================');
    for(i = 0; i < cars.length; i++) {
        console.log(cars[i]);
    }
}

let index = cars.findIndex(x => x == 'Ford');

if (index == -1) {
    console.log('car not exists');
}
else {
    console.log('I found the car and is called', cars[index], ' it was found in index', index);
}

let carsEndWithLetterA = cars.filter(x => x.endsWith('a'))

console.log(carsEndWithLetterA);




