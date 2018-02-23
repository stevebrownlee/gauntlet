"use strict";

let gutil = Object.create(null)

/*
  This object allows any object to define its own properties and methods.
  Chainable.

  Usage:
    let foo = gutil.compose(Object.create(null), ObjectExtensions)
    foo.property("propOne", 1).property("prop2", 2).def("fn", () => ({}))
 */
gutil.ObjectExtensions = (() => {
  const o = Object.create(null)

  // Used for defining a writable/enumerable property
  o.property = new Proxy(Object.defineProperty, {
    apply: function (_target, _this, _args) {
      _target(_this, _args[0], {
        value: _args[1],
        writable: true,
        enumerable: true
      })

      return _this
    }
  });

  o.attr = new Proxy(Object.defineProperty, {
    apply: function (_target, _this, _args) {
      _target(_this, _args[0], {
        get: _args[1],
        set: _args[2],
        enumerable: true
      })

      return _this
    }
  })

  // Used for defining an enumerable function
  o.def = new Proxy(Object.defineProperty, {
    apply: function (_target, _this, _args) {
      _target(_this, _args[0], {
        value: _args[1],
        enumerable: true
      })

      return _this
    }
  })

  return Object.freeze(o)
})();

// Set up prototype chain and concatenative inheritance
gutil.compose = (proto, ...args) => {
  let target = Object.assign(Object.create(proto), ...args)
  return target
}

// Get any URL parameter
gutil.getURLParameter = (name) => {
  return decodeURIComponent((new RegExp("[?|&]" + name + "=" + "([^&;]+?)(&|#|;|$)").exec(location.search) || [null, ""])[1].replace(/\+/g, "%20")) || null;
};

gutil.html = (templateObject, ...substs) => {
    const raw = templateObject.raw
    let result = ""

    substs.each((subst, i) => { // Run the substitutions
        let lit = raw[i]
        if (Array.isArray(subst)) subst = subst.join("");

        if (lit.endsWith("!")) {
            subst = (subst) => subst.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/`/g, "&#96;")
            lit = lit.slice(0, -1)
        }
        result += lit
        result += subst
    })
    return result += raw[raw.length-1] // Add last template string
}

/*
  The privy allows modules to have weakly-held private data contained
  in a new WeakMap. It returns a function to access that WeakMap.
*/
gutil.privy = Object.create(null)
gutil.privy.init = () => {
  const _private = new WeakMap()

  return function (object) {
    if (!_private.has(object))
        _private.set(object, Object.create(null))
    return _private.get(object)
  };
};

Object.freeze(gutil);


// CAUTION: Extend native prototypes only if you understand the consequences
(() => {

  // Add a `listen()` method on any EventTarget. Proxies to `addEventListener`.
  if (!("listen" in EventTarget.prototype)) {
    Object.defineProperty(EventTarget.prototype, "listen", {
      value: new Proxy(EventTarget.prototype.addEventListener, {
        apply: function (_target, _this, _args) {
          return _target.apply(_this, _args)
        }
      })
    })
  }

  // Add an `each()` method to Array that is a Proxy to `forEach()`
  if (!("each" in Array.prototype)) {
    Object.defineProperty(Array.prototype, "each", {
      value: new Proxy(Array.prototype.forEach, {
        apply: function (_target, _this, _args) {
          return _target.apply(_this, _args)
        }
      })
    })
  }

  // Add an `each()` method to Map that is a Proxy to `forEach()`
  if (!("each" in Map.prototype)) {
    Object.defineProperty(Map.prototype, "each", {
      value: new Proxy(Map.prototype.forEach, {
        apply: function (_target, _this, _args) {
          return _target.apply(_this, _args)
        }
      })
    })
  }

  // Add a `random()` method to Array
  if (!("random" in Array.prototype)) {
    Object.defineProperty(Array.prototype, "random", {
      value: function () {
        return this[Math.floor(Math.random() * this.length)]
      },
      enumerable: true
    })
  }

  // Add a `random()` method to Map
  if (!("random" in Map.prototype)) {
    Object.defineProperty(Map.prototype, "random", {
      value: function () {
        return [...this.values()].random()
      },
      enumerable: true
    })
  }

  // Add a `random()` method to Set
  if (!("random" in Set.prototype)) {
    Object.defineProperty(Set.prototype, "random", {
      value: function () {
        return [...this.values()].random()
      },
      enumerable: true
    })
  }
})();
