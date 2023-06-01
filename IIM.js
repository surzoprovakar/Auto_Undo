var Counter = require('./counter')
const fs = require('fs')
const { execSync } = require('child_process');

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

function WriteinGregory() {
    var fileName = "DBs/pn.pl"
    if (!fs.existsSync("DBs")) {
        fs.mkdirSync("DBs", { recursive: true })
    }
    let source = ":-include('../rules.pl').\n"
    operations_history.forEach(delta => source += "update(pn, " + delta[1] + ").\n")
    source += "undo :- should_undo(pn)-> writeln('1'); writeln('0'), halt.\n"
    source += ":- initialization undo, halt."

    fs.writeFileSync(fileName, source)

}
function check_undo() {
    WriteinGregory()
    var fName = "DBs/pn.pl"
    var query = "swipl -q -s " + fName + " -g undo."
    ls = execSync(query, { encoding: "utf8" })
    //console.log(ls)
    if (ls[0] == '1') { return true }
    return false
}


var funcs = []
function generate_patched() {
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
    }
}

function execute_patch() {
    //console.log(funcs)
    funcs.forEach((func) => {
        eval(func)
    })
}

function execute_undo(c) {
    while (operations_history.length > 0) {
        const [opName, revVal] = operations_history.pop()
        if (opName == 'inc') { c.inc(revVal) }
        else { c.dec(revVal) }
    }
}


module.exports = {
    generate_patched,
    execute_patch,
    change_undoing,
    check_undo,
    execute_undo,
    operations_history
}