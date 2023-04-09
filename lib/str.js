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
      },
      "@isa.text x.prepend": function(x) {
        return this.isa.text(x.prepend);
      },
      "@isa.text x.append": function(x) {
        return this.isa.text(x.append);
      }
    }
  });

  //-----------------------------------------------------------------------------------------------------------
  defaults = {
    guy_str_walk_lines_cfg: {
      trim: true,
      prepend: '',
      append: ''
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
    var append, eol, idx, last_position, line, linenl, lnr, match, pattern, prepend, trim;
    H.types.validate.guy_str_walk_lines_cfg((cfg = {...defaults.guy_str_walk_lines_cfg, ...cfg}));
    ({trim, prepend, append} = cfg);
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
      line = match[1];
      if (trim) {
        line = line.trimEnd();
      }
      if (prepend !== '') {
        line = prepend + line;
      }
      if (append !== '') {
        line = line + append;
      }
      yield ({lnr, line, eol});
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

  //-----------------------------------------------------------------------------------------------------------
  this.pluralize = function(word) {
    var R, to_upper;
    /* thx to https://github.com/sindresorhus/plur/blob/main/index.js */
    H.types.validate.text(word);
    if (word === '') {
      return '';
    }
    R = word;
    R = R.replace(/(?:s|x|z|ch|sh)$/i, '$&e');
    R = R.replace(/([^aeiou])y$/i, '$1ie');
    R += 's';
    if ((to_upper = /\p{Lu}$/u.test(word))) {
      R = R.replace(/i?e?s$/i, (match) => {
        return match.toUpperCase();
      });
    }
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