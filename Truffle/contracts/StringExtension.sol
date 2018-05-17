pragma solidity ^0.4.23;

//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
// Libraries
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------

library StringExtension {

    //-------------------------------------------------------------------------------
    // Function:
    //  This function concatenates a string to an existing string by extending the 
    //  string primitive to add new methods.
    // Parameters:
    //  Self -- the instantiated object.  
    //  AddPart -- the string to add to this string.
    // Returns:
    //  A new string that is a copy of the two input strings.
    function cat(string selfString, string addPartString) internal pure returns (string) {
        // explicit cast to byte array.
        bytes memory selfBytes = bytes(selfString);
        bytes memory addPartBytes = bytes(addPartString);

        // working set variables
        string memory temp = new string(selfBytes.length + addPartBytes.length);
        bytes memory returnBytes = bytes(temp);
        uint baseCount = 0; // to iterate over the parameter strings
        uint outputCount = 0; // to iterate over the output byte buffer

        // Byte copies of self and added parts
        for (baseCount = 0; baseCount < selfBytes.length; baseCount++) {
            returnBytes[outputCount++] = selfBytes[baseCount];
        }

        for (baseCount = 0; baseCount < addPartBytes.length; baseCount++) {
            returnBytes[outputCount++] = addPartBytes[baseCount];
        }

        // cast the catenated buffer to string and return it.
        return string(returnBytes);
    }

    //-------------------------------------------------------------------------------
    // Function:
    //  This function compares two strings by using the keccack256 hashes.
    // Parameters:
    //  selfString -- instantiated base object
    //  compareTarget -- What to compare this string to
    // Returns:
    //  Bool -- true if both are the same.  False if not the same.
    function compareTo(string selfString, string compareTarget) public pure returns(bool) {
        return (keccak256(selfString) == keccak256(compareTarget));
    }
}
