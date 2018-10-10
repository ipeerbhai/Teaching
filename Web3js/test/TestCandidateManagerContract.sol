pragma solidity ^0.4.23;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/CandidateManager.sol";

//----------------------------------------------------------------
// Test:
//  Verify that we can add a single candidate to a new chain / contract instance.
// Expected Result:
//  contract should add a fixed string and requery for same string.  Should match.
contract TestCandidateManagerContract {
    CandidateManager myContract = CandidateManager(DeployedAddresses.CandidateManager());
    function testAddCandidate() public {
        myContract.AddCandidate("imran");
        bytes32 result = myContract.getCandidateHash("imran");
        bytes32 expected = keccak256("imran");
        Assert.equal(expected, result, "no match");
    }
}