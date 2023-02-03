(function() {
  'use strict';
  var H;

  //###########################################################################################################
  H = require('./_helpers');

  // #-----------------------------------------------------------------------------------------------------------
  // H.types.declare 'guy_str_walk_lines_cfg', tests:
  //   "@isa.object x":                                                    ( x ) -> @isa.object x
  //   "@isa_optional.nonempty_text x.encoding":                           ( x ) -> @isa_optional.nonempty_text x.encoding
  //   "@isa.positive_integer x.chunk_size":                               ( x ) -> @isa.positive_integer x.chunk_size
  //   "@isa.buffer x.newline and ( Buffer.from '\n' ).equals x.newline":  \
  //     ( x ) -> ( @isa.buffer x.newline ) and ( Buffer.from '\n' ).equals x.newline
  //   # "@isa.guy_buffer_chr x.newline":                                    ( x ) -> @isa.guy_buffer_chr x.newline

  // #-----------------------------------------------------------------------------------------------------------
  // defaults =
  //   guy_str_walk_lines_cfg:
  //     newline:        '\n'

  //-----------------------------------------------------------------------------------------------------------
  /* thx to https://stackoverflow.com/a/6969486/7568091 and
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#escaping */
  this.escape_for_regex = function(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  //-----------------------------------------------------------------------------------------------------------
  this.walk_lines = function*(text, cfg) {
    var R, last_position, match, pattern;
    // H.types.validate.guy_str_walk_lines_cfg ( cfg = { defaults.guy_str_walk_lines_cfg..., cfg..., } )
    // H.types.validate.nonempty_text path
    // { newline   } = cfg
    //.........................................................................................................
    pattern = /.*?(\n|$)/suy;
    last_position = text.length - 1;
    while (true) {
      if (pattern.lastIndex > last_position) {
        break;
      }
      if ((match = text.match(pattern)) == null) {
        debug('^3234^', text.slice(pattern.lastIndex));
        break;
      }
      yield match[0];
    }
    R = walk_lines();
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