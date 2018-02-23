"use strict"

Gauntlet = function (global) {

  global.Battleground = Object.create(null)

  global.Battleground.init = function (human_combatant, enemy_combatant, console_output = false) {
    this.human = human_combatant
    this.human.startingHealth = this.human.health

    this.enemy = enemy_combatant
    this.enemy.startingHealth = this.enemy.health

    this.console_output = console_output

    return this
  }

  global.Battleground.melee = function () {
    if (this.console_output) {
      console.clear()
    }

    // Perform attack and return the string outcome
    const attack = (combatant, target) => {
      let attack, result, modifier

      if (combatant.profession.magical) {
        // Select a spell
        const spell = Gauntlet.Spellbook.spells.random()

        // Modify its effectiveness based on caster's intelligence
        modifier = Math.floor(combatant.intelligence / 40)

        // Calculate the damage/effect
        attack = spell.read(modifier).cast().at((spell.defensive) ? combatant : target)

        // Build attack result message
        result = `\n${combatant.name} cast ${attack.spell} of ${attack.element} `
        result += `on ${(spell.defensive) ? combatant.name : target.name} `
        result += `for ${attack.damage} ${attack.effect}\n\n`
      } else {
        // Modify attack effectiveness based on caster's strength
        modifier = Math.floor(combatant.strength / 20)

        // Calculate the damage
        attack = combatant.weapon.swing(modifier).at(target)

        // Build attack result message
        result = `\n${combatant.name} hit ${target.name} `
        result += `in the ${target.limbs.random()} `
        result += `with the ${combatant.weapon.toString().toLowerCase()} `
        result += `for ${attack.damage} damage.\n\n`
      }

      return result
    }

    const generateHealthBar = (target) => {
      let percentage = Math.floor(target.health / target.startingHealth * 20)

      if (percentage < 0) percentage = 0
      if (percentage > 20) percentage = 20
      let healthBar = `%c[${"*".repeat(percentage)}${" ".repeat(20 - percentage)}]`

      let barColor = null
      switch (true)
      {
        case (percentage < 5):
          barColor = "tomato"
          break
        case (percentage < 10):
          barColor = "yellow"
          break
        default:
          barColor = "slategrey"
      }
      console.log(healthBar, `color:${barColor}; background-color:gainsboro`)
    }

    if (this.console_output) {
      console.log(`${this.human.name} the ${this.human.profession.label} (${this.human.strength} str) (${this.human.intelligence} int) (${this.human.protection} armor) wielding a ${(this.human.weapon) ? this.human.weapon : "Spellbook"}`)
      generateHealthBar(this.human)

      console.log(`${this.enemy.name} the ${this.enemy.id} ${this.enemy.profession.label} (${this.enemy.strength} str) (${this.enemy.intelligence} int) (${this.enemy.protection} armor) wielding a ${(this.enemy.weapon) ? this.enemy.weapon : "Spellbook"}`)
      generateHealthBar(this.enemy)
    }

    /* Perform player action */
    if (this.console_output) console.group("Player attack")
    const player_outcome = attack(this.human, this.enemy)

    if (this.console_output) {
      console.log(`${player_outcome}`)

      if (this.enemy.health <= 0) {
        console.log(`${this.human.name} won!!`)
        return false
      }
    } else {
      $("#battle-record").append(`<div class="battle-record__human">${player_outcome}</div>`)
      if (this.enemy.health <= 0) {
        $("#battle-record").append("<div class=\"battle-over\">The battle is over. You won!</div>")
        return false
      }
    }
    if (this.console_output) console.groupEnd("Player attack")

    /* Perform enemy action */
    if (this.console_output) console.group("Enemy attack")
    const enemy_outcome = attack(this.enemy, this.human)

    if (this.console_output) {
      console.log(`${enemy_outcome}`)
      if (this.human.health <= 0) {
        console.log(`${this.enemy.name} won!!`)
        return false
      }
    } else {
      $("#battle-record").append(`<div class="battle-record__enemy">${enemy_outcome}</div>`)
      if (this.human.health <= 0) {
        $("#battle-record").append("<div class=\"battle-over\">The battle is over. The " + this.enemy.name + " won!</div>")
        return false
      }
    }
    if (this.console_output) console.groupEnd("Enemy attack")

    return true
  }

  return global

}(Gauntlet || {})
