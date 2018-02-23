"use strict"

Gauntlet = function (global) {
  const _internal = gutil.privy.init() // Private store

  // Spellbook will hold all defined spells
  let GuildHall = Object.create(gutil.ObjectExtensions)

  // Initialization sets up the private spell list array and name set
  GuildHall.def("init", function () {
    _internal(this).all_professions = new Map()
    _internal(this).guildHall = Object.create(null)
    return this
  })

  // Make classes property behave as a simple k/v lookup
  GuildHall.attr("classes",
    function () {
      return _internal(this).all_professions
    },
    () => null
  )

  GuildHall.def("load", function () {
    return fetch("./data/classes.json")
      .then(response => response.json())
      .then(json => {

        // Iterate over all the class objects in the JSON file
        json.classes.each(current_class => {

          // Define the prototype for the new profession
          let prototype_for_object = current_class.prototype === null
              ? null
              : internal(this).all_professions.get(current_class.prototype)

          // Create the new profession
          let profession = gutil.compose(prototype_for_object,
                                        current_class,
                                        gutil.ObjectExtensions)

          // Add a toString() method to each class which displays the label
          profession.def("toString", () => current_class.label)

          // Add new profession to the Map
          _internal(this).all_professions.set(current_class.id, profession)
        })
      })
  })

  global.GuildHall = GuildHall.init()
  return global

}(Gauntlet || {})
