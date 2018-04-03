/* This contract is for instructional use only.  It intentionally is incomplete.  There are no warantees on this code of any sort. */
pragma solidity ^0.4.18; 

// Inspired by the EIP-20 document here: https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20-token-standard.md
// Alterations:
// 1. changed to interface from contract for instructional purposes.
// 2. moved member variables to contract per Solidity interface requirements.
interface ERC20 {
    function totalSupply() public constant returns (uint _totalSupply);
    function balanceOf(address tokenOwner) public constant returns (uint balance);
    function allowance(address tokenOwner, address spender) public constant returns (uint remaining);
    function transfer(address to, uint tokens) public returns (bool success);
    function approve(address spender, uint tokens) public returns (bool success);
    function transferfrom(address fro, address to, uint tokens) public returns (bool success);

    event Transfer(address indexed from, address indexed to, uint tokens);
    event Approval(address indexed tokenOwner, address indexed spender, uint tokens);
}

contract ThinkSampleToken is ERC20 {

    string public constant symbol = "TT";
    string public constant name = "ThinkPredict ERC20 Example Token";
    uint8 public constant decimals = 18; // Which format is our token matching ( wei, in this case )

    address private owner;
    uint private constant tokenTotal = 100; // we'll only ever mint 100 of these...
    uint minted;
    mapping(address => uint) private ownerBalance;
    mapping(address => mapping(address=>uint)) private allowedToSpend;

    

    function totalSupply() public constant returns (uint _totalSupply) {
        _totalSupply = tokenTotal;
        return _totalSupply;
    }

    function balanceOf(address tokenOwner) public constant returns (uint balance) {
        balance = ownerBalance[tokenOwner];
    }


    function allowance(address tokenOwner, address spender) public constant returns (uint remaining) {
        // TODO: .18+ removes allowing a simple if ( address ) boolean.  Need to find blessed function.
        // for now, just return assuming a valid tokenowner.

        remaining = allowedToSpend[tokenOwner][spender];
        return remaining;
    }
    
    
    function transfer(address to, uint tokens) public returns (bool success) {
        success = false;
        if (tokens <= balanceOf(msg.sender)) {
            ownerBalance[msg.sender] -= tokens;
            ownerBalance[to] += tokens;
            success = true;
            Transfer(msg.sender, to, tokens);
        }
        return success;
    }

    function approve(address spender, uint tokens) public returns (bool success) {
        success = false;
        if (tokens <= balanceOf(msg.sender)) {
            allowedToSpend[msg.sender][spender] = tokens;
            success = true;
            Approval(msg.sender, spender, tokens);
        }
        return success;

    }

    function transferfrom(address from, address to, uint tokens) public returns (bool success) {
        success = false;
        if ( (allowance(from, msg.sender) >= tokens) && (tokens >= 0) ) {
            ownerBalance[from] -= tokens;
            ownerBalance[to] += tokens;
            allowedToSpend[from][msg.sender] -= tokens;
            success = true;
            Transfer(from, to, tokens);
        }
        return success;
    }

    function mint() public {
        if ((ownerBalance[msg.sender] < 1) && (minted < tokenTotal)) { 
            ownerBalance[msg.sender] += 1;
            minted++;
        }
    }

    event Transfer(address indexed from, address indexed to, uint tokens);
    event Approval(address indexed tokenOwner, address indexed spender, uint tokens);

}