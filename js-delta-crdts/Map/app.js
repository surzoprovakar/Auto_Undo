// CRDT = require('../src/ormap')
// map = CRDT.initial()
// var s = map.state
// s.set('a', 1)
// s.set('b', 2)
// s.set('c', 1)
// console.log(s)
// s.delete('b')
// console.log(s)

CRDT = require('delta-crdts')
map = CRDT('ormap')
orm = map('m1')
ms = orm.state().state
const { generate_patched,execute_patch, operations_history } = require('./IIM')


generate_patched()
execute_patch()

ms.set('a', 1)
ms.set('b', 2)
ms.set('c', 3)
// console.log(ms)
ms.set('a', 5)
ms.delete('b')
ms.delete('d')
ms.set('a', 5)
console.log(ms.entries())

console.log(operations_history)