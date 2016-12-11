"use strict";

var Gauntlet = function ($$gauntlet) {

  $$gauntlet.Horde = function () {
    let horde = new Map();
    let names = new Set();

    return {
      all () {
        return horde;
      },
      soldier (type) {
        let soldier = Object.create(horde.get(type));
        return soldier;
      },
      random () {
        let randomSoldier = null;

        /*
          The Monster object needs to remain in the horde Map to
          maintain the prototype chain, but it can't be the basis
          for an actual soldier instance.
         */
        do {
          randomSoldier = horde.random();
        } while (randomSoldier.id === "Monster");

        // Give the soldier a random name
        randomSoldier.name = names.random();

        return randomSoldier;
      },
      load () {
        return new Promise((resolve, reject) => {
          $.ajax({url: "./data/horde.json"}).done(response => {

            /*
              Load the names array in the JSON file into a Set
             */
            response.names.each(name => {
              names.add(name);
            });

            /*
              Iterate over the objects in the class key and start
              setting up the prototype chain, which is simplistic
              since all specific enemies inherit from Monster at
              this point.
             */
            response.classes.each(monster => {
              let object_prototype;

              // The base monster will always have Player as its prototype
              if (monster.prototype === null) {
                object_prototype = $$gauntlet.Army.Player;
              } else  {
                object_prototype = horde.get(monster.prototype);
              };

              /*
                Create a new object for the current monster based on the
                corresponding prototype
               */
              let monster_for_map = __.compose(object_prototype, monster, {
                species: monster["id"]
              });

              // Add creature to the horde Map
              horde.set(monster.id, monster_for_map);
            });

            // Resolve the promise
            resolve();

          }).fail((xhr, error, msg) => {
            console.error(msg);
            reject();
          });
        });
      }
    }
  }();

  return $$gauntlet;

}(Gauntlet || {});
