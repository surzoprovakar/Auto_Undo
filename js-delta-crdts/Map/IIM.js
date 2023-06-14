const fs = require('fs')
const { execSync } = require('child_process')

CRDT = require('delta-crdts')
map = CRDT('ormap')
orm = map('m1')
ms = orm.state().state

var no_op
var operations_history = []
var funcs = []

function read_crdts(filename) {
    var file = require(filename)
    return file.crdts.filter((element) => element.crdt === "map")
}

function read_functions(crdt) {
    return crdt[0].functions
}

var crdts = read_crdts('../MetaData/metaData.json')
var functions = read_functions(crdts)
var no_op = crdts[0].no_op
var cond = crdts[0].cond

// console.log(functions)
// console.log(no_op)
// console.log(cond)

function generateUndoAction(funcName, param1, param2, undo_func, no_op) {
    if (no_op) {
        console.log("No Op detected")
        return
    } else {
        console.log("generating undo action for: " + funcName + "\n")
        operations_history.push([undo_func, param1, param2])
    }
}

function generate_patched() {

    const uniqueFunctions = [...new Set(functions.map(item => item.name))]
    // console.log(uniqueFunctions)
    for (var func of uniqueFunctions) {
        var patchedFunc
        // console.log(func)
        if (func == 'set') {
            patchedFunc = "var origSet = ms." + func + "\n\
            ms." + func + " = function (key, val) {\n\
                console.log(\"calling proxied set\")\n\
                if (eval(\"ms.\" + cond)) {\n\
                    console.log(\"key already exists\")\n\
                    var meta = functions.find((fn) =>  fn.cond === 'true')\n\
                    var undoFunc = meta.rg\n\
                    var param1 = key\n\
                    var param2 = ms.get(key)\n\
                    if (ms.get(key) == val) { no_op = true }\n\
                    else { no_op = false }\n\
                    generateUndoAction(" + "\"" + func + "\"" + ", param1, param2, undoFunc, no_op)\n\
                    origSet.apply(this, [key, val])\n\
                } else {\n\
                    var meta = functions.find((fn) =>  fn.cond === 'false')\n\
                    var undoFunc = meta.rg\n\
                    var param = key\n\
                    no_op = false\n\
                    generateUndoAction(" + "\"" + func + "\"" + ", param, null, undoFunc, no_op)\n\
                    origSet.apply(this, [key, val])\n\
                }\n\
            }\n"
            funcs.push(patchedFunc)
        }
        else {
            patchedFunc = "var origDel = ms." + func + "\n\
            ms." + func + " = function (key) {\n\
                console.log(\"calling proxied delete\")\n\
                if (eval(\"ms.\" + cond)) {\n\
                    no_op = false\n\
                    var meta = functions.find((fn) => fn.name === " + "\"" + func + "\"" + ")\n\
                    var undoFunc = meta.rg\n\
                    var param1 = key\n\
                    var param2 = ms.get(key)\n\
                    origDel.apply(this, [key])\n\
                } else {\n\
                    no_op = true\n\
                    console.log(\"key not in there\")\n\
                }\n\
                generateUndoAction(" + "\"" + func + "\"" + ", param1, param2, undoFunc, no_op)\n\
            }\n"
            funcs.push(patchedFunc)
        }
    }
}
// console.log(operations_history)
// console.log(funcs)

function execute_patch() {
    //console.log(funcs)
    funcs.forEach((func) => {
        eval(func)
    })
}

function execute_undo(ms) {
    while (operations_history.length > 0) {
        const [opName, key, val] = operations_history.pop()

        if (opName == 'delete') { ms.delete(key) }
        else { ms.set(key, val) }

    }
}

module.exports = {
    generate_patched,
    execute_patch,
    operations_history
}

function is_no_op(map1, map2) {
    if (map1.size !== map2.size) { return true }
    for (let [key, value] of map1) {
        if (!map2.has(key) || map2.get(key) !== value) { return true }
    }
    return false
}