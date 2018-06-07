pragma solidity ^0.4.23; 

contract HelloContract {
    mapping(bytes32 => uint) private votes;
    mapping(string => bytes32) private candidates;

    function getCandidateHash(string candidateName) external view returns(bytes32 candidateHash) {
        if (bytes(candidateName).length > 0) {
            return candidates[candidateName];
        }
    }

    function AddCandidate(string candidateName) external returns (bool success) {
        success = false;
        // check to see if the candidate name is already done.
        if (bytes(candidateName).length > 0) {
            bytes32 empty;
            if (candidates[candidateName] == empty) {
                // we can add!
                candidates[candidateName] = keccak256(candidateName);
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

    function() external payable {}

    event candidateAdded(address indexed _from, bool success);
}
