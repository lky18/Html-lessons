class Robot {
    constructor(name, age, maxEnergy, maxBullet) {
        this.name = name;
        this.age = age;
        this.maxEnergy = maxEnergy;
        this.maxBullet = maxBullet;
        this.isOn = false;
        this.bullet = 0;
    }

    turnOn() {
        this.isOn = true;
        console.log('Robot is on');
    }

    turnOff() {
        console.log('turnOff');
    }

    shoot() {
        if (this.maxBullet < 1) {
            console.log('out of ammo, cannot shoot')
            return;
        }

        if (this.isOn == true){
            console.log('shot bullet')
            this.maxBullet = this.maxBullet - 1;
            console.log(this.maxBullet + ' bullets left')
        }
        else{
            this.isOn = false;
            console.log('Robot is off, Cannot shoot')
        }
    }

    walk() {
        console.log('walk');
    }
}

const robotA = new Robot('A', 1, 100, 10);

robotA.turnOn();
robotA.shoot();
robotA.shoot();
robotA.shoot();
robotA.shoot();

// robotA.turnOn();
// robotA.turnOff();
// robotA.walk();

