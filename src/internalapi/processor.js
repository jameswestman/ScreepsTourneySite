"use strict"

const historyQueue = require('./historyQueue')
const events = require('./events')
const scoring = require('./scoring')
const _ = require('lodash');

module.exports = class Processor {
    constructor(common) {
        this._common = common
        this._prevHistories = {}
        this._historyQueues = {}
        this._currentStatus = ["Waiting", undefined]
        this._tickrate = 100
        this._stopped = true
        this._interval = undefined
        this._startTime = 0
    }

    addHistory(object) {
        if(this._stopped) {
            return
        }

        this._common.challenge.saveRoomHistory(object)

        if(!this._historyQueues[object.room]) this._historyQueues[object.room] = new historyQueue()
        for(let time in object.ticks) {
            if(time >= this._startTime) this._historyQueues[object.room].push(object.ticks[time], time)
        }
    }

    setStatus(status, progress) {
        this._common.clientEV.emit("status", status, progress)
        this._currentStatus = [status, progress]
    }

    setTickrate(msPerTick) {
        this._tickrate = msPerTick
    }

    _process() {
        for(var room in this._historyQueues) {
            var [now, time] = this._historyQueues[room].pull()
            if(now) {
                var prev = this._prevHistories[room]

                // events
                if(prev) {
                    console.log("events " + time)
                    events(prev, now, (event, data) => {
                        this._common.challenge.writeEvent(time, room, event, data)
                        this._common.clientEV.emit("event", room, event, data)
                    })
                } else {
                    prev = this._prevHistories[room] = {}
                }

                // scoring
                // scoring[this._common.challenge.rules.scoring]

                // merge works in place, no need to assign result
                _.merge(prev, now)
            }
        }

        if(!this._stopped) this.start()
    }

    setStartTime(time) {
        this._startTime = time
        console.log("Starting at " + time)
    }

    start() {
        this._stopped = false
        this._interval = setTimeout(this._process.bind(this), this._tickrate)
    }

    stop() {
        this._stopped = true
    }
}
