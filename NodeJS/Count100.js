let myOutVariable = "";


for (let i = 0; i <= 100; i++) { // count 0 .. 100
    myOutVariable += i + ", ";
    // if (i < 100) {
    //     process.stdout.write(i + ", "); // output the number with  a comma.
    // } else {
    //     console.log(i); //output numbers greater than 99 without a trailing ","
    // }

    // There's another way to accomplish this goal that isn't dependent on an if statement using strings.  Try and figure that out.

}
myOutVariable = myOutVariable.substr(0, myOutVariable.length - 2);
console.log(myOutVariable)