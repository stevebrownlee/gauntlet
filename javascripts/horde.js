"use strict"

Gauntlet = function (global) {
    const _internal = gutil.privy.init() // Private store

    // The Horde will contain all monster combatants
    const Horde = Object.create(gutil.ObjectExtensions)

    // Initialization
    Horde.def("init", function () {
        _internal(this).horde = new Map()
        _internal(this).names = new Set()
        return this
    })

    // Return all monsters
    Horde.def("all", function () {
        return _internal(this).horde
    })

    // Get a specific type of monster
    Horde.def("soldier", function (type) {
        return Object.create(_internal(this).horde.get(type))
    })

    // Get a random monster
    Horde.def("random", function () {
        let randomSoldier = null

        /*
          The Monster object needs to remain in the horde Map to
          maintain the prototype chain, but it can't be the basis
          for an actual soldier instance.
          */
        do {
            randomSoldier = _internal(this).horde.random()
        } while (randomSoldier.id === "Monster")

        // Give the soldier a random name
        randomSoldier.name = _internal(this).names.random()

        return randomSoldier
    })

    // Load all monsters from JSON file
    Horde.def("load", function () {
        return fetch("./data/horde.json")
            .then(response => response.json())
            .then(json => {
                /*
                  Load the names array in the JSON file into a Set
                  */
                json.names.each(name => {
                    _internal(this).names.add(name)
                })

                /*
                  Iterate over the objects in the class key and start
                  setting up the prototype chain, which is simplistic
                  since all specific enemies inherit from Monster at
                  this point.
                  */
                json.classes.each(monster => {
                    let object_prototype

                    // The base monster will always have Player as its prototype
                    if (monster.prototype === null) {
                        object_prototype = global.Player
                    } else {
                        object_prototype = _internal(this).horde.get(monster.prototype)
                    }

                    /*
                      Create a new object for the current monster based on the
                      corresponding prototype
                      */
                    let monster_for_map = gutil.compose(object_prototype, monster, {
                        species: monster["id"]
                    })

                    // Add creature to the horde Map
                    _internal(this).horde.set(monster.id, monster_for_map)

                })
            })
    })

    global.Horde = Horde.init()

    return global

}(Gauntlet || {})
