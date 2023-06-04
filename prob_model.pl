:- use_module(library(pita)).
:- pita.
:- begin_lpad.

undo_triggered(crdt):0.4; not_triggered(crdt):0.6:-undo_check(crdt),not_error_prone(crdt).
undo_triggered(crdt):0.4; not_triggered(crdt):0.6:-undo_check(crdt),error_prone(crdt).
not_error_prone(crdt):0.2;error_prone(crdt):0.8.

undo_check(crdt).
:- end_lpad.