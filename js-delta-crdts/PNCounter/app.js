CRDT = require('delta-crdts')
PN = CRDT('pncounter')
pn = PN("rg")

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
])

console.log(pn.value())

execute_undo(pn)

console.log(pn.value())