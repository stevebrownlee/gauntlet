"use strict";

var Gauntlet = function (global) {
  const _internal = gutil.privy.init(); // Private store

  // Spellbook will hold all defined spells
  let GuildHall = Object.create(gutil.ObjectExtensions);

  // Initialization sets up the private spell list array and name set
  GuildHall.def("init", function () {
    _internal(this).all_professions = new Map();
    _internal(this).guildHall = Object.create(null);
    return this;
  });

  // Accessor for profession list
  Object.defineProperty(GuildHall, "classes", {
    get: function () {
      return _internal(this).all_professions;
    }
  })

  GuildHall.def("load", function () {
    return new Promise((resolve, reject) => {
      $.ajax({url: "./data/classes.json"}).done(response => {

        // Iterate over all the class objects in the JSON file
        response.classes.each(current_class => {

          // Define the prototype for the new profession
          let prototype_for_object = current_class.prototype === null
              ? {}
              : _internal(this).all_professions.get(current_class.prototype);

          // Create the new profession
          let profession = gutil.compose(prototype_for_object,
                                      current_class,
                                      gutil.ObjectExtensions);

          // Add a toString() method to each class which displays the label
          profession.def("toString", () => current_class.label);

          // Add new profession to the Map
          _internal(this).all_professions.set(current_class.id, profession);
        });

        // Resolve the promise
        resolve();

      }).fail((xhr, error, msg) => {
        console.error(msg);
        reject();
      });
    });
  });

  global.GuildHall = GuildHall.init();
  return global;

}(Gauntlet || {});

