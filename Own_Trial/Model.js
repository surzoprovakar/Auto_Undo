const fs = require('fs')
const { execSync } = require('child_process')

var total_updates
var error_updates
var math_undos


// cplint dialects
var undo = "should_undo(crdt)"
var not_undo = "not_undo(crdt)"
var event = "undo_check(crdt)"
var error_event = "error_updates(crdt)"
var math_event = "math_model_undo(crdt)"


var query = "\"prob(should_undo(crdt),Prob),write(Prob),halt.\""

let start_lib = ":- use_module(library(pita)).\n\:- pita.\n\:- begin_lpad.\n\n"

let end_lib = "\nundo_check(crdt).\n\:- end_lpad."

var fileName = "prob_model.pl"

function calc_error_event() {
    return error_updates / total_updates
}

function calc_math_event() {
    return math_undos / total_updates
}

function write_in_model() {
    undo_val = calc_undo_trigger()
    error_val = calc_conditional()

    let contents = undo + ":" + undo_val + "; " + not_undo +
        ":" + (1 - undo_val) + ":-" + event + "," +
        not_cond_event + ".\n" +
        undo + ":" + undo_val + "; " + not_undo +
        ":" + (1 - undo_val) + ":-" + event + "," +
        cond_event + ".\n" +
        not_cond_event + ":" + error_val + ";" +
        cond_event + ":" + (1 - error_val) + ".\n"

    let contexts = start_lib + contents + end_lib


    fs.writeFileSync(fileName, contexts)
}

function get_probability() {
    write_in_model()
    var command = "swipl -q -s " + fileName + " -g " + query
    ls = execSync(command, { encoding: "utf8" })

    console.log(ls)
}

get_probability()