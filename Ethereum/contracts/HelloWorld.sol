pragma solidity ^0.4.23;

contract Hello {
    string public recordedMessage;
    function sayHello() external {
        recordedMessage = "Hello World";
    }
}