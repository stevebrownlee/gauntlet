"use strict";

/*
  Use promises to load, in the correct order, the JSON files
  needed to establish all the prototype chains.
 */
(async () => {
  await Gauntlet.Armory.load();
  await Gauntlet.Spellbook.load();
  await Gauntlet.Horde.load();
  await Gauntlet.GuildHall.load();
})().then(() => {

  /*
    Test code to generate a human player and a random enemy
   */
  console.group("Sample Combatants");
  console.log("Creating a new Human instance");
  let warrior = Gauntlet.Army.Human.init("Joe").equip();
  console.log(warrior.toString());
  console.log(" ");
  console.log("Creating a new Enemy instance");
  let enemy = Gauntlet.Horde.random();
  enemy.equip();
  console.log(enemy.toString());
  console.groupEnd("Sample Combatants");


  // Populate the professions view
  let cellTracker = 1;

  let professionHTML = '<div class="row">';
  for (let c of Gauntlet.GuildHall.classes().values()) {
    if (c.playable) {
      professionHTML += '<div class="col-sm-4">';
      professionHTML += '  <div class="card__button">';
      professionHTML += '    <a class="class__link btn btn--big btn--blue" href="#">';
      professionHTML += '      <span class="btn__prompt">&gt;</span>';
      professionHTML += `      <span class="btn__text">${c.label}</span>`;
      professionHTML += '    </a>';
      professionHTML += '  </div>';
      professionHTML += '</div>';

      if (cellTracker % 3 === 0) {
        professionHTML += '</div>';
        professionHTML += '<div class="row">';
      }
      cellTracker++;
    }
  }
  professionHTML += '</div>';
  $(".professions__container").append(professionHTML);


  /*
    To have a sample battle run in the console, without needing
    to select anything in the DOM application, just add console=true
    to the URL.

    Example:
      http://localhost:8080/?console=true

   */
  if (__.getURLParameter("console") === "true") {
    let battleground = Gauntlet.Battleground.init(warrior, enemy, true);
    let battleTimer = window.setInterval(() => {
      if (!battleground.melee()) {
        window.clearInterval(battleTimer);
      }
    }, 2000);
  }
}).catch(console.error);

$(document).ready(function() {

  /*
    Show the initial view that accepts player name
   */
  let HumanCombatant = null;
  let EnemyCombatant = null;
  let chosenProfession = null;
  let chosenWeapon = null;
  let battleground = null;
  let continueBattle = true;
  let battleTimer;

  // Show player name view initially
  $("#player-setup").show();


  // When user enters name, show the profession view
  $("#player-name").on("keydown", function (e) {
    if ($(this).val() && e.keyCode == 13) {
      HumanCombatant = Gauntlet.Army.Human.init($("#player-name").val());
      $(".card").hide();
      $(".card--class").show();
    }
  });


  // When user selects a profession, show the weapon view
  $(document).on("click", ".class__link", function(e) {
    chosenProfession = Gauntlet.GuildHall.classes().get($(this).children(".btn__text").html());
    $(".card").hide();

    if (chosenProfession.magical) {
      HumanCombatant.equip(chosenProfession);
      $(".card--battleground").show();
      startCombat();
    } else {
      let weaponEl = $("#weapon-select").children(".card__prompt");
      $(".weapons").remove();

      let block = ['<div class="row weapons">',
                   '<div class="col-sm-6">'];

      chosenProfession.allowedWeapons.each((weapon, index) => {
        let weaponName = Gauntlet.Armory
                                 .weapons()
                                 .find(w => w.id === weapon)
                                 .toString();

        // Close individual rows and start new ones
        if (index === 3) {
          block.push('</div>', '<div class="col-sm-6">');
        }

        // Add weapon block to DOM
        block.push('<div class="card__button">',
                   '<a class="weapon__link btn btn--big btn--blue" href="#">',
                   '<span class="btn__prompt">&gt;</span>',
                   `<span class="btn__text weapon__name" weapon='${weapon}'>${weaponName}</span>`,
                   '</a></div>');
      });
      block.push("</div></div>");
      weaponEl.append(block.join(""));
      $(".card--weapon").show();
    }

  });


  /*
    Handle user choosing a weapon for the human combatant
   */
  $(document).on("click", ".weapon__link", function(e) {
    let weapon = $(this).find(".btn__text").attr("weapon");
    chosenWeapon = Gauntlet.Armory
                             .weapons()
                             .find(w => w.id === weapon);
    HumanCombatant.equip(chosenProfession, chosenWeapon);

    $(".card").hide();
    $(".card--battleground").show();

    startCombat();
  });


  // Define the logic that will display the results after each round of combat
  function meleeRound() {
    if (!battleground.melee()) {
      window.clearInterval(battleTimer);

      if (HumanCombatant.health > 0) {
        $("#battle-record").after("<button class=\"btn btn--big btn--yellow btn--another\">Fight another</button>");
      } else {
        $("#battle-record").after("<button class=\"btn btn--big btn--yellow btn--again\">Play Again</button>");
      }
    }

    $(".battle--human").html(HumanCombatant.toString());
    $(".battle--enemy").html(EnemyCombatant.toString());

    $("#battle-record").scrollTop(9999999);
  }

  // Begin the battle
  function startCombat() {
    EnemyCombatant = Gauntlet.Horde.random();
    // EnemyCombatant = Gauntlet.Horde.soldier("Dragon");
    EnemyCombatant.equip();

    $(".battle--human").html(HumanCombatant.toString());
    $(".battle--enemy").html(EnemyCombatant.toString());

    battleground = Gauntlet.Battleground.init(HumanCombatant, EnemyCombatant);
    battleTimer = window.setInterval(meleeRound, 2000);
  }

  /*
    When the "Fight Another" button is clicked just start
    the battle all over again with the player's existing
    health, and a new opponent.
   */
  $(document).on("click", ".btn--another", function() {
    $(".btn--another").remove();
    startCombat();
  });

  /*
    When the "Fight Again" button is clicked just start
    the battle all over again with the player's existing
    health, and a new opponent.
   */
  $(document).on("click", ".btn--again", function() {
    $(".btn--again").remove();
    $(".card").hide();
    $("#player-setup").show();
    $("#battle-record").empty();
    $("#player-name").focus();
  });


  /*
    When the back button clicked, move back a view
   */
  $(".card__back").click(function(e) {
    let previousCard = $(this).attr("previous");
    $(".card").hide();
    $(`.${previousCard}`).show();
  });

});
