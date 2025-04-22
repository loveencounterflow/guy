(function() {
  'use strict';
  var FSTR, TRM, format, new_formatter;

  //===========================================================================================================
  // H                         = require './_helpers'
  FSTR = require('../dependencies/LiuQixuan-FString');

  TRM = require('./trm');

  //===========================================================================================================
  format = function(fmt, x) {
    if (fmt.startsWith(':')) {
      throw new SyntaxError(`format spec can not start with colon, got ${TRM.rpr(fmt)}`);
    }
    fmt = ':' + fmt;
    if ((typeof x) !== 'string') {
      x = TRM.rpr(x);
    }
    return FSTR.formatByParam(x, fmt);
  };

  //-----------------------------------------------------------------------------------------------------------
  new_formatter = function(fmt) {
    return function(x) {
      return format(fmt, x);
    };
  };

  //===========================================================================================================
  module.exports = {format, new_formatter};

}).call(this);

//# sourceMappingURL=fmt.js.map