const prompt = require('prompt-sync')()
CRDT = require('delta-crdts')
PN = CRDT('pncounter')
pn = PN("rg")

module.exports = {
    custom_undo_check
}

function custom_undo_check() {
    // users have the flexibility to add custom logics here rather than metaData
    const input = prompt("Enter 0 or 1: ")
    return input == 1 ? true : false
}

const { generate_patched, execute_patch, undoable, execute_undo } = require('./IIM')

generate_patched()
execute_patch()


pn.inc()
pn.dec()
pn.inc()
pn.inc()
console.log(pn.value())

undoable([
    () => pn.inc(),
    () => pn.inc(),
    () => pn.dec(),
    () => pn.inc(),
    () => pn.inc(),
    () => pn.dec(),
    () => pn.dec()
], custom_undo_check())

console.log(pn.value())