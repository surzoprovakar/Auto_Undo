const { execSync } = require('child_process')

const a = 5
const b = 10
const command = `python3 py2js.py ${a} ${b}`
const output = execSync(command)
console.log(output.toString())