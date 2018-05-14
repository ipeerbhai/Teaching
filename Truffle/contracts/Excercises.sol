pragma solidity ^0.4.23;

import "./StringExtension.sol";

//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
// EXERCISES
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------


//-------------------------------------------------------------------------------
// Hello World
contract Hello {
    string public recordedMessage;

    function sayHello() external {
        recordedMessage = "Hello World";
    }
}


//-------------------------------------------------------------------------------
// Inheritance
contract Foo {
    uint8 private callCount = 0;
    string constant public SAYSOMETHING = "I am a cat.";
    address public checkAddress;

    function increaseCount(uint8 byAmount) public returns(uint8) {
        callCount = callCount + byAmount;
        return(callCount);
    }
}

interface Bar {
    function mustImpliment(address parameter) external returns(bool); // no body is a "virtual" function 
}

contract Baz is Foo, Bar {
    using StringExtension for string;
    string constant public IHEARD = "I am a cat.";
    function mustImpliment(address parameter) public returns(bool) {
        checkAddress = parameter; // store this for whatever reason.
        return (IHEARD.compareTo(SAYSOMETHING));
    }
}

//-------------------------------------------------------------------------------
// sink design pattern
contract PseudoSink {
    address private owner;
    enum CONTRACTSTATE {
        OPEN,
        CLOSED
    }
    CONTRACTSTATE internal ReadyForBusiness; 
    struct PaymentDetail {
        uint weiAmount;
        uint blockTimestamp;
    }
    uint constant MIN_CHARGE = 21000;
    uint internal woof;
    mapping(address=>PaymentDetail) internal ledger;

    constructor() public {
        owner = msg.sender;
        ReadyForBusiness = CONTRACTSTATE.OPEN;
    }
    
    function() public payable {
        require(ReadyForBusiness == CONTRACTSTATE.OPEN);
        require(msg.value > MIN_CHARGE);
        ledger[msg.sender].weiAmount = msg.value;
        ledger[msg.sender].blockTimestamp = now; // this aliases to global block.timestamp
    }
}

//-------------------------------------------------------------------------------
// events
contract EventEmitter {
    event GotEther(
        address indexed _from,
        bytes32 indexed _id,
        uint _value
    );

    function deposit(bytes32 _id) public payable {
        emit GotEther(msg.sender, _id, msg.value);
    }
}

//----------------------------------------------------------
// ERC223 from github
//https://github.com/Dexaran/ERC223-token-standard/blob/Recommended/ERC223_Interface.sol
contract ERC223 {
    uint public totalSupply;
    function balanceOf(address who) public view returns (uint);

    function name() public view returns (string _name);
    function symbol() public view returns (string _symbol);
    function decimals() public view returns (uint8 _decimals);
    function totalSupply() public view returns (uint256 _supply);

    function transfer(address to, uint value) public returns (bool ok);
    function transfer(address to, uint value, bytes data) public returns (bool ok);
    function transfer(address to, uint value, bytes data, string custom_fallback) public returns (bool ok);

    event Transfer(address indexed from, address indexed to, uint value, bytes indexed data);
}


interface ERC721 {
    event Transfer(address indexed _from, address indexed _to, uint256 _tokenId);
    event Approval(address indexed _owner, address indexed _approved, uint256 _tokenId);
    event ApprovalForAll(address indexed _owner, address indexed _operator, bool _approved);
    function balanceOf(address _owner) external view returns (uint256);
    function ownerOf(uint256 _tokenId) external view returns (address);
    function safeTransferFrom(address _from, address _to, uint256 _tokenId, bytes data) external payable;
    function safeTransferFrom(address _from, address _to, uint256 _tokenId) external payable;
    function transferFrom(address _from, address _to, uint256 _tokenId) external payable;
    function approve(address _approved, uint256 _tokenId) external payable;
    function setApprovalForAll(address _operator, bool _approved) external;
    function getApproved(uint256 _tokenId) external view returns (address);
    function isApprovedForAll(address _owner, address _operator) external view returns (bool);
}
