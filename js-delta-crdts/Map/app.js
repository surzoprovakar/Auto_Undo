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
    () => ms.set('rg', 100),
    () => ms.set('rga', 500)
], custom_undo_check())
console.log(ms.entries())


undoable([
    () => ms.set('p', 5),
    () => ms.delete('q'),
    () => ms.delete('r'),
    () => ms.set('s', 5),
    () => ms.set('t', 4)
])
console.log(ms.entries())

ms.set('m', 11)
ms.set('n', 12)
console.log(ms.entries())

undoable([
    () => ms.set('a', 5),
    () => ms.delete('b'),
    () => ms.delete('d'),
    () => ms.set('a', 5),
    () => ms.set('d', 4),
    () => ms.set('x', 8),
    () => ms.set('y', 12),
    () => ms.set('d', 7)
])
console.log(ms.entries())

ms.delete('m')
ms.delete('n')
ms.delete('p')
ms.delete('s')
ms.delete('t')
console.log(ms.entries())

undoable([
    () => ms.set('@', 5),
    () => ms.set('#', 5),
    () => ms.set('%', 5),
    () => ms.set('^', 5),
    () => ms.set('&', 5),
    () => ms.set('!', 5),
    () => ms.set('~', 5),
    () => ms.set('(', 5),
    () => ms.set(')', 5),
    () => ms.set('*', 5),
    () => ms.set('/', 5),
    () => ms.set('|', 5),
    () => ms.set('||', 5)
])
console.log(ms.entries())
