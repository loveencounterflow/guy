(function() {
  'use strict';
  var GUY_props, H, builtins, def, def_oneoff, hide, no_such_value, props, rpr;

  //###########################################################################################################
  props = this;

  no_such_value = Symbol('no_such_value');

  H = require('./_helpers');

  builtins = require('./_builtins');

  GUY_props = this;

  this._misfit = Symbol('misfit');

  this._misfit2 = Symbol('misfit2');

  ({rpr} = require('./trm'));

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
    depth: null
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
      "@isa_optional.text x.joiner": function(x) {
        return this.isa_optional.text(x.joiner);
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
    evaluate: null,
    joiner: null
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
  H.types.declare('guy_props_strict_owner_cfg', {
    tests: {
      "@isa.object x": function(x) {
        return this.isa.object(x);
      },
      "x.target?": function(x) {
        return x.target != null;
      },
      "@isa.boolean x.reset": function(x) {
        return this.isa.boolean(x.reset);
      }
    }
  });

  //...........................................................................................................
  H.types.defaults.guy_props_strict_owner_cfg = {
    target: null,
    reset: true
  };

  //-----------------------------------------------------------------------------------------------------------
  this.def = def = Object.defineProperty;

  this.hide = hide = (object, name, value) => {
    return Object.defineProperty(object, name, {
      enumerable: false,
      value
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
  this.Strict_owner = class Strict_owner {
    //---------------------------------------------------------------------------------------------------------
    static _get_strict_owner_handlers(instance) {
      var classname, get, set;
      classname = instance.constructor.name;
      //.........................................................................................................
      get = (target, key) => {
        var value;
        if (key === Symbol.toStringTag) {
          return void 0;
        }
        if ((value = props.get(target, key, no_such_value)) === no_such_value) {
          throw new Error(`^guy.props.Strict_owner@1^ ${classname} instance does not have property ${H.rpr(key)}`);
        }
        return value;
      };
      //.........................................................................................................
      set = (target, key, value) => {
        if (GUY_props.has(target, key)) {
          throw new Error(`^guy.props.Strict_owner@1^ ${classname} instance already has property ${H.rpr(key)}`);
        }
        return Reflect.set(target, key, value);
      };
      //.........................................................................................................
      return {get, set};
    }

    //---------------------------------------------------------------------------------------------------------
    constructor(cfg) {
      var R, get, set;
      cfg = {
        target: this,
        ...cfg
      };
      H.types.validate.guy_props_strict_owner_cfg(cfg = {...H.types.defaults.guy_props_strict_owner_cfg, ...cfg});
      ({get, set} = this.constructor._get_strict_owner_handlers(this));
      //.......................................................................................................
      if (cfg.reset) {
        R = new Proxy(cfg.target, {get});
      } else {
        R = new Proxy(cfg.target, {get, set});
      }
      //.......................................................................................................
      return R;
    }

  };

  //===========================================================================================================
  // KEY TESTING, RETRIEVAL, CATALOGUING
  //-----------------------------------------------------------------------------------------------------------
  this.has = (target, key) => {
    var error;
    try {
      /* safe version of `Reflect.has()` that never throws an error */
      return Reflect.has(target, key);
    } catch (error1) {
      error = error1;
      return false;
    }
  };

  //-----------------------------------------------------------------------------------------------------------
  this.get = (target, key, fallback = this._misfit) => {
    if (this.has(target, key)) {
      return target[key];
    }
    if (fallback !== this._misfit) {
      return fallback;
    }
    throw new Error(`^guy.props.get@1^ no such property ${H.rpr(key)}`);
  };

  //-----------------------------------------------------------------------------------------------------------
  this._get_keys_cfg = function(cfg) {
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
  this.keys = function(owner, cfg) {
    return [...(this._walk_keys(owner, this._get_keys_cfg(cfg)))];
  };

  //-----------------------------------------------------------------------------------------------------------
  this.has_keys = function(owner, cfg) {
    var key, ref;
    ref = this._walk_keys(owner, this._get_keys_cfg(cfg));
    for (key of ref) {
      return true;
    }
    return false;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.walk_keys = function(owner, cfg) {
    return this._walk_keys(owner, this._get_keys_cfg(cfg));
  };

  //-----------------------------------------------------------------------------------------------------------
  this._walk_keys = function*(owner, cfg) {
    var key, ref, seen, y;
    seen = new Set();
    ref = this._walk_keyowners(owner, cfg);
    for (y of ref) {
      ({key} = y);
      if (seen.has(key)) {
        continue;
      }
      seen.add(key);
      yield key;
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this._walk_keyowners = function*(owner, cfg, current_depth = 0) {
    var d, error, i, key, len, proto_owner, ref;
    if ((cfg.depth != null) && current_depth > cfg.depth) {
      // urge '^3354^', owner
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

  //===========================================================================================================
  // TREE
  //-----------------------------------------------------------------------------------------------------------
  this.tree = function(owner, cfg) {
    var p, x;
    H.types.validate.guy_props_tree_cfg((cfg = {...H.types.defaults.guy_props_tree_cfg, ...cfg}));
    if (cfg.joiner == null) {
      return [...(this._walk_tree(owner, cfg))];
    }
    return [
      ...((function() {
        var ref,
      results;
        ref = this._walk_tree(owner, cfg);
        results = [];
        for (p of ref) {
          results.push(((function() {
            var i,
      len,
      results1;
            results1 = [];
            for (i = 0, len = p.length; i < len; i++) {
              x = p[i];
              results1.push(x.toString());
            }
            return results1;
          })()).join(cfg.joiner));
        }
        return results;
      }).call(this))
    ];
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