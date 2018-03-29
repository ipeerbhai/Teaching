// This lesson to be used with Slide 20.  Let's talk about promise timing.

var promiseHello = new Promise(function(resolve, reject) {
  console.log("Hello There");
  resolve(24);
});

var promiseWorld = new Promise(function(resolve, reject) {
  console.log("General Kenobi");
  resolve(42);
});

// run the promised code, watch the resolve chain.
promiseHello.then(value => {
    console.log(value);
    return(promiseWorld); // creates the chain.
}).then((value)=> {
    console.log(value); // handles chain resolution
});


// Question: why didn't "24" come before, "General Kenobi"?