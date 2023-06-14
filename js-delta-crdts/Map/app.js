const prompt = require('prompt-sync')()
CRDT = require('delta-crdts')
map = CRDT('ormap')
orm = map('m1')
ms = orm.state().state

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

ms.set('a', 1)
ms.set('b', 2)
ms.set('c', 3)
console.log(ms.entries())

undoable([
    () => ms.set('a', 5),
    () => ms.delete('b'),
    () => ms.delete('d'),
    () => ms.set('a', 5)
], custom_undo_check())

console.log(ms.entries())