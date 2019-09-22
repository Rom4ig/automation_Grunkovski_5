function doSomething() {
  return new Promise((resolve, reject) => {
    console.log("It is done.");
    // Succeed half of the time.
    if (Math.random() > .5) {
      resolve("SUCCESS")
    } else {
      reject("FAILURE")
    }
  })
}

function successCallback(result) {
  console.log("It succeeded with " + result);
}

function failureCallback(error) {
  console.log("It failed with " + error);
}

doSomething().then(successCallback, failureCallback);