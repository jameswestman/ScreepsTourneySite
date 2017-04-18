"use strict"

/**
 * Finds notable events that have occurred between two ticks. Note: Callback
 * MUST NOT be called asynchronously
 * @param  {[type]}   prev The previous tick's room history. Should be a full room object
 * @param  {[type]}   cur  The current tick's room history. Need only contain properties that change from the previous tick
 * @param  {Function} cb   A callback to be called when an event is found. Will be called with two parameters: a string denoting the type of event and an object containing details.
 */
module.exports = function(prev, now, cb) {
    for(var id in now) {
        var obj = now[id]
        if(obj) switch(obj.type || prev[id].type) {
            case "controller":
                controller = true
                if(prev[id] && obj.level > prev[id].level) {
                    cb("rcl", { level: obj.level })
                }
                break
            case "storage":
                if(!prev[id]) cb("storage")
                break
            case "terminal":
                if(!prev[id]) cb("terminal")
                break
            case "nuker":
                if(!prev[id]) cb("nuker")
                break
        }
    }
}
