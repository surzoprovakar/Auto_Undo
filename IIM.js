var Counter = require('./counter')

var is_undoing = false

function read_json(filename) {
    var file = require(filename)
    return file.functions
}

function generateUndoAction(funcName, param) {
    console.log("generatign undo action: " + funcName + ", " + param)
    //consult Prolog config to determine what the undo action for this CRDT func is
}

var metaData = read_json('./metadata.json')
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
        if (!is_undoing) {\n\
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
c1.inc(4)
c1.dec(1)
c1.print()
c1.dec(5)
c1.inc(1)
c1.print()