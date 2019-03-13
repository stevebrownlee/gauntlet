"use strict"

Gauntlet = function (global) {
    /*
      Base weapon object that all other specific weapons will
      have as their prototype.
    */
    const Weapon = Object.create(gutil.ObjectExtensions)

    Weapon.property("id", "nothing")
          .property("label", "bare hands")
          .property("hands", 2)
          .property("base_damage", 1)
          .property("ranged", false)
          .property("poisoned", false)

    // Swing method modifies the damage based on wielder strength
    Weapon.def("swing", function (modifier) {
        this.strength_modifier = modifier
        return this
    })
    .def("at", function (target) {
        // Calculate base weapon damage
        let damage = Math.round(Math.random() * this.base_damage + 1)

        // Calculate if a critical hit was made
        const critical = Math.floor(Math.random() * 100)
        if (critical > 85) {
            console.log("%c** CRITICAL HIT **", "color:#fff; background-color:#000")
            // Add strength modifier. Bypasses target protection if critical.
            damage += Math.round(this.strength_modifier)
            damage *= 3
        } else {
            // Add strength modifier and reduce by target's armor
            damage += Math.round(this.strength_modifier - target.protection)
        }

        // Minimum damage is 0
        damage = (damage < 0) ? 0 : damage

        // Reduce target's health
        target.health -= damage

        return {
            weapon: this.label,
            target: target.name,
            damage: damage
        }
    })
    .def("toString", function () {
        return `${this.label}`
    })

    const _internal = gutil.privy.init() // Private store

    // Armory object contains all weapons loaded from JSON file
    const Armory = Object.create(gutil.ObjectExtensions)

    Armory.def("init", function () {
        _internal(this).weapon_list = []
        return this
    })

    // Method to load the weapons from the JSON file
    .def("load", function () {
        return fetch("./data/weapons.json")
            .then(response => response.json())
            .then(json => {
                json.weapons.each(weapon =>
                    _internal(this).weapon_list.push(
                        gutil.compose(Weapon, weapon)
                    )
                )
            })
    })

    /**
     * Make the Horde object iterable. Yields individual monsters
     * from the private `horde` Map
     */
    Armory[Symbol.iterator] = function* () {
        yield* [..._internal(this).weapon_list]
    }

    global.Armory = Armory.init()
    return global

}(Gauntlet || {})
