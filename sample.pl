:- use_module(library(pita)).

# :- if(current_predicate(use_rendering/1)).
# :- use_rendering(c3).
# :- use_rendering(graphviz).
# :- use_rendering(table,[header(['Multivalued variable index','Rule index','Grounding substitution'])]).
# :- endif.

:- pita.


:- begin_lpad.

should_undo(crdt): 0.5; not_undo(crdt) : 0.5:-undo_check(crdt),error_updates(crdt).

should_undo(crdt): 0.6 ; not_undo(crdt) : 0.4:-undo_check(crdt),math_model_undo(crdt).

error_updates(crdt):0.2.
math_model_undo(crdt):0.5.

undo_check(crdt).


:- end_lpad.

%- prob(should_undo(crdt),Prob).  % what is the probability that crdt lands should_undo?
% expected result 0.51