"use strict";

var Gauntlet = function ($$gauntlet) {

  // Base Weapon object
  const Weapon = {
    id: "nothing",
    label: "bare hands",
    base_damage: 1,
    hands: 2,
    ranged: false,
    poisoned: false,
    swing (modifier) {
      this.strength_modifier = modifier;
      return this;
    },
    at (target) {
      // Calculate base weapon damage
      let damage = Math.round(Math.random() * this.base_damage + 1);

      // Add strength modifier and reduce by target's armor
      damage += Math.round(this.strength_modifier - target.protection);

      // Minimum damage is 0
      damage = (damage < 0) ? 0 : damage;

      // Reduce target's health
      target.health -= damage;

      return {
        weapon: this.label,
        target: target.name,
        damage: damage
      };
    },
    toString () { return `${this.label}`; }
  };

  // WeaponRack will hold all defined weapons
  $$gauntlet.WeaponRack = function () {
    let weapon_list = [];

    return {

      // Method to return the entire collection of weapons
      weapons () {
        return weapon_list;
      },

      // Method to load the weapons from the JSON file
      load () {
        return new Promise((resolve, reject) => {
          $.ajax({url: "./data/weapons.json"}).done(response => {
            // Iterate all weapon objects in the JSON file
            JSON.parse(response).weapons.each(weapon =>
              weapon_list.push(
                __.compose(Weapon, weapon))
              );

            // Resolve the weapon loading promise with the weapon list
            resolve(weapon_list);

          }).fail((xhr, error, msg) => {
            reject(msg);
          });
        });
      }
    }
  }();

  return $$gauntlet;

}(Gauntlet || {});
