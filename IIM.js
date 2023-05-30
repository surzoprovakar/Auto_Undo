var Counter = require('./counter')

var is_undoing = false

function read_json(filename)  {
    var file = require(filename)
    return file.functions
}

function generateUndoAction(funcName, param) {
    console.log("generatign undo action: " + funcName + ", " + param)
    //consult Prolog config to determine what the undo action for this CRDT func is
}

var metaData = read_json('./metadata.json')
var origInc = Counter.prototype.inc;
Counter.prototype.inc = function(value) {
    console.log("calling proxied inc")
    if (!is_undoing) {
        generateUndoAction("inc", value)
    }
    origInc.apply(Counter, [value]);
}

let c1 = new Counter("pn")
c1.inc(1)

//console.log(metaData)
/*
for (var func of metaData) {
    //var func = metaData[i]
    var funcName = func.name 
    var funcParam = func.param 
    //console.log(funcName, " ", funcParam) 

    var patchedFunc = "var patched"+funcName+ "= function(gregory) {\n\
        \tif (!is_undoing) {\n\
        \t\tgenerateUndoAction(\"inc\", \"gregory\")\n\
        \t}\n\
        \treturn Counter." + funcName +"(" + funcParam + ")\n\
        \t}"
    eval(patchedFunc)
    
    console.log(patchedFunc)
}
*/

// var patchedFunc = function(gregory) {
//     //////
//     if (!is_undoing) {
//         generateUndoAction("inc", "gregory")
//     }
//     return Counter.inc(gregory)
// }