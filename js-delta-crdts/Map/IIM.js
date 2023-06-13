const fs = require('fs')
const { execSync } = require('child_process')
var { add_key, modify_key, remove_key } = require('./app')

CRDT = require('delta-crdts')
map = CRDT('ormap')
orm = map('m1')
ms = orm.state().state

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

function generate_patched() {
    var origFunc = add_key
    console.log(origFunc)
    add_key = function (key, val) {
        console.log("calling proxied add key")
        origFunc.apply(this, [key, val])
    }
    console.log("here")
}


/*
function generateUndoAction(funcName, param, undo_func) {
    if (no_op) {
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
}*/


module.exports = {
    generate_patched
}


// function add_key(key, val) {
//     console.log("origin")
//     return key + val
// }

// var origFunc = add_key
// add_key = function(key, val) {
//     console.log("calling proxy")
//     return origFunc.apply(this,[key, val])
// }

// console.log(add_key(1,2))