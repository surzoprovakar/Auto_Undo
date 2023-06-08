// https://github.com/peer-base/js-delta-crdts
// https://github.com/orbitdb/crdts

var Counter = require('./counter')
const fs = require('fs')
const { execSync } = require('child_process')

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

function generateUndoAction(funcName, param) {
    if (!is_no_op(0, (0 + param))) {
        console.log("generating undo action: " + funcName + ", " + param + "\n")
        //consult Prolog config to determine what the undo action for this CRDT func is
        operations_history.push([rev_map.get(funcName), param])
    } else {
        console.log("\n")
    }
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

function is_no_op(prev_val, cur_val) {
    var fName = "no_op.pl"
    var query = "swipl -q -s " + fName + " -g \"is_no_op(" + prev_val + "," + cur_val + "), halt\"."
    var ls = execSync(query, { encoding: "utf8" })
    console.log("Res from Is-No-Op " + ls)
    if (ls[0] == '1') { return true }
    return false
}

// var s = is_no_op(1,1)
// console.log(s)

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

var undo_script = function (funcs) {
    is_undoing = true
    funcs.forEach(f => f())
    is_undoing = false
}

module.exports = {
    generate_patched,
    execute_patch,
    undo_script,
    check_undo,
    execute_undo,
    operations_history
}