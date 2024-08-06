## Javascript Concept 
- Timout Function
-   -   
```
function callWithTimeout(func, timeout) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error("timeout")), timeout)
      func().then(
        response => resolve(response),
        err => reject(new Error(err))
      ).finally(() => clearTimeout(timer))
    })
  }
```  