const test =  (function() {
    let testString = 'Here is a test for you';

    function sayString() {
        alert(testString);
    }

    return {
        sayString: sayString
    }
})()