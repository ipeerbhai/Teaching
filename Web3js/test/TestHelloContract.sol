pragma solidity ^0.4.23;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/HelloContract.sol";

contract TestHelloContract {
    HelloContract myContract = HelloContract(DeployedAddresses.HelloContract());
    function testAddCandidate() public {
        myContract.AddCandidate("imran");
        bytes32 result = myContract.getCandidateHash("imran");
        bytes32 expected = keccak256("imran");
        Assert.equal(expected, result, "no match");
    }
}