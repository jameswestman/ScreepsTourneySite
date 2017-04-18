"use strict"

const Node = function(data, time) {
    this.next = null
    this.time = time
    this.data = data
}

class Queue {
    constructor() {
        this.first = null
        this.last = null
        this.size = 0
    }

    pull() {
        if(!this.first) return [undefined, undefined]
        var result = this.first
        this.first = this.first.next
        this.size --
        if(this.size === 0) this.last = null
        return [result.data, result.time]
    }

    pullUntil(time) {
        var result = []
        while(this.first && this.first.time <= time) {
            result.push(this.pull())
        }
        return result
    }

    push(history, time) {
        var node = new Node(history, time)

        if(!this.first) {
            this.first = node
            this.last = node
        } else {
            this.last.next = node
            this.last = node
        }

        this.size ++
    }
}

module.exports = Queue
