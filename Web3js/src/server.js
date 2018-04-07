// basic example using a deployed smart contract to add a new candidate
// to a voter form.

// import required librarires ( ES5 syntax )
const express = require("express");
const path = require("path");
const solc = require("solc");
const fs = require("fs");
const Web3 = require("web3");
const bodyParser = require("body-parser");

// Init the app
var app = express();
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(express.static(__dirname + "/../public")); // blindly serve this directory and mount it to "/"
app.use(function(req, res, next) {
  if (req.is("text/*")) {
    req.text = "";
    req.setEncoding("utf8");
    req.on("data", function(chunk) {
      req.text += chunk;
    });
    req.on("end", next);
  } else {
    next();
  }
});

// setup handlebars
const handlebars = require("express-handlebars").create({
  defaultLayout: "main"
}); // to name ./views/layouts/main.handlebars as rendered
app.engine("handlebars", handlebars.engine); // to plumb in handlebars framework.
app.set("view engine", "handlebars"); // to start the engine handler.

// get the deployed contract
const HelloContractObject = JSON.parse(
  fs.readFileSync("./build/contracts/HelloContract.json", "utf8")
);

// connect to the smart contract.
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545")); // for ganache
// var net = require("net");
//var web3 = new Web3(new Web3.providers.WebsocketProvider("http://localhost:7545"));
//var web3 = new Web3(new Web3.providers.IpcProvider(ipcPath, net)); // for geth

var connectedContract = new web3.eth.Contract(
  HelloContractObject.abi,
  HelloContractObject.networks["5777"].address,
  { gasPrice: "2000000000" }
);

// Get the account.  In real scenarios, we would use metamask's injected web3.currentprovider to get a real account.
var account;
var getAccountPromise = new Promise(function(resolve, reject) {
  web3.eth.getAccounts((err, acs) => {
    if (err != null) {
      throw new Error("No valid account found.");
    }
    if (acs.length === 0) {
      throw new Error("No accounts found.  Verify your ETH node connection.");
    }
    resolve(acs[0]);
  });
});

getAccountPromise.then(result => {
  // WARNING: this fulfills after the server starts listening, as the promise is now in the callback queue!
  account = result;
});

// start listening
app.set("port", process.env.PORT || 3000);
app.listen(app.get("port"), function() {
  console.log(
    "Express started on http://localhost:" +
      app.get("port") +
      "; Press CTRL-C to terminate."
  );
});

// Ready to begin routing.
app.get("/", function(req, res) {
  res.render("home", { title: "Candidate Entry" });
});

app.post("/v1/EnterCandidate/", (req, res) => {
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let fullName = firstName + " " + lastName;

  // use the connected contract to call the contract's AddCandidate method
  // WARNING:
  //    We are using the event system to get the return value from ganache
  //    Real transactions can take hours to return, and post will timeout.
  //    Better to return only the transaction hash and then do something like send
  //    email!

  // actually send the transaction.
  connectedContract.methods
    .AddCandidate(web3.utils.fromAscii(fullName))
    .send({ from: account })
    .then(contractSendResult => {
      let transactionHash = contractSendResult.transactionHash;

      // WARNING: THIS IS FOR MATCHING SLIDES.  DON'T DO CALL getCandidateHash immediately IN REALITY.
      // we're in a test environment with ganache.  We can call the get and return the hash.
      connectedContract.methods
        .getCandidateHash(web3.utils.fromAscii(fullName))
        .call({ from: account })
        .then(resultCandidateHash => {
          let returnInfo = {
            txHash: transactionHash,
            personHash: resultCandidateHash
          };
          res.send(returnInfo);
        });
    })
    .catch(err => {
      console.log(err);
    });

  connectedContract.once("candidateAdded", null, function(error, eventObject) {
    if (error) {
      console.log(error);
    }
    // here's where we'd do something with the user.
    if (eventObject) {
      console.log(eventObject);
    }
  });

  /* another way to do it
  var candidateAddedEvent = connectedContract.events.candidateAdded(
    { filter: { from: account } },
    function(error, event) {
      console.log(event);
    }
  );
  */
});

//-----------------------------------------------------------------
// Dynaamic section
//-----------------------------------------------------------------

app.post("/v1/DeployDynamicContract/", (req, res) => {
  // load and compile the file, get an interface and the compiled bytecode
  let contractSourceCode = fs.readFileSync("./demo.sol", "utf8");
  let compiledContract = solc.compile(contractSourceCode, 1); // 1 == optimization level 1
  let abi = JSON.parse(compiledContract.contracts[":demo"].interface);
  let byteCode = compiledContract.contracts[":demo"].bytecode;

  // make a web3 contract instance, then deploy and get a deployment promise.
  dynamicContract  = new web3.eth.Contract(abi);
  console.log(dynamicContract);
  dynamicPromise = dynamicContract.deploy({
      data:byteCode
  }).send({
    from: account,
    gas: 1500000,
    gasprice: 2000000000
  }); // deploy the contract and tell it to limit gas and gasprice.

  // call the contract's sayHello pure method
  dynamicPromise.then(newContractInstance => {
      newContractInstance.methods.sayHello().call({from:account}).then(result=>{
          res.send(result);
      });
  });



});
