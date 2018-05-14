pragma solidity ^0.4.23;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/StringExtension.sol";

//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
// Test Contracts
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------

// HINT: use truffle's Assert extension and end all unit tests with an assert!

contract TestStringLibrary {
    using StringExtension for string; // here's where we extend the base string object.
    string constant EXPECTEDRESULT = "Hello_PASSED";

    //-------------------------------------------------------------------------------
    // Test:
    //  Unit test that our string extension appends strings together.
    function testCat() public returns(bool) {

        string memory testString = "Hello"; // declare a string
        testString = testString.cat("_PASSED"); // concat _PASSED to this string

        // Let's use hashing to verify
        bytes32 resultHash = keccak256(testString);
        bytes32 expectedHash = keccak256(EXPECTEDRESULT);


        // And assert out if we passed the test or not
        Assert.equal(resultHash, expectedHash, "string catenation test failed.");
    }

    //-------------------------------------------------------------------------------
    // Test:
    //  Unit test that our string extension compares correctly.
    function testCompareTo() public returns(bool) {
        string memory testString = "Hello_PASSED"; // set it to what we expect
        bool testBool = testString.compareTo(EXPECTEDRESULT); // we should get true.
        bool expectedBool = true;

        // And assert out if we passed the test or not
        Assert.equal(testBool, expectedBool, "string compareTo test failed.");
        
    }
}
