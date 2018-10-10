// This scriptlet is purely an example of web3 injected object detection
// it does nothing else.

function StartMeUp() {
    if (typeof window.web3 === 'undefined') {
      document.getElementById("elementHello").innerHTML = "no Web3 detected!";
    } else {
      myWeb3 = new Web3(web3.currentProvider); // per MetaMask docs.
      document.getElementById("elementHello").innerHTML = "web3 detected!";
    }
  }