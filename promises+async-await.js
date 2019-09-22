async function f() {

  let promise = new Promise((resolve, reject) => {
    setTimeout(() => resolve("Great!"), 1000)
  });

  let result = await promise; 

  alert(result);
}

f();