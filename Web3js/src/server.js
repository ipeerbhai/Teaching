// basic example using a deployed smart contract to add a new candidate
// to a voter form.

// import required librarires ( ES5 syntax )
const express = require("express");
const path = require("path");
const solc = require("solc");
const fs = require("fs");
const Web3 = require("web3");
const bodyParser = require("body-parser");

// Init the web server and call it "app" per tradition.
var app = express(); // Call the express library constructor function and get an object reference to store in variable "app"
app.use(bodyParser.json()); // support JSON encoded bodies in get/post calls
app.use(bodyParser.urlencoded({ extended: true })); // support url encoded bodies to prevent XSS attacks.
app.use(express.static(__dirname + "/../public")); // blindly serve ./public directory and mount it to the "/" route
app.use(function (req, res, next) {
  if (req.is("text/*")) {
    req.text = "";
    req.setEncoding("utf8");
    req.on("data", function (chunk) {
      req.text += chunk;
    });
    req.on("end", next);
  } else {
    next();
  }
}); // explicitely set unicode 8 bit ( aka utf-8, aka US English ) as the human-readable language of this page

// setup handlebars
const handlebars = require("express-handlebars").create({
  defaultLayout: "main"
}); // to name ./views/layouts/main.handlebars as rendered
app.engine("handlebars", handlebars.engine); // to plumb in handlebars framework to express's engine delegate.
app.set("view engine", "handlebars"); // to start the express engine handler for views.

// get the deployed contract
const HelloContractObject = JSON.parse(
  fs.readFileSync("./build/contracts/HelloContract.json", "utf8")
); // this JSON file was created by running "truffle compile"

// connect to the smart contract.
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545")); // for ganache
// var net = require("net"); // This code is for future support of eventing -- leave off by default.
//var web3 = new Web3(new Web3.providers.WebsocketProvider("http://localhost:7545")); // for Ganache in the future -- not supported yet.
//var web3 = new Web3(new Web3.providers.IpcProvider(ipcPath, net)); // for Geth nodes to support eventing

var connectedContract = new web3.eth.Contract(
  HelloContractObject.abi,
  HelloContractObject.networks["5777"].address,
  { gasPrice: "2000000000", gas: 6721975 }
); // Willing to pay 20 GWEI per GAS, willing to buy 6, 721, 975 GAS.  Super expensive!

// Get the account.  In real scenarios, we would use metamask's injected web3.currentprovider to get a real account.
var account;
var getAccountPromise = new Promise(function (resolve, reject) {
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
  // WARNING: this fulfills after the server starts listening, as the promise is now in the callback queue!  By design -- we need the server up.
  account = result;
});

// start listening
app.set("port", process.env.PORT || 3000); // if the command line has a varialbe "PORT" set, use that number, else default to 3000
app.listen(app.get("port"), function () {
  console.log(
    "Express started on http://localhost:" +
    app.get("port") +
    "; Press CTRL-C to terminate."
  );
}); // start listening for incoming HTTP requests by a web browser.

// Ready to begin routing.
app.get("/", function (req, res) {
  res.render("home", { title: "Candidate Entry" });
}); // Make the http://.../ browser URL map to "home.handlebars", render it and main.handlebars while sending the title option to handlebars to deal with.

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

      // WARNING: THIS IS EVIL IN PRODUCTION.  Real transactions take 2 blocks, and this code will timeout.
      // we're in a test environment with ganache.  We can call the get function and return the hash immediately in this simulation environment.
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
    }); // the catch is there in case things go wrong, we can see it on the server's command console.

  connectedContract.once("candidateAdded", null, function (error, eventObject) {
    if (error) {
      console.log(error);
    }
    // here's where we'd do something with the user.
    if (eventObject) {
      console.log(eventObject);
    }
  }); // This is an event listener.  Not used in Ganache yet, but other nodes supoort it.  Here's how you setup a one time listen for a fired event.

  /* another way to setup a listener
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
  let compiledContract = solc.compile(contractSourceCode, 1); // 1 == compiler optimization level 1 -- minimize bytecode size
  let abi = JSON.parse(compiledContract.contracts[":demo"].interface); // get the ABI from the compiler
  let byteCode = compiledContract.contracts[":demo"].bytecode; // get the actual compiled code from the compiler

  // make a web3 contract instance, then deploy and get a deployment promise.
  dynamicContract = new web3.eth.Contract(abi);
  console.log(dynamicContract);
  dynamicPromise = dynamicContract.deploy({
    data: byteCode
  }).send({
    from: account,
    gas: 1500000,
    gasprice: 2000000000
  }); // deploy the contract and tell it to limit gas and gasprice.

  // call the contract's sayHello pure method
  dynamicPromise.then(newContractInstance => {
    newContractInstance.methods.sayHello().call({ from: account }).then(result => {
      res.send(result);
    });
  });

});
