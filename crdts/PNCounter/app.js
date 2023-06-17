import promptSync from 'prompt-sync'
const prompt = promptSync()
import {PNCounter} from 'crdts'

var pn = new PNCounter("pnc")


export function custom_undo_check() {
    // users have the flexibility to add custom logics here rather than metaData
    const input = prompt("Enter 0 or 1: ")
    return input == 1 ? true : false
}


import { generate_patched, execute_patch, undoable } from './IIM.js'
generate_patched()
execute_patch()

pn.increment(1)
pn.decrement(1)
pn.increment(1)
pn.increment(1)
console.log(pn.value)

undoable([
    () => pn.increment(1),
    () => pn.increment(1),
    () => pn.decrement(1),
    () => pn.increment(1),
    () => pn.increment(1),
    () => pn.decrement(1),
    () => pn.decrement(1)
], custom_undo_check(), pn)

console.log(pn.value)