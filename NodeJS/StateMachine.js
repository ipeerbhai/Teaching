/* This script shows off how the two execution structures work together in the NodeJS state machine in an unexpected way */

function DemoTimingError() {
    console.log(1);
    setTimeout( () => {console.log(2)}, 0);
    console.log(3);
}

DemoTimingError();