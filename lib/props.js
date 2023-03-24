(function() {
  'use strict';
  /* see https://nodejs.org/dist/latest-v18.x/docs/api/util.html#utilinspectcustom */
  var GUY_props, H, Strict_owner, builtins, def, def_oneoff, get, hide, no_such_value, node_inspect, rpr;

  //###########################################################################################################
  GUY_props = this;

  no_such_value = Symbol('no_such_value');

  H = require('./_helpers');

  builtins = require('./_builtins');

  this._misfit = Symbol('misfit');

  this._misfit2 = Symbol('misfit2');

  ({rpr} = require('./trm'));

  node_inspect = Symbol.for('nodejs.util.inspect.custom');

  //-----------------------------------------------------------------------------------------------------------
  H.types.declare('guy_props_keys_cfg', {
    tests: {
      "@isa.object x": function(x) {
        return this.isa.object(x);
      },
      "@isa_optional.cardinal x.depth": function(x) {
        return this.isa_optional.cardinal(x.depth);
      },
      "@isa.boolean x.allow_any": function(x) {
        return this.isa.boolean(x.allow_any);
      },
      "@isa.boolean x.symbols": function(x) {
        return this.isa.boolean(x.symbols);
      },
      "@isa.boolean x.hidden": function(x) {
        return this.isa.boolean(x.hidden);
      },
      "@isa.boolean x.depth_first": function(x) {
        return this.isa.boolean(x.depth_first);
      },
      "@isa.boolean x.builtins": function(x) {
        return this.isa.boolean(x.builtins);
      },
      "@isa.boolean x.builtins implies x.hidden": function(x) {
        return (!x.builtins) || x.hidden;
      }
    }
  });

  //...........................................................................................................
  H.types.defaults.guy_props_keys_cfg = {
    allow_any: true,
    symbols: false,
    builtins: false,
    hidden: false,
    depth: null,
    depth_first: false
  };

  //-----------------------------------------------------------------------------------------------------------
  H.types.declare('guy_props_crossmerge_cfg', {
    tests: {
      "@isa.guy_props_keys_cfg x": function(x) {
        return this.isa.guy_props_keys_cfg(x);
      },
      "x.keys?": function(x) {
        return x.keys != null;
      },
      "x.values?": function(x) {
        return x.values != null;
      },
      "x.fallback can be anything": function(x) {
        return true;
      }
    }
  });

  //...........................................................................................................
  /* TAINT code duplication */
  H.types.defaults.guy_props_crossmerge_cfg = {
    allow_any: true,
    symbols: false,
    builtins: false,
    hidden: false,
    depth: null,
    depth_first: false,
    keys: null,
    values: null,
    fallback: this._misfit
  };

  //-----------------------------------------------------------------------------------------------------------
  H.types.declare('guy_props_tree_cfg', {
    tests: {
      "@isa.guy_props_keys_cfg x": function(x) {
        return this.isa.guy_props_keys_cfg(x);
      },
      "@isa_optional.function x.evaluate": function(x) {
        return this.isa_optional.function(x.evaluate);
      },
      "@isa_optional.text x.sep": function(x) {
        return this.isa_optional.text(x.sep);
      }
    }
  });

  //...........................................................................................................
  /* TAINT code duplication */
  H.types.defaults.guy_props_tree_cfg = {
    allow_any: true,
    symbols: false,
    builtins: false,
    hidden: false,
    depth: null,
    depth_first: null,
    evaluate: null,
    sep: null
  };

  //-----------------------------------------------------------------------------------------------------------
  H.types.declare('guy_props_tree_verdict', function(x) {
    if (this.isa.boolean(x)) {
      return true;
    }
    if (!this.isa.text(x)) {
      return false;
    }
    return true;
  });

  //-----------------------------------------------------------------------------------------------------------
  H.types.declare('guy_props_strict_owner', function(x) {
    return x instanceof Strict_owner;
  });

  //-----------------------------------------------------------------------------------------------------------
  H.types.declare('guy_props_strict_owner_cfg', {
    tests: {
      "@isa.object x": function(x) {
        return this.isa.object(x);
      },
      "x.target?": function(x) {
        return x.target != null;
      },
      "@isa.boolean x.locked": function(x) {
        return this.isa.boolean(x.locked);
      },
      "@isa.boolean x.seal": function(x) {
        return this.isa.boolean(x.seal);
      },
      "@isa.boolean x.freeze": function(x) {
        return this.isa.boolean(x.freeze);
      },
      "@isa.boolean x.oneshot": function(x) {
        return this.isa.boolean(x.oneshot);
      },
      "@isa_optional.boolean x.reset": function(x) {
        return this.isa_optional.boolean(x.reset);
      },
      // "reassignable object cannot be frozen": ( x ) ->
      //   return false if x.oneshot and x.freeze
      //   return true
      "x.reset is deprecated": function(x) {
        if (x.reset != null) {
          return true;
        }
        if (x.reset === true) {
          return true;
        }
        throw new Error("^guy.props.Strict_owner@1^ `cfg.reset: false` is deprecated; use `cfg.seal: true` instead");
      }
    }
  });

  //...........................................................................................................
  H.types.defaults.guy_props_strict_owner_cfg = {
    target: null,
    reset: true,
    locked: true,
    seal: false,
    freeze: false,
    oneshot: false
  };

  //-----------------------------------------------------------------------------------------------------------
  this.def = def = Object.defineProperty;

  this.hide = hide = (object, name, value) => {
    return Object.defineProperty(object, name, {
      enumerable: false,
      writable: true,
      configurable: true,
      value: value
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this.def_oneoff = def_oneoff = (object, name, cfg, method) => {
    var get;
    get = function() {
      var R, ref, ref1;
      R = method.apply(object);
      delete cfg.get;
      def(object, name, {
        configurable: (ref = cfg.configurable) != null ? ref : true,
        enumerable: (ref1 = cfg.enumerable) != null ? ref1 : true,
        value: R
      });
      return R;
    };
    def(object, name, {
      enumerable: true,
      configurable: true,
      get
    });
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this._pick_with_fallback = function(d, fallback, ...keys) {
    var R, i, key, len, value;
    R = {};
    keys = keys.flat(2e308);
    for (i = 0, len = keys.length; i < len; i++) {
      key = keys[i];
      R[key] = (value = d[key]) === void 0 ? fallback : value;
    }
    return [R, keys];
  };

  //-----------------------------------------------------------------------------------------------------------
  this.pick_with_fallback = function(d, fallback, ...keys) {
    return (this._pick_with_fallback(d, fallback, keys))[0];
  };

  //-----------------------------------------------------------------------------------------------------------
  this.pluck_with_fallback = function(d, fallback, ...keys) {
    var R, i, key, len;
    [R, keys] = this._pick_with_fallback(d, fallback, ...keys);
    for (i = 0, len = keys.length; i < len; i++) {
      key = keys[i];
      delete d[key];
    }
    return R;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.nullify_undefined = function(d) {
    var R, k, v;
    R = {};
    for (k in d) {
      v = d[k];
      R[k] = v != null ? v : null;
    }
    return R;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.omit_nullish = function(d) {
    var R, k, v;
    R = {};
    for (k in d) {
      v = d[k];
      if (v != null) {
        R[k] = v;
      }
    }
    return R;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.nonull_assign = function(first, ...others) {
    var other;
    return Object.assign({}, first, ...((function() {
      var i, len, results;
      results = [];
      for (i = 0, len = others.length; i < len; i++) {
        other = others[i];
        results.push(this.omit_nullish(other));
      }
      return results;
    }).call(this)));
  };

  //-----------------------------------------------------------------------------------------------------------
  this.crossmerge = function(cfg) {
    var R, key, ref, value;
    H.types.validate.guy_props_crossmerge_cfg((cfg = {...H.types.defaults.guy_props_crossmerge_cfg, ...cfg}));
    R = {};
    ref = this._walk_keys(cfg.keys, cfg);
    for (key of ref) {
      if ((value = this.get(cfg.values, key, this._misfit2)) !== this._misfit2) {
        R[key] = value;
        continue;
      }
      if (cfg.fallback === this._misfit) {
        throw new Error(`^guy.props.crossmerge@1^ missing key ${H.rpr(key)} in values`);
      }
      R[key] = cfg.fallback;
    }
    return R;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.resolve_property_chain = function(owner, property_chain) {
    var R, i, len, term;
    R = owner;
    for (i = 0, len = property_chain.length; i < len; i++) {
      term = property_chain[i];
      R = R[term];
    }
    return R;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.Strict_owner = (function() {
    var Strict_owner_cfg;

    class Strict_owner {
      //---------------------------------------------------------------------------------------------------------
      static _get_proxy_cfg(instance, cfg) {
        var R;
        R = {
          //.....................................................................................................
          ownKeys: function(target) {
            return Reflect.ownKeys(target);
          },
          //.....................................................................................................
          get: function(target, key) {
            var value;
            if (key === Symbol.toStringTag) {
              return `${instance.constructor.name}`;
            }
            if (key === 'constructor') {
              return target.constructor;
            }
            if (key === 'toString') {
              return target.toString;
            }
            if (key === 'call') {
              return target.call;
            }
            if (key === 'apply') {
              return target.apply;
            }
            if (key === 'then') {
              return target.then;
            }
            if (key === Symbol.iterator) {
              return target[Symbol.iterator];
            }
            if (key === node_inspect) {
              return target[node_inspect];
            }
            if (key === '0') {
              /* NOTE necessitated by behavior of `node:util.inspect()`: */
              return target[0];
            }
            if ((value = GUY_props.get(target, key, no_such_value)) === no_such_value) {
              if (!cfg.locked) {
                return void 0;
              }
              throw new Error(`^guy.props.Strict_owner@1^ ${instance.constructor.name} instance does not have property ${H.rpr(key)}`);
            }
            return value;
          },
          //.....................................................................................................
          set: function(target, key, value) {
            if (GUY_props.has(target, key)) {
              throw new Error(`^guy.props.Strict_owner@1^ ${instance.constructor.name} instance already has property ${H.rpr(key)}`);
            }
            return Reflect.set(target, key, value);
          }
        };
        //.......................................................................................................
        return R;
      }

      //---------------------------------------------------------------------------------------------------------
      static get_locked(self) {
        return self[Strict_owner_cfg].locked;
      }

      //---------------------------------------------------------------------------------------------------------
      static set_locked(self, flag) {
        H.types.validate.boolean(flag);
        self[Strict_owner_cfg].locked = flag;
        return flag;
      }

      //---------------------------------------------------------------------------------------------------------
      constructor(cfg) {
        var R, proxy_cfg;
        cfg = {
          target: this,
          ...cfg
        };
        H.types.validate.guy_props_strict_owner_cfg(cfg = {...H.types.defaults.guy_props_strict_owner_cfg, ...cfg});
        proxy_cfg = this.constructor._get_proxy_cfg(this, cfg);
        if (!cfg.oneshot) {
          delete proxy_cfg.set;
        }
        R = new Proxy(cfg.target, proxy_cfg);
        GUY_props.hide(R, Strict_owner_cfg, cfg);
        if (cfg.freeze) {
          Object.freeze(R);
        }
        if (cfg.seal) {
          Object.seal(R);
        }
        return R;
      }

      //---------------------------------------------------------------------------------------------------------
      static create(cfg) {
        var R, proxy_cfg;
        cfg = {
          target: {},
          ...cfg
        };
        H.types.validate.guy_props_strict_owner_cfg(cfg = {...H.types.defaults.guy_props_strict_owner_cfg, ...cfg});
        proxy_cfg = this._get_proxy_cfg(cfg.target, cfg);
        if (!cfg.oneshot) {
          delete proxy_cfg.set;
        }
        R = new Proxy(cfg.target, proxy_cfg);
        GUY_props.hide(R, Strict_owner_cfg, cfg);
        if (cfg.freeze) {
          /* TAINT consider to freeze, seal target instread of proxy */
          Object.freeze(R);
        }
        if (cfg.seal) {
          Object.seal(R);
        }
        return R;
      }

    };

    //---------------------------------------------------------------------------------------------------------
    Strict_owner_cfg = Symbol('Strict_owner_cfg');

    return Strict_owner;

  }).call(this);

  //-----------------------------------------------------------------------------------------------------------
  Strict_owner = this.Strict_owner;

  //===========================================================================================================
  // KEY TESTING, RETRIEVAL, CATALOGUING
  //-----------------------------------------------------------------------------------------------------------
  this.has = (target, key) => {
    var error, prototype;
    try {
      /* safe version of `Reflect.has()` that never throws an error */
      /* try to use `Reflect.has()` on given target; will fail for `null`, `undefined`, primitive values: */
      return Reflect.has(target, key);
    } catch (error1) {
      error = error1;
      null;
    }
    try {
      if ((prototype = Object.getPrototypeOf(target)) == null) {
        /* try to retrieve prototype of target; will fail for `null`, `undefined`: */
        return false;
      }
    } catch (error1) {
      error = error1;
      null;
    }
    if (prototype == null) {
      /* give up if no prototye has been returned (may happen e.g. with `target = Object.create null`): */
      return false;
    }
    /* apply `Reflect.has()` to prototype of target; this should be the definitive answer: */
    return Reflect.has(prototype, key);
  };

  //-----------------------------------------------------------------------------------------------------------
  get = function(target, key, fallback) {
    var arity;
    switch (arity = arguments.length) {
      case 2:
        fallback = this._misfit;
        break;
      case 3:
        null;
        break;
      default:
        throw new Error(`^guy.props.get@1^ expected 2 or 3 arguments, got ${arity}`);
    }
    if (this.has(target, key)) {
      return target[key];
    }
    if (fallback !== this._misfit) {
      return fallback;
    }
    throw new Error(`^guy.props.get@1^ no such property ${H.rpr(key)}`);
  };

  this.get = get.bind(this);

  //-----------------------------------------------------------------------------------------------------------
  this./* avoiding fat-arrow function so we can use `arguments` */_get_keys_cfg = function(cfg) {
    var has_hidden;
    has_hidden = (cfg != null ? cfg : {}).hidden != null;
    cfg = {...H.types.defaults.guy_props_keys_cfg, ...cfg};
    if (!has_hidden && cfg.builtins) {
      cfg.hidden = true;
    }
    H.types.validate.guy_props_keys_cfg(cfg);
    return cfg;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.keys = (owner, cfg) => {
    return [...(this._walk_keys(owner, this._get_keys_cfg(cfg)))];
  };

  //-----------------------------------------------------------------------------------------------------------
  this.has_any_keys = (owner, cfg) => {
    var key, ref;
    ref = this._walk_keys(owner, this._get_keys_cfg(cfg));
    for (key of ref) {
      return true;
    }
    return false;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.walk_keys = (owner, cfg) => {
    return this._walk_keys(owner, this._get_keys_cfg(cfg));
  };

  //-----------------------------------------------------------------------------------------------------------
  this._walk_keys = function*(owner, cfg) {
    var cache, collector, i, j, key, len, len1, ref, ref1, ref2, ref3, seen, y, z;
    seen = new Set();
    if (cfg.depth_first) {
      cache = new Map();
      ref = this._walk_keyowners(owner, cfg);
      for (y of ref) {
        ({key, owner} = y);
        if ((collector = cache.get(owner)) == null) {
          cache.set(owner, collector = []);
        }
        collector.push(key);
      }
      ref1 = [...cache.keys()].reverse();
      for (i = 0, len = ref1.length; i < len; i++) {
        owner = ref1[i];
        ref2 = cache.get(owner);
        for (j = 0, len1 = ref2.length; j < len1; j++) {
          key = ref2[j];
          if (seen.has(key)) {
            continue;
          }
          seen.add(key);
          yield key;
        }
      }
    } else {
      ref3 = this._walk_keyowners(owner, cfg);
      for (z of ref3) {
        ({key} = z);
        if (seen.has(key)) {
          continue;
        }
        seen.add(key);
        yield key;
      }
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.get_prototype_chain = function(owner) {
    var R, ref, y;
    R = new Set();
    ref = this._walk_keyowners(owner, this._get_keys_cfg());
    for (y of ref) {
      ({owner} = y);
      R.add(owner);
    }
    return [...R];
  };

  //-----------------------------------------------------------------------------------------------------------
  this._walk_keyowners = function*(owner, cfg, current_depth = 0) {
    var d, error, i, key, len, proto_owner, ref;
    if ((cfg.depth != null) && current_depth > cfg.depth) {
      return null;
    }
    if ((!cfg.builtins) && builtins.has(owner)) {
      return null;
    }
    try {
      ref = Reflect.ownKeys(owner);
      for (i = 0, len = ref.length; i < len; i++) {
        key = ref[i];
        if ((!cfg.symbols) && (H.types.isa.symbol(key))) {
          continue;
        }
        d = Object.getOwnPropertyDescriptor(owner, key);
        if ((!cfg.hidden) && (!d.enumerable)) {
          continue;
        }
        yield ({key, owner});
      }
    } catch (error1) {
      error = error1;
      if (cfg.allow_any && (error.message === 'Reflect.ownKeys called on non-object')) {
        return null;
      }
      throw new Error(`^guy.props._walk_keyowners@1^ Reflect.ownKeys called on non-object ${rpr(owner)}`);
    }
    //.........................................................................................................
    if ((proto_owner = Object.getPrototypeOf(owner)) != null) {
      yield* this._walk_keyowners(proto_owner, cfg, current_depth + 1);
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.xray = (owner, base = {}) => {
    var k, ref;
    ref = this._walk_keys(owner, {
      hidden: true,
      symbols: true,
      builtins: false
    });
    for (k of ref) {
      base[k] = owner[k];
    }
    return base;
  };

  //-----------------------------------------------------------------------------------------------------------
  /* thx to https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptors#creating_a_shallow_copy */
  this._shallow_copy = function(d) {
    return Object.create(Object.getPrototypeOf(d), Object.getOwnPropertyDescriptors(d));
  };

  //===========================================================================================================
  // TREE
  //-----------------------------------------------------------------------------------------------------------
  this.tree = function(owner, cfg) {
    return [...(this.walk_tree(owner, cfg))];
  };

  //-----------------------------------------------------------------------------------------------------------
  this.walk_tree = function*(owner, cfg) {
    var p, ref, x;
    H.types.validate.guy_props_tree_cfg((cfg = {...H.types.defaults.guy_props_tree_cfg, ...cfg}));
    if (cfg.sep == null) {
      return (yield* this._walk_tree(owner, cfg));
    }
    ref = this._walk_tree(owner, cfg);
    for (p of ref) {
      yield ((function() {
        var i, len, results;
        results = [];
        for (i = 0, len = p.length; i < len; i++) {
          x = p[i];
          results.push(x.toString());
        }
        return results;
      })()).join(cfg.sep);
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this._walk_tree = function*(owner, cfg, seen) {
    var error, key, ref, ref1, seen_keys, subkey, subowner, value, verdict, y;
    if (seen == null) {
      seen = new Map();
    }
    ref = this._walk_keyowners(owner, cfg);
    for (y of ref) {
      ({
        key,
        owner: subowner
      } = y);
      if (!seen.has(subowner)) {
        seen.set(subowner, new Set());
      }
      if ((seen_keys = seen.get(subowner)).has(key)) {
        continue;
      }
      seen_keys.add(key);
      try {
        value = subowner[key];
      } catch (error1) {
        error = error1;
        if (cfg.allow_any && (/'caller', 'callee', and 'arguments' properties may not be accessed/.test(error.message))) {
          continue;
        }
      }
      verdict = cfg.evaluate != null ? cfg.evaluate({
        owner: subowner,
        key,
        value
      }) : 'take,descend';
      H.types.validate.guy_props_tree_verdict(verdict);
      if (verdict === false) {
        continue;
      }
      if (verdict === true) {
        verdict = 'take,descend';
      }
      if (/\btake\b/.test(verdict)) {
        yield [key];
      }
      if (!/\bdescend\b/.test(verdict)) {
        continue;
      }
      ref1 = this._walk_tree(value, cfg, seen);
      for (subkey of ref1) {
        yield [key, subkey].flat();
      }
    }
    return null;
  };

}).call(this);

//# sourceMappingURL=props.js.map