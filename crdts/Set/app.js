import promptSync from 'prompt-sync'
const prompt = promptSync()
// import {CmRDTSet, LWWSet, TwoPSet, ORSet} from 'crdts'

import * as CmRDTSet from '../src/CmRDT-Set.js'
var set = new CmRDTSet.default

export function custom_undo_check() {
    // users have the flexibility to add custom logics here rather than metaData
    const input = prompt("Enter 0 or 1: ")
    return input == 1 ? true : false
}

import { generate_patched, execute_patch, undoable } from './IIM.js'
generate_patched()
execute_patch()

set.add(1)
set.add(2)
set.add(3)
set.remove(3)
set.add(3)
console.log(set.values())

undoable([
    () => set.add(4),
    () => set.add(2),
    () => set.remove(2),
    () => set.add(1),
    () => set.add(5),
    () => set.remove(3),
    () => set.remove(5)
], custom_undo_check(), set)


console.log(set.values())

undoable([
    () => set.add(5)
], 0, set)

console.log(set.values())

undoable([
    () => set.add(6),
    () => set.add(7),
    () => set.remove(1),
    () => set.remove(2),
    () => set.remove(3),
    () => set.remove(5)
], 0, set)

console.log(set.values())

undoable([
    () => set.remove(6),
    () => set.remove(8),
    () => set.add(1),
    () => set.add(2),
    () => set.add(3),
    () => set.add(5),
    () => set.add(4),

], 0, set)

console.log(set.values())