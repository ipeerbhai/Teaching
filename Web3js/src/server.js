// basic example using a deployed smart contract to add a new candidate
// to a voter form.

// import required librarires ( ES5 syntax )
const express = require("express");
const path = require("path");
const fs = require("fs");
const Web3 = require("web3");
const bodyParser = require("body-parser");

// Init the app
var app = express();
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(express.static(__dirname + "/../public"));
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
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
var connectedContractPromise = new web3.eth.Contract(
  HelloContractObject.abi,
  HelloContractObject.networks["5777"].address,
  null
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
  console.log(req.body.firstName);
  res.send("ok");
});
