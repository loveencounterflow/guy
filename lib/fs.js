(function() {
  'use strict';
  var H, cr, cr_buffer, defaults, empty_buffer, empty_string, lf, lf_buffer, misfit, platform, rpr;

  //###########################################################################################################
  H = require('./_helpers');

  misfit = Symbol('misfit');

  platform = (require('os')).platform();

  rpr = (require('util')).inspect;

  //-----------------------------------------------------------------------------------------------------------
  /* Constants: */
  cr = 0x0d;

  lf = 0x0a;

  empty_string = '';

  empty_buffer = Buffer.from(empty_string);

  cr_buffer = Buffer.from([cr]);

  lf_buffer = Buffer.from([lf]);

  //-----------------------------------------------------------------------------------------------------------
  H.types.declare('guy_buffer_chr', function(x) {
    if ((this.isa.integer(x)) && ((0x00 <= x && x <= 0xff))) {
      return true;
    }
    if ((this.isa.buffer(x)) && (x.length > 0)) {
      return true;
    }
    if ((this.isa.text(x)) && (x.length > 0)) {
      return true;
    }
    return false;
  });

  //-----------------------------------------------------------------------------------------------------------
  H.types.declare('guy_fs_walk_lines_cfg', {
    tests: {
      "@isa.object x": function(x) {
        return this.isa.object(x);
      },
      "@isa_optional.nonempty_text x.encoding": function(x) {
        return this.isa_optional.nonempty_text(x.encoding);
      },
      "@isa.positive_integer x.chunk_size": function(x) {
        return this.isa.positive_integer(x.chunk_size);
      },
      "@isa.buffer x.newline and ( Buffer.from '\n' ).equals x.newline": function(x) {
        return (this.isa.buffer(x.newline)) && (Buffer.from('\n')).equals(x.newline);
      },
      "@isa.boolean x.trim": function(x) {
        return this.isa.boolean(x.trim);
      }
    }
  });

  // "@isa.guy_buffer_chr x.newline":                                    ( x ) -> @isa.guy_buffer_chr x.newline

  //-----------------------------------------------------------------------------------------------------------
  H.types.declare('guy_walk_circular_lines_cfg', {
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
  H.types.declare('guy_get_content_hash_cfg', {
    tests: {
      "@isa.object x": function(x) {
        return this.isa.object(x);
      },
      "@isa.cardinal x.length": function(x) {
        return this.isa.cardinal(x.length);
      }
    }
  });

  //-----------------------------------------------------------------------------------------------------------
  defaults = {
    guy_fs_walk_lines_cfg: {
      encoding: 'utf-8',
      newline: Buffer.from('\n'),
      chunk_size: 16 * 1024,
      trim: true
    },
    guy_walk_circular_lines_cfg: {
      decode: true,
      loop_count: 1,
      line_count: +2e308
    },
    guy_get_content_hash_cfg: {
      length: 17,
      fallback: misfit
    }
  };

  //-----------------------------------------------------------------------------------------------------------
  this.walk_lines = function*(path, cfg) {
    var line, ref, results, y;
    ref = this.walk_lines_with_positions(path, cfg);
    results = [];
    for (y of ref) {
      ({line} = y);
      results.push((yield line));
    }
    return results;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.walk_lines_with_positions = function*(path, cfg) {
    var chunk_size, count, d, encoding, line, nl, ref, trim;
    // @walk_lines_with_positions = ( path, cfg ) ->
    H.types.validate.guy_fs_walk_lines_cfg((cfg = {...defaults.guy_fs_walk_lines_cfg, ...cfg}));
    H.types.validate.nonempty_text(path);
    ({chunk_size, encoding, trim} = cfg);
    //.........................................................................................................
    count = 0;
    ref = this._walk_lines_with_positions(path, chunk_size);
    for (d of ref) {
      count++;
      if (encoding != null) {
        d.line = d.line.toString(encoding);
        if (trim) {
          d.line = d.line.trimEnd();
        }
        d.nl = d.nl.toString(encoding);
        yield d;
      } else {
        yield d;
      }
    }
    if (count === 0) {
      line = encoding != null ? empty_string : empty_buffer;
      nl = encoding != null ? empty_string : empty_buffer;
      yield ({
        lnr: 1,
        line,
        nl
      });
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this._walk_lines_with_positions = function*(path, chunk_size) {
    var FS, buffer, byte_count, byte_idx, fd, flush, is_cr, is_lf, line, line_cache, lnr, nl_cache, prv_was_cr, walk_lines;
    FS = require('node:fs');
    fd = FS.openSync(path);
    byte_idx = 0;
    prv_was_cr = false;
    is_cr = false;
    is_lf = false;
    //.........................................................................................................
    lnr = 0;
    line = null;
    line_cache = [];
    nl_cache = [];
    //.........................................................................................................
    flush = function*() {
      var nl;
      if ((line_cache.length === 0) && (nl_cache.length === 0)) {
        return;
      }
      switch (line_cache.length) {
        case 0:
          line = empty_buffer;
          break;
        case 1:
          line = line_cache[0];
          break;
        default:
          line = Buffer.concat(line_cache);
      }
      switch (nl_cache.length) {
        case 0:
          nl = empty_buffer;
          break;
        case 1:
          nl = nl_cache[0];
          break;
        default:
          nl = Buffer.concat(nl_cache);
      }
      lnr++;
      yield ({lnr, line, nl});
      line_cache.length = 0;
      nl_cache.length = 0;
      return null;
    };
    //.........................................................................................................
    walk_lines = function*(buffer) {
      var next_idx, next_idx_cr, next_idx_lf;
      while (true) {
        next_idx_cr = buffer.indexOf(cr);
        next_idx_lf = buffer.indexOf(lf);
        //.....................................................................................................
        if (next_idx_cr === -1) {
          if (next_idx_lf === -1) {
            line_cache.push(buffer);
            break;
          }
          next_idx = next_idx_lf;
          prv_was_cr = is_cr;
          is_cr = false;
          is_lf = true;
        } else {
          if ((next_idx_lf === -1) || (next_idx_cr < next_idx_lf)) {
            next_idx = next_idx_cr;
            prv_was_cr = is_cr;
            is_cr = true;
            is_lf = false;
          } else {
            next_idx = next_idx_lf;
            prv_was_cr = is_cr;
            is_cr = false;
            is_lf = true;
          }
        }
        //.....................................................................................................
        if (is_cr) {
          nl_cache.push(cr_buffer);
        } else if (is_lf) {
          nl_cache.push(lf_buffer);
        }
        //.....................................................................................................
        // console.log '^54-3^', next_idx, { is_cr, is_lf, prv_was_cr, }, ( prv_was_cr and is_lf ), [ ( buffer.subarray next_idx - 1, next_idx ).toString(), ( buffer.subarray next_idx, next_idx + 1 ).toString(), ( buffer.subarray 0, next_idx ).toString(), ]
        console.log('^324^', is_cr, is_lf, prv_was_cr, nl_cache);
        if (prv_was_cr && is_lf) {
          console.log('^32-1^', 'prv_was_cr and is_lf', '---------->', is_cr, is_lf, nl_cache);
          yield* flush();
        } else if (is_cr) {
          line_cache.push(buffer.subarray(0, next_idx));
          console.log('^32-2^', 'is_cr', '---------->', is_cr, is_lf, nl_cache);
        } else if (is_lf) {
          line_cache.push(buffer.subarray(0, next_idx));
          console.log('^32-3^', 'is_lf', '---------->', is_cr, is_lf, nl_cache);
          yield* flush();
        } else {
          line_cache.push(buffer.subarray(0, next_idx));
          console.log('^32-4^', 'no nl', '---------->', is_cr, is_lf, nl_cache);
        }
        buffer = buffer.subarray(next_idx + 1); // i.e. nl_length
      }
      return null;
    };
    while (true) {
      //.........................................................................................................
      buffer = Buffer.alloc(chunk_size);
      byte_count = FS.readSync(fd, buffer, 0, chunk_size, byte_idx);
      if (byte_count === 0) {
        break;
      }
      byte_idx += byte_count;
      if (byte_count < chunk_size) {
        buffer = buffer.subarray(0, byte_count);
      }
      yield* walk_lines(buffer);
    }
    yield* flush();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.walk_circular_lines = function*(path, cfg) {
    var line, line_count, loop_count, ref;
    H.types.validate.guy_walk_circular_lines_cfg((cfg = {...defaults.guy_walk_circular_lines_cfg, ...cfg}));
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
    H.types.validate.nonempty_text(path);
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
    var CP, R, command, result;
    H.types.validate.nonempty_text(path);
    H.types.validate.guy_get_content_hash_cfg((cfg = {...defaults.guy_get_content_hash_cfg, ...cfg}));
    CP = require('child_process');
    command = platform === 'linux' ? 'sha1sum' : 'shasum';
    result = CP.spawnSync(command, ['-b', path]);
    if (result.status !== 0) {
      if (cfg.fallback !== misfit) {
        return cfg.fallback;
      }
      if (result.stderr != null) {
        throw new Error("^guy.fs.get_content_hash@1^ " + result.stderr.toString('utf-8'));
      } else {
        throw new Error("^guy.fs.get_content_hash@1^ " + (require('util')).inspect(result.error));
      }
    }
    R = result;
    R = R.stdout.toString('utf-8');
    R = R.replace(/\s.*$/, '');
    R = R.slice(0, cfg.length);
    if (R.length !== cfg.length) {
      throw new Error(`^guy.fs.get_content_hash@1^ unable to generate hash of length ${cfg.length} using ${command}`);
    }
    return R;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.rename_sync = function(from_path, to_path) {
    /* Same as `FS.renameSync()`, but falls back to `FS.copyFileSync()`, `FS.unlinkSync()` in case device
     boundaries are crossed. Thx to https://github.com/sindresorhus/move-file/blob/main/index.js */
    var FS, error;
    FS = require('node:fs');
    try {
      FS.renameSync(from_path, to_path);
    } catch (error1) {
      error = error1;
      if (error.code !== 'EXDEV') {
        throw error;
      }
      FS.copyFileSync(from_path, to_path);
      FS.unlinkSync(from_path);
    }
    return null;
  };

}).call(this);

//# sourceMappingURL=fs.js.map