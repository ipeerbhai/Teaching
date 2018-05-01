// This example program demonstrates the Throw/Try/Catch/Finally

// this function reads the args and throws if any argument present.
function ThrowsAnErrorOnArg() {
    if (process.argv.length > 2) { // why 2?  Node is argv[0], 'ThrowTryCatch' is argv[1].
        throw new Error("Too many arguments!");
    }
}

// This try block will call the function, which may or may not throw.  If it does throw, it logs the exception.  either way, we say goodbye!
try {
    ThrowsAnErrorOnArg(); // call the dangerous function.
}
catch( theException ) {
    console.log(theException); // log the exception we where thrown.
}
finally {
    console.log("Goodbye!"); // either way, say goodbye.
}