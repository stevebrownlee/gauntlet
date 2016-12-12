"use strict";

var Gauntlet = function ($$gauntlet) {

  $$gauntlet.GuildHall = function () {
    let all_professions = new Map();
    let guildHall = Object.create(null);

    guildHall.classes = () => {
      return all_professions;
    };

    guildHall.load = () => {
      return new Promise((resolve, reject) => {
        $.ajax({url: "./data/classes.json"}).done(response => {

          // Iterate over all the class objects in the JSON file
          response.classes.each(current_class => {

            // Define the prototype for the new profession
            let prototype_for_object = current_class.prototype === null
                                        ? {}
                                        : all_professions.get(current_class.prototype);

            // Create the new profession
            let profession = __.compose(prototype_for_object,
                                        current_class,
                                        ObjectExtensions);

            // Add a toString() method to each class which displays the label
            profession.def("toString", () => current_class.label);

            // Add new profession to the Map
            all_professions.set(current_class.id, profession);
          });

          // Resolve the promise
          resolve();

        }).fail((xhr, error, msg) => {
          console.error(msg);
          reject();
        });
      });
    };

    return guildHall;
  }();

  return $$gauntlet;

}(Gauntlet || {});

