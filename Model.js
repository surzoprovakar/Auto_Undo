const fs = require('fs')
const { execSync } = require('child_process')

var updates_num = 100
var undo_nums = 40
var error_updates = 20

var undo = "undo_triggered(crdt)"
var not_undo = "not_triggered(crdt)"
var event = "undo_check(crdt)"
var cond_event = "error_prone(crdt)"
var not_cond_event = "not_error_prone(crdt)"
var query = "\"prob(undo_triggered(crdt),Prob),write(Prob),halt.\""

let start_lib = ":- use_module(library(pita)).\n\:- pita.\n\:- begin_lpad.\n\n"

let end_lib = "\nundo_check(crdt).\n\:- end_lpad."

var fileName = "prob_model.pl"

function calc_undo_trigger() {
    return undo_nums / updates_num
}

function calc_conditional() {
    return error_updates / updates_num
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