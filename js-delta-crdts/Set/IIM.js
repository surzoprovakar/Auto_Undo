const fs = require('fs')
const { execSync } = require('child_process')

CRDT = require('delta-crdts')
set = CRDT('aworset')
ars = set("s1")

var is_undoing = false
var prev_size
var after_size
var operations_history = []
var funcs = []
var numbers = []

function read_crdts(filename) {
    var file = require(filename)
    return file.crdts.filter((element) => element.crdt === "set")
}

function read_functions(crdt) {
    return crdt[0].functions
}

var crdts = read_crdts('../MetaData/metaData.json')
var functions = read_functions(crdts)
var no_op = crdts[0].no_op
// console.log(crdts)
// console.log(functions)
// console.log(no_op)

function generateUndoAction(funcName, param, undo_func) {
    if (Math.abs(prev_size - after_size) == 0) {
        console.log("No Op detected")
        return
    }
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
        var patchedFunc = "var origfunc = ars." + funcName + "\n\
        ars." + funcName + " = function (" + funcParam + ") {\n\
        console.log(\"calling proxied " + funcName + "\")\n\
        origfunc.apply(this, [" + funcParam + "])\n\
        after_size =  ars.value().size\n\
        if (is_undoing) {\n\
        generateUndoAction(" + "\"" + funcName + "\"" + ", " + funcParam + "," + "\"" + undoFunc + "\"" + ")\n\
        }\n\
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

var undoable = function (funcs, custom_undo_check) {
    is_undoing = true
    funcs.forEach(f => {
        prev_size = eval("ars." + no_op)
        f()
    })
    is_undoing = false
    ars.value().forEach(v => numbers.push(v))
    if (custom_undo_check) {
        console.log("undo is actuating depending on custom logic")
        execute_undo(ars)
    } else {
        if (undo_check()) {
            console.log("undo is actuating depending on metaData logic")
            execute_undo(ars)
        }
        else { console.log("undo_not required") }
    }
    numbers.length = 0
    operations_history.length = 0
}

function undo_check() {
    var file = crdts[0].stat + ".py"
    var threshold = crdts[0].max
    const command = `python3 ../DM/` + file + ` ${numbers.join(' ')}`
    const output = execSync(command)
    const res = parseFloat(output.toString().trim())
    // console.log(res)

    return res > threshold ? true : false
}

function execute_undo(c) {
    while (operations_history.length > 0) {
        const [opName, revVal] = operations_history.pop()

        if (opName == 'add') { c.add(revVal) }
        else { c.remove(revVal) }

    }
}

module.exports = {
    generate_patched,
    execute_patch,
    undoable
}