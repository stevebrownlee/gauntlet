"use strict"

Gauntlet = function (global) {
    const _internal = gutil.privy.init() // Private store

    // Create prototypal master spell. Add object extensions.
    let MasterSpell = Object.create(gutil.ObjectExtensions)

    // String representation of master spell
    MasterSpell.def("toString", function () {
        return `${this.label} of ${this.elements.random()}`
    })

    /*
      Reading the spell modifies the damage based on
      the mage's intelligence
    */
    MasterSpell.def("read", function (modifier) {
        this.intelligence_modifier = modifier
        return this
    })

    /*
      Casting the spell calculates total effect.
    */
    MasterSpell.def("cast", function () {
        this.effect = Math.round(Math.random() * this.base_effect + this.effect_modifier)
        return this
    })

    /*
      The `at` method applies the effect on the appropriate player
    */
    MasterSpell.def("at", function (target) {
        this.target = target
        // TODO: Add critical chance
        let total_effect = Math.round(this.effect + (this.intelligence_modifier || 0))
        total_effect *= (this.augment) ? 1 : -1

        const critical = Math.floor(Math.random() * 100)
        if (critical > 95) {
            console.log("%c** CRITICAL SPELL **", `color:#fff; background-color:#000`) // eslint-disable-line quotes
            total_effect *= 2
        }

        // If a protection spell, set protection to calculated amount
        if (this.affected_trait === "protection") {
            target.protection = total_effect

            // All other spells reduce the corresponding trait on the target
        } else {
            switch (this.affected_trait) {
                case "health":
                    target.health += total_effect
                    break

                case "strength":
                    target.strength += total_effect
                    break

                case "intellgence":
                    target.intelligence += total_effect
                    break

                default:
                    break
            }
        }

        return {
            spell: this.label,
            element: this.elements.random(),
            target: this.target.name,
            effect: this.affected_trait,
            damage: total_effect
        }
    })

    MasterSpell.property("name", "").property("base_damage", 0)
    MasterSpell.property("effect", 0).property("target", null)
    MasterSpell.property("elements", ["lightning", "fire", "water", "earth", "mysticism"])

    // Spellbook will hold all defined spells
    let Spellbook = gutil.compose(Object.create(null), gutil.ObjectExtensions)

    // Initialization sets up the private spell list array and name set
    Spellbook.def("init", function () {
        _internal(this).contents = []
        return this
    })

    // Accessor for the spell list
    Object.defineProperty(Spellbook, "spells", {
        get: function () {
            return _internal(this).contents
        }
    })

    // Loads spell properties from JSON file
    Spellbook.def("load", function () {
        return fetch("./data/spells.json")
            .then(response => response.json())
            .then(json => {
                json.spells.each(currentSpell =>
                    _internal(this).contents.push(gutil.compose(MasterSpell, currentSpell))
                )
            })
    })

    global.Spellbook = Spellbook.init()
    return global

}(Gauntlet || {})
