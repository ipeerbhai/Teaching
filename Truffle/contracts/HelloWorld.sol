pragma solidity ^0.4.23;

contract Hello {
    string public recordedMessage;
    function sayHello() external returns(string) {
        recordedMessage = "Hello World";
        return(recordedMessage);
    }
}