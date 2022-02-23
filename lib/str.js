(function() {
  'use strict';
  //###########################################################################################################
  // types                     = new ( require 'intertype' ).Intertype()
  // { isa
  //   validate
  //   type_of }               = types.export()

  //-----------------------------------------------------------------------------------------------------------
  this.SQL = function(parts, ...expressions) {
    var R, expression, i, idx, len;
    R = parts[0];
    for (idx = i = 0, len = expressions.length; i < len; idx = ++i) {
      expression = expressions[idx];
      R += expression.toString() + parts[idx + 1];
    }
    return R;
  };

}).call(this);

//# sourceMappingURL=str.js.map