pragma solidity ^0.4.23; // NOTE: Tested 4.23, 4.25 -- both work. 

//------------------------------------------------------------------------------------
// Contract:
//  This contract manages adding candidates to a ledger, and getting their hash.
//  To impliment a voting system, one would have to support the following scenarios:
//      1. Adding a candidate to the ballot.
//      2. Anonymously, yet traceably, voting for any candidate.
//      3. Deciding what candidate had more votes due to an event.
//  This contract manages the data flow of the scenarios.
//------------------------------------------------------------------------------------
contract CandidateManager {
    mapping(bytes32 => uint) private votes; // hashed candidate names mapped to a running vote count.
    mapping(string => bytes32) private candidates; // Mapping real names to hashes

    //------------------------------------------------------------------------------------
    // Function:
    //  Given a name, what is the corresponding hash?
    // Parameters:
    //  A solidity encoded string with the candidate's name.
    // Returns:
    //  a hash ( empty for not found)
    function getCandidateHash(string candidateName) external view returns(bytes32 candidateHash) {
        if (bytes(candidateName).length > 0) {
            return candidates[candidateName];
        }
    }

    //------------------------------------------------------------------------------------
    // Function:
    //  Take a candidate's name, and init a voting structure to include them.
    // Parameters:
    //  A solidity encoded string with the candidate's name.
    // Returns:
    //  A bool indicating if we did update the ledger or not. ( true == did update )
    function AddCandidate(string candidateName) external returns (bool success) {
        success = false;
        // check to see if the candidate name is already done.
        if (bytes(candidateName).length > 0) {
            bytes32 empty;
            if (candidates[candidateName] == empty) {
                // we can add!
                candidates[candidateName] = keccak256(abi.encodePacked(candidateName));
                success = true;
            }
        } else {
            // we can't add -- no name.
            success = false; // we can't add -- already there.
        }

        // raise an event we can filter by our address, return
        emit candidateAdded(msg.sender, success);
        return success;
    }

    //------------------------------------------------------------------------------------
    // Function:
    //  This is the default function for accepting wei.
    //  "Never leave money on the table."
    // Parameters:
    //  None.
    // Returns:
    //  Nothing.
    function() external payable {}

    //------------------------------------------------------------------------------------
    // Event:
    //  We can raise an event from this contract indicating that a candidate address was added.
    //  This event is currently unhandled.
    event candidateAdded(address indexed _from, bool success);
}
