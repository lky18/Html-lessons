class Car {
    constructor(regNumber, name, year, maxMileage) {
        this.regNumber = regNumber;
        this.name = name;
        this.year = year;
        this.engineStarted = false;
        this.mileage = 0;
        this.maxMileage = maxMileage;
    }

    getAge() {
        const today = new Date();
        return today.getFullYear() - this.year;
    }

    startEngine() {
        if (this.engineStarted == false) {
            this.engineStarted = true;
            console.log('Engine started');
        }
        else {
            console.log('Engine already started');
        }
    }

    stopEngine() {
        if (this.engineStarted == false) {            
            console.log('Engine already stopped');
        }
        else {
            this.engineStarted = false;
            console.log('I have stopped the Engine');
        }
    }

    drive(drove) {
        if (drove + this.mileage > this.maxMileage) {
            console.log('I need more fuel');
            this.engineStarted = false;
            return;
        }        

        if (this.engineStarted == true) {
            this.mileage = this.mileage + drove;
            console.log('Car drove', this.mileage, 'mile');
        }
        else {
            console.log('Cannot drive the car. The engine has stopped.');
        }
    }
}

const carA = new Car("123", "Ford", 1991, 50);

const carB = new Car("456", "bmw", 2001, 2000);

carA.startEngine();

window.setInterval(() => carA.drive(10), 1000);


// window.setTimeout(() => ford.drive(10), 1000);

// window.setInterval(() => ford.drive(10), 1000);

// let myVar = setInterval(myTimer, 1000);
// function myTimer() {
//   const d = new Date();
//   console.log(d.toLocaleTimeString());
// }

// ford.drive(10);
// ford.drive(10);
// ford.stopEngine();
// ford.drive(5);
// ford.startEngine();
// ford.startEngine();