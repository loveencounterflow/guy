(function() {
  'use strict';
  var CND, misfit, rpr;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  //-----------------------------------------------------------------------------------------------------------
  this._misfit = misfit = Symbol('misfit');

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
  this.Strict_proprietor = class Strict_proprietor {
    //---------------------------------------------------------------------------------------------------------
    constructor() {
      /* thx to https://stackoverflow.com/a/40714458/7568091 */
      var self;
      self = this;
      //.......................................................................................................
      this.has = new Proxy({}, {
        get: (_, key) => {
          if (key === Symbol.toStringTag) {
            return void 0;
          }
          return self[key] !== void 0;
        }
      });
      //.......................................................................................................
      return new Proxy(this, {
        //.....................................................................................................
        get: (target, key) => {
          var R;
          if (key === Symbol.toStringTag) {
            return void 0;
          }
          if ((R = target[key]) === void 0) {
            throw new Error(`^guy.obj.Strict_proprietor@1^ ${this.constructor.name} instance does not have property ${rpr(key)}`);
          }
          return R;
        }
      });
      ({
        // set: ( target, key, value ) =>
        //   target[key] = value
        //   return true

        //.......................................................................................................
        get: (key, fallback = misfit) => {
          var error;
          try {
            return self[key];
          } catch (error1) {
            error = error1;
            if (fallback !== misfit) {
              return fallback;
            }
          }
          throw error;
        }
      });
    }

  };

}).call(this);

//# sourceMappingURL=obj.js.map