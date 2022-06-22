(function() {
  'use strict';
  var CND, def, def_oneoff, hide, misfit, rpr;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

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
      var R, has_target;
      cfg = {
        target: this,
        ...cfg
      };
      //.......................................................................................................
      R = new Proxy(cfg.target, {
        //.....................................................................................................
        get: (target, key) => {
          if (key === Symbol.toStringTag) {
            return void 0;
          }
          if ((R = target[key]) === void 0) {
            throw new Error(`^guy.props.Strict_owner@1^ ${this.constructor.name} instance does not have property ${rpr(key)}`);
          }
          return R;
        }
      });
      // set: ( target, key, value ) =>
      //   target[key] = value
      //   return true
      //.......................................................................................................
      has_target = (key) => {
        if (key === Symbol.toStringTag) {
          return true;
        }
        return cfg.target[key] !== void 0;
      };
      //.......................................................................................................
      if (cfg.target.has == null) {
        hide(cfg.target, 'has', new Proxy(has_target, {
          get: (_, key) => {
            return has_target(key);
          }
        }));
      }
      //.......................................................................................................
      if (cfg.target.get == null) {
        hide(cfg.target, 'get', (key, fallback = misfit) => {
          var error;
          try {
            return cfg.target[key];
          } catch (error1) {
            error = error1;
            if (fallback !== misfit) {
              return fallback;
            }
          }
          throw error;
        });
      }
      //.......................................................................................................
      return R;
    }

  };

}).call(this);

//# sourceMappingURL=props.js.map