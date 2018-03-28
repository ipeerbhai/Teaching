pragma solidity ^0.4.19; 

// Intreface for animals
interface Animal {
    function speak() external returns (string);
    function walk() external returns (uint);
}

library Movement {
    uint constant STEPS = 2;
    function move(uint _position) public pure returns (uint newPosition) {
        return (_position + STEPS);
    } 
}

contract cat is Animal {
    using Movement for cat;
    uint private catPosition;
    function speak() external returns(string) {
        return ("MEOW");
    }
    
    function walk() external returns (uint) {
        catPosition = Movement.move(catPosition);
        return(catPosition);
    }
}