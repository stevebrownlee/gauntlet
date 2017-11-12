"use strict"

var Gauntlet = function (gauntlet) {
  // Symbols for object properties
  const intelligence = Symbol()
  const species = Symbol()
  const profession = Symbol()
  const weapon = Symbol()
  const name = Symbol()
  const protection = Symbol()
  const startingHealth = Symbol()
  const allowedWeapons = Symbol()
  const allowedClasses = Symbol()
  const health = Symbol()
  const strength = Symbol()
  const limbs = Symbol()
  const skinColor = Symbol()
  const skinColors = Symbol()

  /*
    Define the base object for any combatant of Gauntlet,
    whether a human combatant or a monster.
   */
  let combatant = Object.create(gutil.ObjectExtensions)

  combatant[species] = null
  combatant[profession] = null
  combatant[weapon] = null
  combatant[name] = null
  combatant[protection] = 0
  combatant[startingHealth] = 0
  combatant[allowedClasses] = []
  combatant[allowedWeapons] = null
  combatant[health] = 0
  combatant[strength] = 90
  combatant[intelligence] = 90
  combatant[limbs] = ["head", "neck", "arm", "leg", "torso"]
  combatant[skinColors] = ["gray"]
  combatant[skinColor] = ""

  combatant.toString = function () {
    let output = [this[name],
        ": a ",
        this[skinColor],
        (this[skinColor]) ? " skinned " : "",
        this[species],
        " ",
        this[profession].label,
        " with ",
        this[health],
        ` health, ${this[strength]} strength, and ${this[intelligence]} intelligence`,
        (this[profession].magical) ? ". I smell a mage" : ` is wielding a ${this[weapon]}.`
      ].join("")
    return output
  }

  combatant.equip = function (prof, weapon) {
    this[health] = Math.floor(Math.random() * 200 + 150)

    // Compose a profession
    this.profession = prof

    // Use the stat modifiers for the species
    if ("healthModifier" in this) {
      this[health] += this.healthModifier
      this[strength] += this.strengthModifier
      this[intelligence] += this.intelligenceModifier
    }

    // Compose a weapon
    if (!this[profession].magical) {
      this.weapon = weapon
    }

    this[skinColor] = this[skinColors].random()

    return this
  }

  combatant.attr(
    "profession",
    function () {
      return this[profession]
    },
    function (prof) {
      if (!prof) {
        this[profession] = gauntlet.GuildHall.classes.get(this[allowedClasses].random())
      } else {
        this[profession] = prof
      }
  
      try {
        this[health] += this[profession].healthModifier
        this[strength] += this[profession].strengthModifier
        this[intelligence] += this[profession].intelligenceModifier
      } catch (ex) {
        console.error(ex, prof)
      }
      
      return this
    }
  )

  .attr(
    "weapon", 
    function () {
      return this[weapon]
    },
    function (newWeapon) {
      try {
        if (this[profession] && !this[profession].magical && !newWeapon) {
          this[weapon] = gauntlet.Armory.weapons.random()
        } else if (newWeapon) {
          this[weapon] = newWeapon
        }
      } catch (ex) {
        console.log("this[profession].allowedWeapons", this[profession].allowedWeapons)
      }

      return this
    }
  )

  .attr(
    "limbs",
    function () { return this[limbs] },
    () => null
  )

  .attr(
    "name",
    function () { return this[name] },
    function (n) { return this[name] = n }
  )

  .attr(
    "strength", 
    function () { return this[strength] },
    function (str) { 
      this[strength] = str
      if (this[strength] < 10) this[strength] = 10
    }
  )

  .attr(
    "intelligence", 
    function () { return this[intelligence] },
    function (int) { 
      this[intelligence] = int
      if (this[intelligence] < 10) this[intelligence] = 10
    }
  )

  .attr(
    "protection",
    function () { return this[protection] },
    function (pro) { this[protection] = pro }
  )

  .attr(
    "startingHealth",
    function () { return this[startingHealth] },
    function (h) { this[startingHealth] = h }
  )

  .attr(
    "health", 
    function () { return this[health] }, 
    function (h) { this[health] = h }
  )

  /*
    Define the base properties for a human in a
    constructor function.
   */
  combatant.def("init", function (name) {
    this[species] = "Human"
    this.name = name
    this[intelligence] += 20
    this[skinColors].push("brown", "red", "white", "diseased")

    this[allowedClasses].push(
      "Warrior", "Berserker", "Valkyrie", "Monk",
      "Wizard", "Conjurer", "Sorcerer", "Thief", "Ninja"
    )

    return this
  })

  // Attach the player to the global gauntlet object
  gauntlet.Player = combatant

  return gauntlet

}(Gauntlet || {})
