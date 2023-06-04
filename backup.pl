:- use_module(library(pita)).
:- pita.
:- begin_lpad.

undo_triggered(crdt): 0; not_triggered(crdt) : 0:-undo_check(crdt),\+error_prone(crdt).

undo_triggered(crdt): 1 ; not_triggered(crdt) : 0:-undo_check(crdt),error_prone(crdt).

not_error_prone(crdt):1 ; error_prone(crdt):0.

undo_check(crdt).

:- end_lpad.
%- prob(undo_triggered(crdt),Prob). 