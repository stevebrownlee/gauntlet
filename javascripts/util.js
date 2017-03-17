"use strict";

/*
  This object allows any object to define its own properties and methods.
  Chainable.

  Usage:
    let foo = __.compose(Object.create(null), ObjectExtensions);
    foo.property("propOne", 1).property("prop2", 2).def("fn", () => ({}));
 */
const ObjectExtensions = (() => {
  let o = {};

  // Used for defining a writable/enumerable property
  o.property = new Proxy(Object.defineProperty, {
    apply: function (_target, _this, _args) {
      _target(_this, _args[0], {
        value: _args[1],
        writable: true,
        enumerable: true
      });

      return _this;
    }
  });

  // Used for defining an enumerable function
  o.def = new Proxy(Object.defineProperty, {
    apply: function (_target, _this, _args) {
      _target(_this, _args[0], {
        value: _args[1],
        enumerable: true
      });

      return _this;
    }
  });

  return Object.freeze(o);
})();



// Create object to which utility functions are added for use in the project
const __ = (() => {

  return Object.freeze({
    compose (proto, ...args) {
      let target = Object.create(proto)
      args.each(arg => target = Object.assign(target, arg));
      return target;
    },

    getURLParameter (name) {
      return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
    }
  });

})();



// CAUTION: Extend native prototypes only if you understand the consequences
(() => {

  // Add a `listen()` method on any EventTarget. Proxies to `addEventListener`.
  if (!("listen" in EventTarget.prototype)) {
    Object.defineProperty(EventTarget.prototype, "listen", {
      value: new Proxy(EventTarget.prototype.addEventListener, {
        apply: function (_target, _this, _args) {
          return _target.apply(_this, _args);
        }
      })
    });
  }

  // Add an `each()` method to Array that is a Proxy to `forEach()`
  if (!("each" in Array.prototype)) {
    Object.defineProperty(Array.prototype, "each", {
      value: new Proxy(Array.prototype.forEach, {
        apply: function (_target, _this, _args) {
          return _target.apply(_this, _args);
        }
      })
    });
  }

  // Add an `each()` method to Map that is a Proxy to `forEach()`
  if (!("each" in Map.prototype)) {
    Object.defineProperty(Map.prototype, "each", {
      value: new Proxy(Map.prototype.forEach, {
        apply: function (_target, _this, _args) {
          return _target.apply(_this, _args);
        }
      })
    });
  }

  // Add a `random()` method to Array
  if (!("random" in Array.prototype)) {
    Object.defineProperty(Array.prototype, "random", {
      value: function () {
        return this[Math.floor(Math.random() * this.length)];
      },
      enumerable: true
    });
  }

  // Add a `random()` method to Map
  if (!("random" in Map.prototype)) {
    Object.defineProperty(Map.prototype, "random", {
      value: function () {
        return [...this.values()].random();
      },
      enumerable: true
    });
  }

  // Add a `random()` method to Set
  if (!("random" in Set.prototype)) {
    Object.defineProperty(Set.prototype, "random", {
      value: function () {
        return [...this.values()].random();
      },
      enumerable: true
    });
  }
})();
