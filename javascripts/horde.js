"use strict";

var Gauntlet = function (global) {

  let _private = new WeakMap();

  const _internal = function (object) {
    if (!_private.has(object))
        _private.set(object, Object.create(null));
    return _private.get(object);
  };
  
  let Horde = __.compose(Object.create(null), ObjectExtensions);

  Horde.def("init", function () {
    _internal(this).horde = new Map();
    _internal(this).names = new Set();
    return this;
  });

  Horde.def("all", function () {
    return _internal(this).horde;
  });

  Horde.def("soldier", function () {
    let soldier = Object.create(_internal(this).horde.get(type));
    return soldier;
  });

  Horde.def("random", function () {
    let randomSoldier = null;

    /*
      The Monster object needs to remain in the horde Map to
      maintain the prototype chain, but it can't be the basis
      for an actual soldier instance.
      */
    do {
      randomSoldier = _internal(this).horde.random();
    } while (randomSoldier.id === "Monster");

    // Give the soldier a random name
    randomSoldier.name = _internal(this).names.random();

    return randomSoldier;
  });

  Horde.def("load", function () {
    return new Promise((resolve, reject) => {
      $.ajax({url: "./data/horde.json"}).done(response => {

        /*
          Load the names array in the JSON file into a Set
          */
        response.names.each(name => {
          _internal(this).names.add(name);
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
            object_prototype = global.Army.Player;
          } else  {
            object_prototype = _internal(this).horde.get(monster.prototype);
          };

          /*
            Create a new object for the current monster based on the
            corresponding prototype
            */
          let monster_for_map = __.compose(object_prototype, monster, {
            species: monster["id"]
          });

          // Add creature to the horde Map
          _internal(this).horde.set(monster.id, monster_for_map);
        });

        // Resolve the promise
        resolve();

      }).fail((xhr, error, msg) => {
        console.error(msg);
        reject();
      });
    });
  });

  global.Horde = Horde.init();

  return global;

}(Gauntlet || {});
