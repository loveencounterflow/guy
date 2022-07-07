(function() {
  'use strict';
  var CND, H, builtins, def, def_oneoff, hide, misfit, no_such_value, props, rpr;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  props = this;

  no_such_value = Symbol('no_such_value');

  H = require('./_helpers');

  builtins = require('./_builtins');

  //-----------------------------------------------------------------------------------------------------------
  H.types.declare('guy_props_keys_cfg', {
    tests: {
      "@isa.object x": function(x) {
        return this.isa.object(x);
      },
      "@isa.boolean x.symbols": function(x) {
        return this.isa.boolean(x.symbols);
      },
      "@isa.boolean x.builtins": function(x) {
        return this.isa.boolean(x.builtins);
      }
    }
  });

  //...........................................................................................................
  H.types.defaults.guy_props_keys_cfg = {
    symbols: true,
    builtins: true
  };

  //-----------------------------------------------------------------------------------------------------------
  this._misfit = misfit = Symbol('misfit');

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

  //===========================================================================================================
  this.Strict_owner = class Strict_owner {
    //---------------------------------------------------------------------------------------------------------
    constructor(cfg) {
      var R;
      cfg = {
        target: this,
        ...cfg
      };
      //.......................................................................................................
      R = new Proxy(cfg.target, {
        //.....................................................................................................
        get: (target, key) => {
          var value;
          if (key === Symbol.toStringTag) {
            return void 0;
          }
          if ((value = props.get(target, key, no_such_value)) === no_such_value) {
            throw new Error(`^guy.props.Strict_owner@1^ ${this.constructor.name} instance does not have property ${rpr(key)}`);
          }
          return value;
        }
      });
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
  this.get = (target, key, fallback = misfit) => {
    if (this.has(target, key)) {
      return target[key];
    }
    if (fallback !== misfit) {
      return fallback;
    }
    throw new Error(`^guy.props.get@1^ no such property ${rpr(key)}`);
  };

  //-----------------------------------------------------------------------------------------------------------
  this.keys = function(owner, cfg) {
    H.types.validate.guy_props_keys_cfg((cfg = {...H.types.defaults.guy_props_keys_cfg, ...cfg}));
    return [...(this._walk_keys(owner, cfg))];
  };

  //-----------------------------------------------------------------------------------------------------------
  this.walk_keys = function(owner, cfg) {
    H.types.validate.guy_props_keys_cfg((cfg = {...H.types.defaults.guy_props_keys_cfg, ...cfg}));
    return this._walk_keys(owner, cfg);
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
  this._walk_keyowners = function*(owner, cfg) {
    var i, key, len, proto_owner, ref;
    if ((!cfg.builtins) && builtins.has(owner)) {
      // urge '^3354^', owner
      return null;
    }
    ref = Reflect.ownKeys(owner);
    for (i = 0, len = ref.length; i < len; i++) {
      key = ref[i];
      if (H.types.isa.symbol(key)) {
        if (cfg.symbols) {
          yield ({key, owner});
        }
      } else {
        yield ({key, owner});
      }
    }
    //.........................................................................................................
    if ((proto_owner = Object.getPrototypeOf(owner)) != null) {
      yield* this._walk_keyowners(proto_owner, cfg);
    }
    return null;
  };

}).call(this);

//# sourceMappingURL=props.js.map