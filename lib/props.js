(function() {
  'use strict';
  var CND, def, def_oneoff, hide, misfit, no_such_value, props, rpr;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  props = this;

  no_such_value = Symbol('no_such_value');

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

}).call(this);

//# sourceMappingURL=props.js.map