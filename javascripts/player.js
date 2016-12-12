"use strict";

var Gauntlet = function (gauntlet) {
  let army = Object.create(null);

  /*
    Define the base object for any combatant of Gauntlet,
    whether a human combatant or a monster.
   */
  let combatant = army.Player = __.compose(Object.create(null), ObjectExtensions);

  combatant.property("species", null)
    .property("profession", null)
    .property("weapon", null)
    .property("name", null)
    .property("protection", 0)
    .property("health", 0)
    .property("strength", 90)
    .property("intelligence", 90)
    .property("effects", [])
    .property("limbs", ["head", "neck", "arm", "leg", "torso"])
    .property("skinColor", "")
    .property("skinColors", ["gray"])

    .def("toString", function() {
      let output = [this.name,
        ": a ",
        this.skinColor,
        (this.skinColor) ? " skinned " : "",
        this.species,
        " ",
        this.profession.label,
        " with ",
        this.health,
        ` health, ${this.strength} strength, and ${this.intelligence} intelligence`,
        (this.profession.magical) ? ". I smell a mage" : ` is wielding a ${this.weapon}.`
      ].join("");
      return output;
    })


    .def("equip", function (profession, weapon) {
      this.health = Math.floor(Math.random() * 200 + 150);

      // Compose a profession
      if (!profession) {
        this.setProfession();
      } else {
        this.setProfession(profession);
      }

      // Use the stat modifiers for the species
      if ("healthModifier" in this) {
        this.modifyHealth(this.healthModifier)
            .modifyStrength(this.strengthModifier)
            .modifyIntelligence(this.intelligenceModifier);
      }

      // Compose a weapon
      if (!this.profession.magical) {
        this.setWeapon(weapon);
      }

      this.setSkin();

      return this;
    })

    .def("modifyHealth", function(bonus) {
      this.health += bonus;
      if (this.health < 20) this.health = 20;
      return this;
    })

    .def("modifyStrength", function(bonus) {
      this.strength += bonus;
      if (this.strength < 10) this.strength = 10;
      return this;
    })

    .def("modifyIntelligence", function(bonus) {
      this.intelligence += bonus;
      if (this.intelligence < 10) this.intelligence = 10;
      return this;
    })

    .def("setProfession", function(profession) {

      if (!profession) {
        this.profession = gauntlet.GuildHall.classes().get(this.allowedClasses.random());
      } else {
        this.profession = profession;
      }

      try {
        this.modifyHealth(this.profession.healthModifier)
            .modifyStrength(this.profession.strengthModifier)
            .modifyIntelligence(this.profession.intelligenceModifier);
      } catch (ex) {
        console.error(ex, profession);
      }

      return this;
    })

    .def("setWeapon", function(newWeapon) {
      try {
        if (this.profession && !this.profession.magical && !newWeapon) {
          this.weapon = gauntlet.WeaponRack.weapons().random();
        } else if (newWeapon) {
          this.weapon = newWeapon;
        }
      } catch (ex) {
        console.log("this.profession.allowedWeapons", this.profession.allowedWeapons);
      }

      return this;
    })

    .def("setSkin", function() {
      this.skinColor = this.skinColors.random();
      return this;
    });

  /*
    Define the base properties for a human in a
    constructor function.
   */
  army.Human = Object.create(combatant);

  army.Human.def("init", function (name) {
    this.species = "Human";
    this.name = name;
    this.intelligence = this.intelligence + 20;
    this.skinColors.push("brown", "red", "white", "disease");

    this.allowedClasses = ["Warrior", "Berserker", "Valkyrie", "Monk"];
    this.allowedClasses.push("Wizard", "Conjurer", "Sorcerer");
    this.allowedClasses.push("Thief", "Ninja");

    return this;
  });

  // Attach the army to the global gauntlet object
  gauntlet.Army = army;

  return gauntlet;

}(Gauntlet || {});
