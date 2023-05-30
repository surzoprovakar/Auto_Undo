var Counter = require('./counter')


let c1 = new Counter("pn")
c1.inc(1)
c1.inc(2)
start_undo_record("undo1")
c1.inc(3)
c1.inc(4)
c1.print()

c1.dec(5)
c1.dec(2)
check_and_undo("undo1")
c1.print()