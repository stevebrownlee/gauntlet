"use strict";

const Battleground = function (human_combatant, enemy_combatant, console_output = false) {
  this.human = human_combatant;
  this.enemy = enemy_combatant;
  this.console_output = console_output;
};

Battleground.prototype.melee = function () {
  // Perform attack and return the string outcome
  const attack = (combatant, target) => {
    let result, modifier;

    if (combatant.profession.magical) {
      const spell = Gauntlet.Spellbook.spells().random();
      modifier = Math.floor(combatant.intelligence / 15);
      result = spell.read(modifier).cast().at((spell.defensive) ? combatant : target);
      result = `\n${combatant.name} cast ${result.spell} of ${result.element}\non ${(spell.defensive) ? combatant.name : target.name} for ${result.damage} ${result.effect}\n\n`;
    } else {
      modifier = Math.floor(combatant.strength / 3);
      result = combatant.weapon.swing(modifier).at(target);
      result = `\n${combatant.name} attacked ${target.name} for ${result.damage}\n\n`;
    }

    return result;
  }

  /*
    Perform player action
   */
  const player_outcome = attack(this.human, this.enemy);

  if (this.console_output) {
    console.clear();
    console.log(`(${this.human.health} hp) ${this.human.name} the ${this.human.profession.label} (${this.human.strength} str) (${this.human.intelligence} int) (${this.human.protection} armor) wielding a ${(this.human.weapon) ? this.human.weapon : "Spellbook"}`);
    console.log(`(${this.enemy.health} hp) ${this.enemy.name} the ${this.enemy.id} ${this.enemy.profession.label} (${this.enemy.strength} str) (${this.enemy.intelligence} int) (${this.enemy.protection} armor) wielding a ${(this.enemy.weapon) ? this.enemy.weapon : "Spellbook"}`);
    console.log(`${player_outcome}`);

    if (this.enemy.health <= 0) {
      console.log(`${this.human.name} won!!`);
      return false;
    }
  } else {
    $("#battle-record").append(`<div class="battle-record__human">${player_outcome}</div>`);
    if (this.enemy.health <= 0) {
      $("#battle-record").append("<div class=\"battle-over\">The battle is over. You won!</div>");
      return false;
    }
  }

  /*
    Perform enemy action
   */
  const enemy_outcome = attack(this.enemy, this.human);

  if (this.console_output) {
    console.log(`${enemy_outcome}`);
    if (this.human.health <= 0) {
      console.log(`${this.enemy.name} won!!`);
      return false;
    }
  } else {
    $("#battle-record").append(`<div class="battle-record__enemy">${enemy_outcome}</div>`);
    if (this.human.health <= 0) {
      $("#battle-record").append("<div class=\"battle-over\">The battle is over. The " + this.enemy.name + " won!</div>");
      return false;
    }
  }

  return true;
};
