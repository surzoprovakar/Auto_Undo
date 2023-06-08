class Counter {
    constructor(id) {
        this.name = id
        this.value = 0
    }
    inc(val) {
        console.log("added by ", val) 
        this.value += val
    }
    dec(val) {
        console.log("deducted by ", val) 
        this.value -= val
    }
    print() {
        console.log(this.name, ": value is ", this.value)
    }
}

module.exports = Counter