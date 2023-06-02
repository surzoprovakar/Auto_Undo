:- use_module(library(pita)).

:- if(current_predicate(use_rendering/1)).
:- use_rendering(c3).
:- use_rendering(graphviz).
:- use_rendering(table,[header(['Multivalued variable index','Rule index','Grounding substitution'])]).
:- endif.

:- pita.


:- begin_lpad.

undo_triggered(CRDT): 1/2; not_triggered(CRDT) : 1/2:-undo_check(CRDT),\+error_prone(CRDT).

undo_triggered(CRDT): 0.6 ; not_triggered(CRDT) : 0.4:-undo_check(CRDT),error_prone(CRDT).

fair(CRDT):0.9 ; error_prone(CRDT):0.1.

undo_check(crdt).


:- end_lpad.

%- prob(undo_triggered(crdt),Prob).  % what is the probability that CRDT lands undo_triggered?
% expected result 0.51