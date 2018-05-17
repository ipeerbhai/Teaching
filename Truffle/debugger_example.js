// This is pseudo-javascript.  It is the commands needed to debug the hello world contract.

// step 1 -- compile and  migrate a contract
// step 2 -- run truffle develop
// step 3 -- run migrate --reset inside the debugger
// step 4 -- run these JS commands:
var dep = Hello.deployed();
dep.then( instance => instance.sayHello.call() ).then(result => console.log(result));
