var Counter = require('./counter')
const { generate_patched, execute_patch, undo_script, check_undo, execute_undo, operations_history } = require('./IIM')

generate_patched()
execute_patch()

let c1 = new Counter("pn")
c1.inc(1)
c1.dec(1)
c1.inc(1)
c1.print()

undo_script([
    () => c1.inc(3),
    () => c1.dec(1),
    () => c1.inc(1),
    () => c1.inc(2),
    () => c1.dec(4),
    () => c1.inc(2)
])

console.log("value before checking undo")
c1.print()
//console.log(operations_history)

if (check_undo() == true) {
    //console.log("yes")
    execute_undo(c1)
}

console.log("value after checking undo")
c1.print()