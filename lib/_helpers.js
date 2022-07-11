(function() {
  'use strict';
  var inspect;

  //###########################################################################################################
  inspect = (require('util')).inspect;

  this.types = new (require('intertype-legacy')).Intertype();

  this.types.defaults = {};

  //-----------------------------------------------------------------------------------------------------------
  this._trm_cfg = {
    separator: ' ',
    //.........................................................................................................
    rpr: {
      depth: 2e308,
      maxArrayLength: 2e308,
      breakLength: 2e308,
      compact: true,
      colors: false
    },
    //.........................................................................................................
    inspect: {
      depth: 2e308,
      maxArrayLength: 2e308,
      breakLength: 2e308,
      compact: false,
      colors: true
    }
  };

  //-----------------------------------------------------------------------------------------------------------
  this.rpr = (...P) => {
    var x;
    return ((function() {
      var i, len, results;
      results = [];
      for (i = 0, len = P.length; i < len; i++) {
        x = P[i];
        results.push(inspect(x, this._trm_cfg.rpr));
      }
      return results;
    }).call(this)).join(this._trm_cfg.separator);
  };

  this.inspect = (...P) => {
    var x;
    return ((function() {
      var i, len, results;
      results = [];
      for (i = 0, len = P.length; i < len; i++) {
        x = P[i];
        results.push(inspect(x, this._trm_cfg.inspect));
      }
      return results;
    }).call(this)).join(this._trm_cfg.separator);
  };

}).call(this);

//# sourceMappingURL=_helpers.js.map