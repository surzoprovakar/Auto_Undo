var Counter = require('./counter')
const fs = require('fs')
const { execSync, exec, spawn } = require('child_process');
const util = require("util")
const execProm = util.promisify(exec)

//const child_process = require('child_process')
//const exec = require('util').promisify(require('child_process').exec)

var is_undoing = false
var operations_history = []

const rev_map = new Map()
rev_map.set('inc', 'dec')
rev_map.set('dec', 'inc')

function read_json(filename) {
    var file = require(filename)
    return file.functions
}
var metaData = read_json('./metadata.json')

function change_undoing() {
    if (is_undoing) { is_undoing = false }
    else { is_undoing = true }
}

function generateUndoAction(funcName, param) {
    console.log("generatign undo action: " + funcName + ", " + param)
    //consult Prolog config to determine what the undo action for this CRDT func is
    operations_history.push([rev_map.get(funcName), param])
}

function WriteinProlog() {
    var fileName = "DBs/pn.pl"
    if (!fs.existsSync("DBs")) {
        fs.mkdirSync("DBs", { recursive: true })
    }
    const writeStream = fs.createWriteStream(fileName)
    //writeStream.once('open', (fd) => {
        writeStream.write(":-include('../rules.pl').\n")
        operations_history.forEach(delta => writeStream.write("update(pn, " + delta[1] + ").\n"))
        writeStream.write("undo :- should_undo(pn)-> writeln('1'); writeln('0'), halt.\n")
        writeStream.write(":- initialization undo, halt.")
        writeStream.end()
    //})
    
}

function WriteinGregory() {
    var fileName = "DBs/pn.pl"
    if (!fs.existsSync("DBs")) {
        fs.mkdirSync("DBs", { recursive: true })
    }
    //const writeStream = fs.createWriteStream(fileName)
    //writeStream.once('open', (fd) => {
        let source = ":-include('../rules.pl').\n" 
        operations_history.forEach(delta => source += "update(pn, " + delta[1] + ").\n")
        source += "undo :- should_undo(pn)-> writeln('1'); writeln('0'), halt.\n"
        source += ":- initialization undo, halt."

        fs.writeFileSync(fileName, source)
        
    //})
    
}
function check_undo() {
    
    WriteinGregory()
    console.log("after write")
    /*
    var fName = "DBs/pn.pl"
    var query = "swipl -q -s " + fName + " -g undo."
    let ls;
    //let out = exec(query, { encoding: 'utf-8' }) 
    */
    var fName = "DBs/pn.pl"
    var query = "swipl -q -s " + fName + " -g undo."
    ls = execSync(query, {encoding: "utf8"})
    console.log(ls)
    // exec(query, (error, stdout, stderr) => {
    //     console.log("res is" + stdout)
    // })
    //console.log(out.stdout)
    
    
    //console.log(out.stdout)
    //ls = exec(`ls==$(query)`)
    //console.log(ls)
    
    // eval(`ls = ${query}`)


    // if (ls === 1) {
    //     return true
    // }

    // return false
    // var ls = exec(query)
    // ls.stdout.on("data", data => {
    //     console.log(`stdout: ${data}`);
    // });

    // try {
    //     const result = exec(query);
    //     console.log('Result:', result.stdout);
    // } catch (error) {
    //     console.error(`Error executing command: ${error}`);
    // }

    // var ls = eval(query)
    //console.log(ls)
    //if (ls[0] == '1') { console.log("true") }
    //else { console.log("false") }
}

//console.log(metaData)

// var origInc = Counter.prototype.inc
// Counter.prototype.inc = function (value) {
//     console.log("calling proxied inc")
//     if (!is_undoing) {
//         generateUndoAction("inc", value)
//     }
//     origInc.apply(Counter, [value]);
// }

var funcs = []
for (var func of metaData) {
    var funcName = func.name
    var funcParam = func.param
    //console.log(funcName, " ", funcParam) 
    var patchedFunc = "var origfunc = Counter.prototype." + funcName + "\n\
        Counter.prototype." + funcName + " = function (" + funcParam + ") {\n\
        console.log(\"calling proxied " + funcName + "\")\n\
        if (is_undoing) {\n\
        generateUndoAction(" + "\"" + funcName + "\"" + ", " + funcParam + ")\n\
        }\n\
        origfunc.apply(this, [" + funcParam + "])\n\
        }\n"
    funcs.push(patchedFunc)
    //eval(patchedFunc)
    //console.log(patchedFunc)
}

//console.log(funcs)
funcs.forEach((func) => {
    eval(func)
})

let c1 = new Counter("pn")
c1.inc(1)
c1.dec(1)
c1.inc(1)
c1.print()

change_undoing()
c1.inc(3)
c1.dec(1)
c1.inc(1)
c1.inc(2)
c1.dec(4)
c1.inc(2)
change_undoing()
if (check_undo() == true) {
    console.log("yes")
}

c1.print()

console.log(operations_history)