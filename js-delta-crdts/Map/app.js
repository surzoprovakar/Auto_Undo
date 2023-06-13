// CRDT = require('../src/ormap')
// map = CRDT.initial()
// var s = map.state
// s.set('a', 1)
// s.set('b', 2)
// s.set('c', 1)
// console.log(s)
// s.delete('b')
// console.log(s)

const prompt = require('prompt-sync')()
CRDT = require('delta-crdts')
map = CRDT('ormap')
orm = map('m1')
ms = orm.state().state
var no_op

//#region Wrapper for the Update methods
function add_key(key, val) {
    if (ms.has(key)) { modify_key(key, val) }
    else {
        ms.set(key, val)
        no_op = false
    }
}

function modify_key(key, val) {
    if (val == ms.get(key)) {
        no_op = true
    } else {
        console.log('modifying existing key')
        ms.set(key, val)
        no_op = false
    }
}

function remove_key(key) {
    if (ms.has(key)) {
        ms.delete(key)
        no_op = false
    }
    else {
        console.log("key not present")
        no_op = true
    }
}
//#endregion

module.exports = {
    custom_undo_check,
    add_key,
    modify_key,
    remove_key
}

function custom_undo_check() {
    // users have the flexibility to add custom logics here rather than metaData
    const input = prompt("Enter 0 or 1: ")
    return input == 1 ? true : false
}

const { generate_patched, execute_patch, undoable } = require('./IIM')

generate_patched()

add_key('a', 1)
add_key('b', 2)
add_key('c', 1)
console.log(ms)
add_key('c', 4)
console.log(ms)

remove_key('a')
remove_key('d')
console.log(ms)