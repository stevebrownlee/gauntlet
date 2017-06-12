"use strict";

var Gauntlet = function (global) {
  const _internal = gutil.privy.init(); // Private store
  
  // Create prototypal master spell. Add object extensions.
  let MasterSpell = Object.create(gutil.ObjectExtensions);

  // String representation of master spell
  MasterSpell.def("toString", function () {
    return `${ this.label } of ${ this.elements.random() }`;
  });

  /*
    Reading the spell modifies the damage based on 
    the mage's intelligence
  */
  MasterSpell.def("read", function (modifier) {
    this.intelligence_modifier = modifier;
    return this;
  });

  /*
    Casting the spell calculates total effect.
  */
  MasterSpell.def("cast", function () {
    this.effect = Math.round(Math.random() * this.base_effect + this.effect_modifier);
    return this;
  });

  /*
    The `at` method applies the effect on the appropriate player
  */
  MasterSpell.def("at", function (target) {
    this.target = target;
    // TODO: Add critical chance
    let total_effect = Math.round(this.effect + (this.intelligence_modifier || 0));
    total_effect *= (this.augment) ? 1 : -1;

    switch (this.affected_trait) {
      case "health":
        target.setHealth(target.getHealth() - total_effect);
        break;

      case "strength":
        target.setStrength(target.getStrength() - total_effect);
        break;

      case "intellgence":
        target.setIntelligence(target.getIntelligence() - total_effect);
        break;

      case "protection":
        target.setProtection(target.getProtection() - total_effect);
        break;
    
      default:
        break;
    }

    if (this.affected_trait === "protection") {
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
  });

  MasterSpell.property("name", "").property("base_damage", 0);
  MasterSpell.property("effect", 0).property("target", null);
  MasterSpell.property("elements", ["lightning", "fire", "water", "earth", "mysticism"]);

  // Spellbook will hold all defined spells
  let Spellbook = gutil.compose(Object.create(null), gutil.ObjectExtensions);

  // Initialization sets up the private spell list array and name set
  Spellbook.def("init", function () {
    _internal(this).spell_list = [];
    return this;
  });

  // Accessor for the spell list
  Spellbook.def("spells", function () {
    return _internal(this).spell_list;
  });

  // Loads spell properties from JSON file
  Spellbook.def("load", function () {
    return new Promise((resolve, reject) => {
      $.ajax({url: "./data/spells.json"}).done(response => {

        // Iterate all spell objects in the JSON file
        response.spells.each(currentSpell =>
          _internal(this).spell_list.push(gutil.compose(MasterSpell, currentSpell))
        );

        // Resolve the spell loading promise with the spell list
        resolve(_internal(this).spell_list);

      }).fail((xhr, error, msg) => {
        reject(msg);
      });
    });
  });

  global.Spellbook = Spellbook.init();
  return global;

}(Gauntlet || {});
