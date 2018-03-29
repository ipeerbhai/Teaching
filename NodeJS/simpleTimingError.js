// Use with slide 14 to see how timing doesn't work the way we'd expect in a synchronous language.

function test() {
    console.log(1);
    setTimeout(function() {
        console.log(2)
    }, 0);
    console.log(3);
}

test();

// Question:  Why is this out of order?