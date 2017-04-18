"use strict"

/**
 * All scoring functions take a current room history as an argument and return
 * a score for that room. They also take a cache argument, which will be the
 * same for the same room.
 */

/**
 * In RCL scoring, all players who have reached RCL 8 are ranked in the order
 * they reached it. All remaining players are ranked by first their level and
 * second their progress toward the next level.
 */
module.exports.rcl = function(room, cache) {
    if(room[cache.controller]) {
        var controller = room[cache.controller]
    } else {
        for(var id in room) {
            if(room[id].type === "controller") {
                var controller = room[id]
                cache.controller = id
            }
        }
    }

    return controller.level
}
