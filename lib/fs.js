(function() {
  'use strict';
  var defaults, isa, type_of, types, validate;

  //###########################################################################################################
  types = new (require('intertype')).Intertype();

  ({isa, validate, type_of} = types.export());

  //-----------------------------------------------------------------------------------------------------------
  types.declare('guy_walk_circular_lines_cfg', {
    tests: {
      "@isa.object x": function(x) {
        return this.isa.object(x);
      },
      "( x.loop_count is +Infinity ) or ( @isa.cardinal x.loop_count )": function(x) {
        return (x.loop_count === +2e308) || (this.isa.cardinal(x.loop_count));
      },
      "( x.line_count is +Infinity ) or ( @isa.cardinal x.line_count )": function(x) {
        return (x.line_count === +2e308) || (this.isa.cardinal(x.line_count));
      }
    }
  });

  //-----------------------------------------------------------------------------------------------------------
  defaults = {
    guy_walk_circular_lines_cfg: {
      loop_count: 1,
      line_count: +2e308
    }
  };

  //-----------------------------------------------------------------------------------------------------------
  this.walk_lines = function*(path) {
    var cfg, line, readlines;
    /* TAINT make newline, buffersize configurable */
    /* thx to https://github.com/nacholibre/node-readlines */
    validate.nonempty_text(path);
    cfg = {
      readChunk: 4 * 1024, // chunk_size, byte_count
      newLineCharacter: '\n' // nl
    };
    readlines = new (require('../dependencies/n-readlines-patched'))(path, cfg);
    while ((line = readlines.next()) !== false) {
      yield line.toString('utf-8');
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.walk_circular_lines = function*(path, cfg) {
    var line, line_count, loop_count, ref;
    validate.guy_walk_circular_lines_cfg((cfg = {...defaults.guy_walk_circular_lines_cfg, ...cfg}));
    if ((cfg.line_count === 0) || (cfg.loop_count === 0)) {
      return;
    }
    line_count = 0;
    loop_count = 0;
    while (true) {
      ref = this.walk_lines(path);
      for (line of ref) {
        yield line;
        line_count++;
        if (line_count >= cfg.line_count) {
          return null;
        }
      }
      loop_count++;
      if (loop_count >= cfg.loop_count) {
        return null;
      }
    }
    return null;
  };

}).call(this);

//# sourceMappingURL=fs.js.map