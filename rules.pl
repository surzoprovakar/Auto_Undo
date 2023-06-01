average(L, A) :- sum_list(L, S), length(L, Len), A is S / Len.

all_updates(RN, L) :- findall(Val, update(RN, Val), L).

mean_update(RN, A) :- all_updates(RN, L), average(L, A).

should_undo(R) :- mean_update(R, Res), Res >= 2.