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

  //---------------------------------------------------------------------------------------------------------
  /* thx to https://www.designcise.com/web/tutorial/which-characters-need-to-be-escaped-in-a-regular-expression-class */
  this.escape_for_regex_class = function(text) {
    return text.replace(/([\^\-\]\/])/g, '\\$1');
  };

  //-----------------------------------------------------------------------------------------------------------
  this.walk_lines = function*(text, cfg) {
    var line, ref, y;
    ref = this.walk_lines_with_positions(text, cfg);
    for (y of ref) {
      ({line} = y);
      yield line;
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.walk_lines_with_positions = function*(text, cfg) {
    var eol, idx, last_position, line, linenl, lnr, match, pattern, trim;
    H.types.validate.guy_str_walk_lines_cfg((cfg = {...defaults.guy_str_walk_lines_cfg, ...cfg}));
    ({trim} = cfg);
    //.........................................................................................................
    if (text === '') {
      yield ({
        lnr: 1,
        line: '',
        eol: ''
      });
      return null;
    }
    //.........................................................................................................
    lnr = 0;
    pattern = /(.*?)(\r\n|\r|\n|$)/suy;
    last_position = text.length - 1;
    while (true) {
      //.........................................................................................................
      idx = pattern.lastIndex;
      if (pattern.lastIndex > last_position) {
        break;
      }
      if ((match = text.match(pattern)) == null) {
        break;
      }
      [linenl, line, eol] = match;
      lnr++;
      if (trim) {
        line = match[1].trimEnd();
        yield ({lnr, line, eol});
      } else {
        line = match[1];
        yield ({lnr, line, eol});
      }
    }
    //.........................................................................................................
    if ((text.match(/(\r|\n)$/)) != null) {
      lnr++;
      yield ({
        lnr,
        line: '',
        eol: ''
      });
    }
    //.........................................................................................................
    return null;
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