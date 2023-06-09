const prompt = require('prompt-sync')()
CRDT = require('delta-crdts')
set = CRDT('aworset')
ars = set("s1")

module.exports = {
    custom_undo_check
}

function custom_undo_check() {
    // users have the flexibility to add custom logics here rather than metaData
    const input = prompt("Enter 0 or 1: ")
    return input == 1 ? true : false
}

const { generate_patched, execute_patch, undoable } = require('./IIM')

generate_patched()
execute_patch()

ars.add(1)
ars.add(2)
ars.add(3)
ars.remove(3)
ars.add(3)
console.log(ars.value())

undoable([
    () => ars.add(4),
    () => ars.add(2),
    () => ars.remove(2),
    () => ars.add(1),
    () => ars.add(5),
    () => ars.remove(3),
    () => ars.remove(5)
], custom_undo_check())

console.log(ars.value())