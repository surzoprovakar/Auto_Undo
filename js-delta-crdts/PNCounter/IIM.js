const fs = require('fs')
const { execSync } = require('child_process')

CRDT = require('delta-crdts')
PN = CRDT('pncounter')
pn = PN("rg")

var is_undoing = false
var operations_history = []
var funcs = []
var numbers = []

function read_crdts(filename) {
    var file = require(filename)
    return file.crdts.filter((element) => element.crdt === "counter")
}

function read_functions(crdt) {
    return crdt[0].functions
}

var crdts = read_crdts('../MetaData/metaData.json')
var functions = read_functions(crdts)
// console.log(crdts)
// console.log(functions)

function generateUndoAction(funcName, param, undo_func) {
    if (param != null) {
        console.log("generating undo action for: " + funcName + ", " + param + "\n")
        operations_history.push([undo_func, param])
    } else {
        console.log("generating undo action for: " + funcName + "\n")
        operations_history.push([undo_func])
    }
}

function generate_patched() {
    for (var func of functions) {
        var funcName = func.name
        var funcParam = func.param
        var undoFunc = func.rg
        var patchedFunc = "var origfunc = pn." + funcName + "\n\
        pn." + funcName + " = function (" + funcParam + ") {\n\
        console.log(\"calling proxied " + funcName + "\")\n\
        if (is_undoing) {\n\
        generateUndoAction(" + "\"" + funcName + "\"" + ", " + funcParam + "," + "\"" + undoFunc + "\"" + ")\n\
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

var undoable = function (funcs) {
    is_undoing = true
    funcs.forEach(f => {
        f()
        numbers.push(pn.value())
    })
    is_undoing = false
    // console.log(operations_history)
    // console.log(numbers)
}

function undo_check() {
    var file = crdts[0].stat + ".py"
    var threshold = crdts[0].max
    const command = `python3 ../DM/` + file + ` ${numbers.join(' ')}`
    const output = execSync(command)
    const res = parseFloat(output.toString().trim())
    // console.log(res)

    if (res > threshold) { return true }
    return false
}

function execute_undo(c) {
    if (undo_check()) {
        console.log("undo required")
        while (operations_history.length > 0) {
            const [opName, revVal] = operations_history.pop()
            if (revVal != null) {
                if (opName == 'inc') { c.inc(revVal) }
                else { c.dec(revVal) }
            } else {
                if (opName == 'inc') { c.inc() }
                else { c.dec() }
            }
        }
    } else {
        console.log("undo_not required")
    }
}

module.exports = {
    generate_patched,
    execute_patch,
    undoable,
    undo_check,
    execute_undo
}