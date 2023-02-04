(function() {
  'use strict';
  var H, defaults;

  //###########################################################################################################
  H = require('./_helpers');

  //-----------------------------------------------------------------------------------------------------------
  H.types.declare('guy_str_walk_lines_cfg', {
    tests: {
      "@isa.object x": function(x) {
        return this.isa.object(x);
      },
      "@isa.boolean x.trim": function(x) {
        return this.isa.boolean(x.trim);
      }
    }
  });

  //-----------------------------------------------------------------------------------------------------------
  defaults = {
    guy_str_walk_lines_cfg: {
      trim: true
    }
  };

  //-----------------------------------------------------------------------------------------------------------
  /* thx to https://stackoverflow.com/a/6969486/7568091 and
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#escaping */
  this.escape_for_regex = function(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  //-----------------------------------------------------------------------------------------------------------
  this.walk_lines = function*(text, cfg) {
    var R, last_position, match, pattern, trim;
    H.types.validate.guy_str_walk_lines_cfg((cfg = {...defaults.guy_str_walk_lines_cfg, ...cfg}));
    ({trim} = cfg);
    //.........................................................................................................
    // pattern       = /.*?(\n|$)/suy
    if (text === '') {
      yield '';
      return null;
    }
    pattern = /(.*?)(?:\r\n|\r|\n|$)/suy;
    last_position = text.length - 1;
    while (true) {
      if (pattern.lastIndex > last_position) {
        break;
      }
      if ((match = text.match(pattern)) == null) {
        break;
      }
      yield (trim ? match[1].trimEnd() : match[1]);
    }
    if ((text.match(/\n$/)) != null) {
      yield '';
    }
    R = this.walk_lines();
    R.reset = function() {
      return pattern.lastIndex = 0;
    };
    return R;
  };

  //===========================================================================================================

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