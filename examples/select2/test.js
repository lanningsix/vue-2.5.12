setImmediate(() => {
  console.log(123)
})
setTimeout(() => {
  console.log(456)
}, 0)