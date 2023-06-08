const { execSync } = require('child_process')

// const a = 5
// const b = 10
// const command = `python3 py2js.py ${a} ${b}`
// const output = execSync(command)
// console.log(output.toString())

var numbers = [5, 12, 15]
const file = "py2js.py"
const command = `python3 ` +  file + ` ${numbers.join(' ')}`
const output = execSync(command)

console.log(parseFloat(output.toString().trim()))