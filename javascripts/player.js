"use strict";

var Gauntlet = function (gauntlet) {
  // Symbols for object properties
  const intelligence = Symbol();
  const species = Symbol();
  const profession = Symbol();
  const weapon = Symbol();
  const name = Symbol();
  const protection = Symbol();
  const startingHealth = Symbol();
  const allowedWeapons = Symbol();
  const allowedClasses = Symbol();
  const health = Symbol();
  const strength = Symbol();
  const limbs = Symbol();
  const skinColor = Symbol();
  const skinColors = Symbol();

  /*
    Define the base object for any combatant of Gauntlet,
    whether a human combatant or a monster.
   */
  let combatant = Object.create(gutil.ObjectExtensions);

  combatant[species] = null;
  combatant[profession] = null;
  combatant[weapon] = null;
  combatant[name] = null;
  combatant[protection] = 0;
  combatant[startingHealth] = 0;
  combatant[allowedClasses] = [];
  combatant[allowedWeapons] = null;
  combatant[health] = 0;
  combatant[strength] = 90;
  combatant[intelligence] = 90;
  combatant[limbs] = ["head", "neck", "arm", "leg", "torso"];
  combatant[skinColors] = ["gray"];
  combatant[skinColor] = "";

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
      ].join("");
    return output;
  };

  combatant.equip = function (prof, weapon) {
    this[health] = Math.floor(Math.random() * 200 + 150);

    // Compose a profession
    if (!prof) {
      this.setProfession();
    } else {
      this.setProfession(prof);
    }

    // Use the stat modifiers for the species
    if ("healthModifier" in this) {
      this.modifyHealth(this.healthModifier)
          .modifyStrength(this.strengthModifier)
          .modifyIntelligence(this.intelligenceModifier);
    }

    // Compose a weapon
    if (!this[profession].magical) {
      this.setWeapon(weapon);
    }

    this.setSkin();

    return this;
  };

  combatant.modifyHealth = function (bonus) {
    this[health] += bonus;
    if (this[health] < 20) this[health] = 20;
    return this;
  };

  combatant.modifyStrength = function (bonus) {
    this[strength] += bonus;
    if (this[strength] < 10) this[strength] = 10;
    return this;
  };

  combatant.modifyIntelligence = function (bonus) {
    this[intelligence] += bonus;
    if (this[intelligence] < 10) this[intelligence] = 10;
    return this;
  };

  combatant.getProfession = function () {
    return this[profession];
  };

  combatant.setProfession = function (prof) {
    
    if (!prof) {
      this[profession] = gauntlet.GuildHall.classes().get(this[allowedClasses].random());
    } else {
      this[profession] = prof;
    }

    try {
      this.modifyHealth(this[profession].healthModifier)
          .modifyStrength(this[profession].strengthModifier)
          .modifyIntelligence(this[profession].intelligenceModifier);
    } catch (ex) {
      console.error(ex, prof);
    }
    
    return this;
  };

  combatant.def("setWeapon", function (newWeapon) {
      try {
        if (this[profession] && !this[profession].magical && !newWeapon) {
          this[weapon] = gauntlet.Armory.weapons().random();
        } else if (newWeapon) {
          this[weapon] = newWeapon;
        }
      } catch (ex) {
        console.log("this[profession].allowedWeapons", this[profession].allowedWeapons);
      }

      return this;
    })

    .def("getWeapon", function () {
      return this[weapon];
    })

    .def("getLimbs", function () {
      return this[limbs];
    })

    .def("getName", function () {
      return this[name];
    })

    .def("setName", function (n) {
      return this[name] = n;
    })

    .def("getStrength", function () {
      return this[strength];
    })

    .def("setStrength", function (str) {
      this[strength] = str;
    })

    .def("setIntelligence", function (int) {
      this[intelligence] = int;
    })

    .def("getIntelligence", function () {
      return this[intelligence];
    })

    .def("getProtection", function () {
      return this[protection];
    })

    .def("setProtection", function (prot) {
      this[protection] = prot;
    })

    .def("getStartingHealth", function () {
      return this[startingHealth];
    })

    .def("setStartingHealth", function (init) {
      return this[startingHealth] = init;
    })

    .def("getHealth", function () {
      return this[health];
    })

    .def("setHealth", function (h) {
      this[health] = h;
    })

    .def("setSkin", function() {
      this[skinColor] = this[skinColors].random();
      return this;
    });

  /*
    Define the base properties for a human in a
    constructor function.
   */
  combatant.def("init", function (name) {
    this[species] = "Human";
    this.setName(name);
    this.setIntelligence(this.getIntelligence() + 20);
    this[skinColors].push("brown", "red", "white", "disease");

    this[allowedClasses].push("Warrior", "Berserker", "Valkyrie", "Monk");
    this[allowedClasses].push("Wizard", "Conjurer", "Sorcerer");
    this[allowedClasses].push("Thief", "Ninja");

    return this;
  });

  // Attach the army to the global gauntlet object
  gauntlet.Player = combatant;

  return gauntlet;

}(Gauntlet || {});
