let Gauntlet = Object.create(gutil.ObjectExtensions, {
  help: {
    enumerable: true,
    value: (topic) => {
      if (!topic) {
        console.log("help('weapons' || 'w') -- Show all available weapons.")
        console.log("help('monsters' || 'm') -- Show all available monsters.")
        console.log("help('spells' || 's') -- Show all available spells.")
      } else {
        let output = ""

        switch(topic) {
          case "weapons":
          case "w":
            console.clear()
            output += "Weapon              Base Dmg     Poison\n   Ranged\n====================================================\n"
            Gauntlet.Armory.weapons.each(w => output += `${(w.label + " ".repeat(20)).slice(0, 20)}${(w.base_damage + " ".repeat(13)).slice(0,13)}${(w.poisoned + " ".repeat(6)).slice(0,10)}${w.ranged}\n`)
            break


          case "spells":
          case "s":
            console.clear()
            output += "Spell              Range        Effect         Defensive\n=========================================================\n"
            Gauntlet.Spellbook.spells.each(w => output += `${(w.id + " ".repeat(20)).slice(0, 19)}${((w.base_effect + " - " + (w.base_effect + w.effect_modifier)) + " ".repeat(13)).slice(0,13)}${(w.affected_trait + " ".repeat(15)).slice(0,15)}${w.defensive}\n`)
            break


          case "monsters":
          case "m":
            console.clear()
            output += "Species        Mods: Health   Strength   Intelligence\n=====================================================\n"
            Gauntlet.Horde.all().each(w => output += `${(w.species + " ".repeat(22)).slice(0, 21)}${(w.healthModifier + " ".repeat(10)).slice(0, 9)}${(w.strengthModifier + " ".repeat(12)).slice(0, 11)}${(w.intelligenceModifier + " ".repeat(12)).slice(0, 11)}\n`)
            break
        }
        console.log(output)
      }
    }
  }
})
