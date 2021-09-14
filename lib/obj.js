(function() {
  'use strict';
  //-----------------------------------------------------------------------------------------------------------
  this.pick_with_fallback = function(d, fallback, ...keys) {
    var R, i, key, len, ref, value;
    R = {};
    ref = keys.flat(2e308);
    for (i = 0, len = ref.length; i < len; i++) {
      key = ref[i];
      R[key] = (value = d[key]) === void 0 ? fallback : value;
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

}).call(this);

//# sourceMappingURL=obj.js.map