//import imran from './Objects.js'; // ES6 syntax, not supported by Node, but supported by some browsers.
let myAnimal = require('./Objects.js'); // ES5 syntax, require runs the entire required script and extends the current script's classes and functions.


let Stacey = new myAnimal.Dolphin("Stacey", 10); 
Stacey.sayName();