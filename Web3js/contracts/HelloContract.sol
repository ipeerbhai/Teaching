pragma solidity ^0.4.19; 

contract HelloContract {
    mapping(bytes32 => uint) private votes;
    mapping(string => bytes32) private candidates;

    function getCandidateHash(string candidateName) external view returns(bytes32 cadidateHash) {
        if (bytes(candidateName).length > 0) {
            return candidates[candidateName];
        }
    }

    function AddCandidate(string candidateName) external returns (bool) {
        // check to see if the candidate name is already done.
        if (bytes(candidateName).length > 0) {
            bytes32 empty;
            if (candidates[candidateName] == empty) {
                // we can add!
                candidates[candidateName] = keccak256(candidateName);
                return true;
            }
        } else {
            // we can't add -- no name.
            return false; // we can't add -- already there.
        }
        
        // Whoops.
        return false;
    }

    function() external payable {}
}
