"use strict";

/*
  Use promises to load, in the correct order, the JSON files
  needed to establish all the prototype chains.
 */
(async () => {
    await Gauntlet.Armory.load()
    await Gauntlet.Spellbook.load()
    await Gauntlet.Horde.load()
    await Gauntlet.GuildHall.load()
})().then(() => {
    let warrior = Gauntlet.Player.init("Joe").equip()
    let enemy = Gauntlet.Horde.random()
    enemy.equip()

    console.group("Sample Combatants")
    console.log("Creating a new Human instance")
    console.log(warrior.toString())
    console.log(" ")
    console.log("Creating a new Enemy instance")
    console.log(enemy.toString())
    console.groupEnd("Sample Combatants")

    /*
      To have a sample battle run in the console, without needing
      to select anything in the DOM application, just add console=true
      to the URL.

      Example:
        http://localhost:8080/?console=true

    */
    if (gutil.getURLParameter("console") === "true") {
        let battleground = Gauntlet.Battleground.init(warrior, enemy, true)
        let battleTimer = window.setInterval(() => {
            if (!battleground.melee()) {
                window.clearInterval(battleTimer)
            }
        }, 2000)
    }
}).catch(console.error)

$(document).ready(function () {
    const isConsoleGame = gutil.getURLParameter("console") === "true";

    // Await the loading of the professions from the Guild Hall module
    (async () => {
        await Gauntlet.GuildHall.load()
    })().then(() => {
        // Populate the professions view
        let cellTracker = 1

        if (!isConsoleGame) {
            let rower = 0
            const classTemplate = classes => gutil.html`
                <div class="row">
                    ${[...classes].map(cls => {
                    if (cls.playable) {
                        if (!(++rower % 4)) return '</div><div class="row">'
                        return gutil.html`
                                <div class="col-sm-4">
                                    <div class="card__button">
                                        <a class="class__link btn btn--big btn--blue" href="#">
                                            <span class="btn__prompt">&gt</span>
                                            <span class="btn__text">${cls.label}</span>
                                        </a>
                                    </div>
                                </div>
                            `
                    }
                })}
                </div>
            `

            const result = classTemplate(Gauntlet.GuildHall.classes.values())
            $(".professions__container").append(result)
        }
    })

    /*
        Show the initial view that accepts player name
    */
    let HumanCombatant = null
    let EnemyCombatant = null
    let chosenProfession = null
    let chosenWeapon = null
    let battleground = null
    let continueBattle = true
    let battleTimer

    // Show player name view initially
    if (!isConsoleGame) $("#player-setup").show()

    // When user enters name, show the profession view
    document.querySelector("#player-name").listen(
        "keydown", function (e) {
            if (this.value && e.keyCode == 13) {
                HumanCombatant = Gauntlet.Player.init(this.value)
                $(".card").hide()
                $(".card--class").show()
            }
        }
    )

    // When user selects a profession, show the weapon view
    $(document).on("click", ".class__link", function (e) {
        chosenProfession = Gauntlet.GuildHall.classes.get($(this).children(".btn__text").html())
        $(".card").hide()

        if (chosenProfession.magical) {
            HumanCombatant.equip(chosenProfession)
            $(".card--battleground").show()
            startCombat()
        } else {
            let weaponEl = $("#weapon-select").children(".card__prompt")
            $(".weapons").remove()

            const wpnTemplate = weapons => gutil.html`
                <div class="row weapons">
                    ${[...weapons].map((weapon, i) => {
                    let wpn = Gauntlet.Armory.weapons.find(w => w.id === weapon).toString()
                    if (!(i % 3)) return '</div><div class="row weapons">'
                    return gutil.html`
                            <div class="col-sm-6">
                                <div class="card__button">
                                    <a class="weapon__link btn btn--big btn--blue" href="#">
                                        <span class="btn__prompt">&gt</span>
                                        <span class="btn__text weapon__name" weapon=${weapon}>${wpn}</span>
                                    </a>
                                </div>
                            </div>
                        `
                })}
                </div>
            `

            const result = wpnTemplate(chosenProfession.allowedWeapons)
            weaponEl.append(result)
            $(".card--weapon").show()
        }
    })

    /*
        Handle user choosing a weapon for the human combatant
    */
    $(document).on("click", ".weapon__link", function (e) {
        let weapon = $(this).find(".btn__text").attr("weapon")
        chosenWeapon = Gauntlet.Armory.weapons.find(w => w.id === weapon)
        HumanCombatant.equip(chosenProfession, chosenWeapon)

        $(".card").hide()
        $(".card--battleground").show()

        startCombat()
    })

    // Define the logic that will display the results after each round of combat
    function meleeRound() {
        if (!battleground.melee()) {
            window.clearInterval(battleTimer)

            if (HumanCombatant.health > 0) {
                $("#battle-record").after("<button class=\"btn btn--big btn--yellow btn--another\">Fight another</button>");
            } else {
                $("#battle-record").after("<button class=\"btn btn--big btn--yellow btn--again\">Play Again</button>");
            }
        }

        $(".battle--human").html(HumanCombatant.toString())
        $(".battle--enemy").html(EnemyCombatant.toString())

        $("#battle-record").scrollTop(9999999)
    }

    // Begin the battle
    function startCombat() {
        EnemyCombatant = Gauntlet.Horde.random()
        EnemyCombatant.equip()

        $(".battle--human").html(HumanCombatant.toString())
        $(".battle--enemy").html(EnemyCombatant.toString())

        battleground = Gauntlet.Battleground.init(HumanCombatant, EnemyCombatant)
        battleTimer = window.setInterval(meleeRound, 2000)
    }

    /*
        When the "Fight Another" button is clicked just start
        the battle all over again with the player's existing
        health, and a new opponent.
    */
    $(document).on("click", ".btn--another", function () {
        $(".btn--another").remove()
        startCombat()
    })

    /*
      When the "Fight Again" button is clicked just start
      the battle all over again with the player's existing
      health, and a new opponent.
     */
    $(document).on("click", ".btn--again", function () {
        $(".btn--again").remove()
        $(".card").hide()
        $("#player-setup").show()
        $("#battle-record").empty()
        $("#player-name").focus()
    })

    /*
      When the back button clicked, move back a view
     */
    $(".card__back").click(function (e) {
        let previousCard = $(this).attr("previous")
        $(".card").hide()
        $(`.${previousCard}`).show()
    })
})
