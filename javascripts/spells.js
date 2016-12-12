"use strict";

var Gauntlet = function ($$gauntlet) {

  // Base Weapon object
  const MasterSpell = {
    name: "",
    base_damage: 0,
    effect: 0,
    target: null,
    elements: ["lightning", "fire", "water", "earth", "mysticism"],
    toString () {
      return `${ this.label } of ${ this.elements.random() }`;
    },
    read (modifier) {
      this.intelligence_modifier = modifier;
      return this;
    },
    cast () {
      this.effect = Math.round(Math.random() * this.base_effect + this.effect_modifier);
      return this;
    },
    at (target) {
      this.target = target;
      // TODO: Add critical chance
      let total_effect = Math.round(this.effect + (this.intelligence_modifier || 0));
      total_effect *= (this.augment) ? 1 : -1;
      if (this.affected_trait === "protection") {
        target[this.affected_trait] = total_effect;
      } else {
        target[this.affected_trait] += total_effect;
      }

      return {
        spell: this.label,
        element: this.elements.random(),
        target: this.target.name,
        effect: this.affected_trait,
        damage: total_effect
      };
    }
  };

  // Spellbook will hold all defined weapons
  $$gauntlet.Spellbook = (() => {
    let spell_list = [];
    let _internal = Object.create(null);

    // Method to return the entire collection of spells
    _internal.spells = () => {
      return spell_list;
    };

    // Method to load the spells from the JSON file
    _internal.load = () => {
      return new Promise((resolve, reject) => {
        $.ajax({url: "./data/spells.json"}).done(response => {

          // Iterate all weapon objects in the JSON file
          response.spells.each(currentSpell =>
            spell_list.push(__.compose(MasterSpell, currentSpell))
          );

          // Resolve the weapon loading promise with the weapon list
          resolve(spell_list);

        }).fail((xhr, error, msg) => {
          reject(msg);
        });
      });
    };

    return _internal;
  })();

  return $$gauntlet;

}(Gauntlet || {});
