"use strict";

var Gauntlet = function ($$gauntlet) {

  $$gauntlet.Battleground = Object.create(null);

  $$gauntlet.Battleground.init = function (human_combatant, enemy_combatant, console_output = false) {
    this.human = human_combatant;
    this.human.setStartingHealth(this.human.getHealth());

    this.enemy = enemy_combatant;
    this.enemy.setStartingHealth(this.enemy.getHealth());

    this.console_output = console_output;

    return this;
  };

  $$gauntlet.Battleground.melee = function () {
    // Perform attack and return the string outcome
    const attack = (combatant, target) => {
      let attack, result, modifier;

      if (combatant.getProfession().magical) {
        // Select a spell
        const spell = Gauntlet.Spellbook.spells().random();

        // Modify its effectiveness based on caster's intelligence
        modifier = Math.floor(combatant.getIntelligence() / 40);

        // Calculate the damage/effect
        attack = spell.read(modifier).cast().at((spell.defensive) ? combatant : target);

        // Build attack result message
        result = `\n${combatant.getName()} cast ${attack.spell} of ${attack.element} `;
        result += `on ${(spell.defensive) ? combatant.getName() : target.getName()} `;
        result += `for ${attack.damage} ${attack.effect}\n\n`;
      } else {
        // Modify attack effectiveness based on caster's strength
        modifier = Math.floor(combatant.getStrength() / 20);

        // Calculate the damage
        attack = combatant.getWeapon().swing(modifier).at(target);
        
        // Build attack result message
        result = `\n${combatant.getName()} hit ${target.getName()} `;
        result += `in the ${target.getLimbs().random()} `;
        result += `with the ${combatant.getWeapon().toString().toLowerCase()} `;
        result += `for ${attack.damage} damage.\n\n`;
      }

      return result;
    };

    const generateHealthBar = (target) => {
      let percentage = Math.floor(target.getHealth() / target.getStartingHealth() * 20);
      
      if (percentage < 0) percentage = 0;
      let healthBar = `%c[${'*'.repeat(percentage)}${' '.repeat(20 - percentage)}]`;

      let barColor = null;
      switch (true)
      {
        case (percentage < 5):
          barColor = "tomato";
          break;
        case (percentage < 10):
          barColor = "yellow";
          break;
        default:
          barColor = "slategrey";
      }
      console.log(healthBar, `color:${barColor}; background-color:gainsboro;`);
    }

    /* Perform player action */
    const player_outcome = attack(this.human, this.enemy);

    if (this.console_output) {
      console.clear();
      console.log(`${this.human.getName()} the ${this.human.getProfession().label} (${this.human.getStrength()} str) (${this.human.getIntelligence()} int) (${this.human.getProtection()} armor) wielding a ${(this.human.getWeapon()) ? this.human.getWeapon() : "Spellbook"}`);
      generateHealthBar(this.human);

      console.log(`${this.enemy.getName()} the ${this.enemy.id} ${this.enemy.getProfession().label} (${this.enemy.getStrength()} str) (${this.enemy.getIntelligence()} int) (${this.enemy.getProtection()} armor) wielding a ${(this.enemy.getWeapon()) ? this.enemy.getWeapon() : "Spellbook"}`);
      generateHealthBar(this.enemy);

      console.log(`${player_outcome}`);

      if (this.enemy.getHealth() <= 0) {7
        console.log(`${this.human.getName()} won!!`);
        return false;
      }
    } else {
      $("#battle-record").append(`<div class="battle-record__human">${player_outcome}</div>`);
      if (this.enemy.getHealth() <= 0) {
        $("#battle-record").append("<div class=\"battle-over\">The battle is over. You won!</div>");
        return false;
      }
    }

    /* Perform enemy action */
    const enemy_outcome = attack(this.enemy, this.human);

    if (this.console_output) {
      console.log(`${enemy_outcome}`);
      if (this.human.getHealth() <= 0) {
        console.log(`${this.enemy.getName()} won!!`);
        return false;
      }
    } else {
      $("#battle-record").append(`<div class="battle-record__enemy">${enemy_outcome}</div>`);
      if (this.human.getHealth() <= 0) {
        $("#battle-record").append("<div class=\"battle-over\">The battle is over. The " + this.enemy.getName() + " won!</div>");
        return false;
      }
    }

    return true;
  };

  return $$gauntlet;

}(Gauntlet || {});
