(function() {
  'use strict';
  var H;

  //###########################################################################################################
  H = require('./_helpers');

  /* thx to https://exploringjs.com/impatient-js/ch_sets.html#missing-set-operations */
  //-----------------------------------------------------------------------------------------------------------
  this.unite = function(...P) {
    var p;
    return new Set(((function() {
      var i, len, results;
      results = [];
      for (i = 0, len = P.length; i < len; i++) {
        p = P[i];
        results.push([...p]);
      }
      return results;
    })()).flat());
  };

  this._intersect = function(a, b) {
    return new Set((Array.from(a)).filter((x) => {
      return b.has(x);
    }));
  };

  //-----------------------------------------------------------------------------------------------------------
  this.intersect = function(...P) {
    var R, arity, i, idx, p, ref;
    if (!((arity = P.length) >= 2)) {
      throw new Error(`^guy.sets.intersect@1^ expected at least 2 arguments, got ${arity}`);
    }
    R = P[0];
    H.types.validate.set(R);
    for (idx = i = 1, ref = arity; (1 <= ref ? i < ref : i > ref); idx = 1 <= ref ? ++i : --i) {
      p = P[idx];
      H.types.validate.set(p);
      R = this._intersect(R, p);
      if (R.size === 0) {
        return R;
      }
    }
    return R;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.subtract = function(a, b) {
    return new Set((Array.from(a)).filter((x) => {
      return !b.has(x);
    }));
  };

}).call(this);

//# sourceMappingURL=sets.js.map