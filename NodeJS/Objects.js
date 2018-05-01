// This script introduces Javascript's concept of objects.
// This is ES6 ( aka ES2015 ) notation.  We'll extend using ES5 "prototype" notation.  ES6 is just syntax changes around ES5's ability -- still using prototype, but silently. 

// let's define a mammal
class Mammal {
    // Define a name and things the mammal can say during construction.
    constructor(name, words) {
        this.name = name; // set the name of the animal.
        this.words = words;
    }

    sayName() {
        console.log("My name is: " + this.name);
    }

    // Define a speak method to have this mammal say words.
    speak() {
        console.log ("I can say: " + this.words); // the "this" is mandatory, as the words are bound to the instance, not the class!
    }
}

class Dolphin extends Mammal {
    constructor(name, speed) {
        super(name, "squeak"); // this calls Mammal's constructor.  Note -- you must call super() if you subclass a constructor.
        this.speed = speed; // add the speed of the Dolphin as an extension.
    }
}

// let's make a dolphin, using the constructor.
let Flipper = new Dolphin("Flipper", 25);  // I didn't define name in Dolphin -- so why does this work? ( Inheritance! )
console.log(Flipper); // show the type info

// Make flipper speak!
Flipper.speak();

// Now, let's extend further with prototype. ( ES5 way of extending objects)
Dolphin.prototype.swim = function () {
    return ("I can swim!");
}; // What would happen if I used the instance ( named flipper )?  ( hint -- not good ) 

console.log(Flipper.swim());



module.exports = {
    Dolphin: Dolphin
}
