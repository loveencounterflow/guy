(function() {
  'use strict';
  var defaults, isa, misfit, type_of, types, validate;

  //###########################################################################################################
  types = new (require('intertype')).Intertype();

  ({isa, validate, type_of} = types.export());

  misfit = Symbol('misfit');

  //-----------------------------------------------------------------------------------------------------------
  types.declare('guy_walk_lines_cfg', {
    tests: {
      "@isa.object x": function(x) {
        return this.isa.object(x);
      },
      "@isa.boolean x.decode": function(x) {
        return this.isa.boolean(x.decode);
      }
    }
  });

  //-----------------------------------------------------------------------------------------------------------
  types.declare('guy_walk_circular_lines_cfg', {
    tests: {
      "@isa.object x": function(x) {
        return this.isa.object(x);
      },
      "@isa.boolean x.decode": function(x) {
        return this.isa.boolean(x.decode);
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
    guy_walk_lines_cfg: {
      decode: true
    },
    guy_walk_circular_lines_cfg: {
      decode: true,
      loop_count: 1,
      line_count: +2e308
    }
  };

  //-----------------------------------------------------------------------------------------------------------
  this.walk_lines = function*(path, cfg) {
    var line, readline_cfg, readlines;
    /* TAINT make newline, buffersize configurable */
    /* thx to https://github.com/nacholibre/node-readlines */
    validate.guy_walk_lines_cfg((cfg = {...defaults.guy_walk_lines_cfg, ...cfg}));
    validate.nonempty_text(path);
    readline_cfg = {
      readChunk: 4 * 1024, // chunk_size, byte_count
      newLineCharacter: '\n' // nl
    };
    readlines = new (require('../dependencies/n-readlines-patched'))(path, readline_cfg);
    if (cfg.decode) {
      while ((line = readlines.next()) !== false) {
        yield line.toString('utf-8');
      }
    } else {
      while ((line = readlines.next()) !== false) {
        yield line;
      }
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
      ref = this.walk_lines(path, {
        decode: cfg.decode
      });
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

  //-----------------------------------------------------------------------------------------------------------
  this.get_file_size = function(path, fallback = misfit) {
    var error;
    try {
      return ((require('fs')).statSync(path)).size;
    } catch (error1) {
      error = error1;
      if (fallback === misfit) {
        throw error;
      }
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }
    return fallback;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.get_content_hash = function(path, cfg) {
    var CP, R, options, ref, result;
    CP = require('child_process');
    defaults = {
      command: 'sha1sum',
      length: 17
    };
    cfg = {...defaults, ...cfg};
    if ((ref = cfg.command) !== 'sha1sum' && ref !== 'sha512sum' && ref !== 'sha256sum' && ref !== 'sha224sum' && ref !== 'md5sum') {
      throw new Error(`^guy.fs.get_content_hash@1^ illegal command ${rpr(command)}`);
    }
    validate.cardinal(cfg.length);
    options = ['-b', path];
    result = CP.spawnSync(cfg.command, options);
    if (result.status !== 0) {
      throw new Error("^guy.fs.get_content_hash@1^ " + result.stderr.toString('utf-8'));
    }
    R = result;
    R = R.stdout.toString('utf-8');
    R = R.replace(/\s.*$/, '');
    R = R.slice(0, cfg.length);
    if (R.length !== cfg.length) {
      throw new Error(`^guy.fs.get_content_hash@1^ unable to generate hash of length ${cfg.length} using ${cfg.command}`);
    }
    return R;
  };

}).call(this);

//# sourceMappingURL=fs.js.map