(function() {
  'use strict';
  var C_cr, C_cr_buffer, C_empty_buffer, C_empty_string, C_lf, C_lf_buffer, H, _get_descriptor_types_and_methods, debug, defaults, misfit, platform, rpr;

  //###########################################################################################################
  H = require('./_helpers');

  misfit = Symbol('misfit');

  platform = (require('os')).platform();

  rpr = (require('util')).inspect;

  debug = console.log;

  //-----------------------------------------------------------------------------------------------------------
  /* Constants: */
  C_cr = this._C_cr = 0x0d;

  C_lf = this._C_lf = 0x0a;

  C_empty_string = this._C_empty_string = '';

  C_empty_buffer = this._C_empty_buffer = Buffer.from(C_empty_string);

  C_cr_buffer = this._C_cr_buffer = Buffer.from([C_cr]);

  C_lf_buffer = this._C_lf_buffer = Buffer.from([C_lf]);

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
  H.types.declare('guy_fs_walk_buffers_cfg', {
    tests: {
      "@isa.positive_integer x.chunk_size": function(x) {
        return this.isa.positive_integer(x.chunk_size);
      }
    }
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
    guy_fs_walk_buffers_cfg: {
      chunk_size: 16 * 1024
    },
    guy_fs_walk_lines_cfg: {
      encoding: 'utf-8',
      chunk_size: 16 * 1024,
      trim: true,
      prepend: '',
      append: ''
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
  this.walk_buffers = function*(path, cfg) {
    var buffer, ref, y;
    ref = this.walk_buffers_with_positions(path, cfg);
    for (y of ref) {
      ({buffer} = y);
      yield buffer;
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.walk_buffers_with_positions = function*(path, cfg) {
    var FS, buffer, byte_count, byte_idx, chunk_size, fd;
    H.types.validate.guy_fs_walk_buffers_cfg((cfg = {...defaults.guy_fs_walk_buffers_cfg, ...cfg}));
    H.types.validate.nonempty_text(path);
    ({chunk_size} = cfg);
    FS = require('node:fs');
    fd = FS.openSync(path);
    byte_idx = 0;
    while (true) {
      buffer = Buffer.alloc(chunk_size);
      byte_count = FS.readSync(fd, buffer, 0, chunk_size, byte_idx);
      if (byte_count === 0) {
        break;
      }
      if (byte_count < chunk_size) {
        buffer = buffer.subarray(0, byte_count);
      }
      yield ({buffer, byte_idx});
      byte_idx += byte_count;
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.walk_lines = function*(path, cfg) {
    var line, ref, y;
    ref = this.walk_lines_with_positions(path, cfg);
    for (y of ref) {
      ({line} = y);
      yield line;
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.walk_lines_with_positions = function*(path, cfg) {
    var append, chunk_size, count, d, encoding, prepend, ref, trim;
    H.types.validate.guy_fs_walk_lines_cfg((cfg = {...defaults.guy_fs_walk_lines_cfg, ...cfg}));
    H.types.validate.nonempty_text(path);
    ({chunk_size, encoding, trim, prepend, append} = cfg);
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
        if (prepend !== '') {
          d.line = prepend + d.line;
        }
        if (append !== '') {
          d.line = d.line + append;
        }
        d.eol = d.eol.toString(encoding);
        yield d;
      } else {
        yield d;
      }
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this._walk_lines_with_positions = function*(path, chunk_size = 16 * 1024) {
    var buffer, eol, eol_cache, file_byte_idx, flush, has_extra_cr, line_cache, lnr, material, ref, ref1, y, z;
    line_cache = [];
    eol_cache = [];
    lnr = 0;
    // offset_bytes      = null
    //.........................................................................................................
    flush = function*(material = null, eol = null) {
      var line;
      // return null if ( line_cache.length is 0 ) and ( eol_cache.length is 0 )
      // byte_idx          = file_byte_idx + offset_bytes
      line = Buffer.concat(material != null ? [...line_cache, material] : line_cache);
      eol = Buffer.concat(eol != null ? [...eol_cache, eol] : eol_cache);
      line_cache.length = 0;
      eol_cache.length = 0;
      lnr++;
      // yield { byte_idx, lnr, line, eol, }
      return (yield {lnr, line, eol});
    };
    ref = this.walk_buffers_with_positions(path, {chunk_size});
    //.........................................................................................................
    for (y of ref) {
      ({
        buffer,
        byte_idx: file_byte_idx
      } = y);
      ref1 = this._walk_lines__walk_advancements(buffer);
      // debug '^_walk_lines_with_positions@23-4^', byte_idx, ( rpr buffer.toString() )
      // offset_bytes = 0
      for (z of ref1) {
        ({material, eol} = z);
        // debug '^_walk_lines_with_positions@23-4^', { file_byte_idx, offset_bytes, }, ( rpr material.toString() ), ( rpr eol.toString() )
        if ((eol_cache.length > 0) && !(((eol_cache.at(-1)) === C_cr_buffer) && eol === C_lf_buffer)) {
          yield* flush();
        }
        switch (eol) {
          case C_cr_buffer:
            if (material.length > 0) {
              line_cache.push(material);
            }
            eol_cache.push(eol);
            break;
          case C_lf_buffer:
            yield* flush(material, eol);
            break;
          case C_empty_buffer:
            if (material.length > 0) {
              line_cache.push(material);
            }
            break;
          default:
            throw new Error("^636456^ internal error");
        }
      }
    }
    // offset_bytes += material.length + eol.length
    //.........................................................................................................
    has_extra_cr = (eol_cache.length > 0) && ((eol_cache.at(-1)) === C_cr_buffer);
    yield* flush();
    if (has_extra_cr) {
      lnr++;
      yield ({
        lnr,
        line: C_empty_buffer,
        eol: C_empty_buffer
      });
    }
    //.........................................................................................................
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this._walk_lines__walk_advancements = function*(buffer, may_have_cr = true, may_have_lf = true) {
    var d, first_idx, last_idx;
    first_idx = 0;
    last_idx = buffer.length - 1;
    while (true) {
      if (first_idx > last_idx) {
        break;
      }
      yield (d = this._walk_lines__advance(buffer, first_idx, may_have_cr, may_have_lf));
      first_idx = d.next_idx;
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  /* TAINT add may_have_cr, may_have_lf as optimization to forego repeated unnecessary lookups */
  this._walk_lines__advance = function(buffer, first_idx, may_have_cr = true, may_have_lf = true) {
    var eol, material, next_idx, next_idx_cr, next_idx_lf;
    material = C_empty_buffer;
    eol = C_empty_buffer;
    next_idx_cr = -1;
    next_idx_lf = -1;
    if (may_have_cr) {
      next_idx_cr = buffer.indexOf(C_cr, first_idx);
    }
    if (may_have_lf) {
      next_idx_lf = buffer.indexOf(C_lf, first_idx);
    }
    next_idx = buffer.length;
    //.........................................................................................................
    if (next_idx_cr === -1) {
      if (next_idx_lf === -1) {
        if (first_idx === 0) {
          return {
            material: buffer,
            eol,
            next_idx
          };
        }
      } else {
        next_idx = next_idx_lf;
        eol = C_lf_buffer;
      }
    //.........................................................................................................
    } else if ((next_idx_lf === -1) || (next_idx_cr < next_idx_lf)) {
      next_idx = next_idx_cr;
      eol = C_cr_buffer;
    } else {
      //.........................................................................................................
      next_idx = next_idx_lf;
      eol = C_lf_buffer;
    }
    //.........................................................................................................
    material = buffer.subarray(first_idx, next_idx);
    return {
      material,
      eol,
      next_idx: next_idx + 1
    };
  };

  //===========================================================================================================

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

  //-----------------------------------------------------------------------------------------------------------
  _get_descriptor_types_and_methods = [
    {
      type: 'file',
      method_name: 'isFile'
    },
    {
      type: 'folder',
      method_name: 'isDirectory'
    },
    {
      type: 'block',
      method_name: 'isBlockDevice'
    },
    {
      type: 'character',
      method_name: 'isCharacterDevice'
    },
    {
      type: 'fifo',
      method_name: 'isFIFO'
    },
    {
      type: 'socket',
      method_name: 'isSocket'
    }
  ];

  //-----------------------------------------------------------------------------------------------------------
  this._get_descriptor = function(path) {
    var FS, is_loop, link, lstat, stat, type;
    FS = require('node:fs');
    type = null;
    link = false;
    is_loop = false;
    //.........................................................................................................
    [lstat, link] = (() => {
      var error;
      try {
        lstat = FS.lstatSync(path);
      } catch (error1) {
        error = error1;
        if (error.code === 'ENOENT') {
          return [null, false];
        }
        throw error;
      }
      return [lstat, lstat.isSymbolicLink()];
    })();
    if (lstat == null) {
      //.........................................................................................................
      return {type, link, is_loop};
    }
    //.........................................................................................................
    if (link) {
      [stat, is_loop] = (() => {
        var error;
        try {
          stat = FS.statSync(path);
        } catch (error1) {
          error = error1;
          if (error.code === 'ELOOP') {
            return [null, true];
          }
          if (error.code === 'ENOENT') {
            return [null, false];
          }
          throw error;
        }
        return [stat, false];
      })();
    }
    if (is_loop == null) {
      is_loop = false;
    }
    if (is_loop || (!link)) {
      stat = lstat;
    }
    if ((stat == null) && (!is_loop)) {
      return {
        type: 'link',
        link,
        is_loop
      };
    }
    type = (() => {
      var i, len, method_name;
      for (i = 0, len = _get_descriptor_types_and_methods.length; i < len; i++) {
        ({type, method_name} = _get_descriptor_types_and_methods[i]);
        if (stat[method_name]()) {
          return type;
        }
      }
      return null;
    })();
    //.........................................................................................................
    if (type == null) {
      type = 'link';
    }
    return {type, link, is_loop};
  };

  //-----------------------------------------------------------------------------------------------------------
  this.get_descriptor = function(...P) {
    return this._get_descriptor(...P);
  };

  // #-----------------------------------------------------------------------------------------------------------
// get_long_file_descriptor = ( P... ) ->
//   throw new Error "not implemented"
//   { dsc, stats } = _get_descriptor P...
// dev: 2114n,
// ino: 48064969n,
// mode: 33188n,
// nlink: 1n,
// uid: 85n,
// gid: 100n,
// rdev: 0n,
// size: 527n,
// blksize: 4096n,
// blocks: 8n,
// atimeMs: 1318289051000n,
// mtimeMs: 1318289051000n,
// ctimeMs: 1318289051000n,
// birthtimeMs: 1318289051000n,
// atimeNs: 1318289051000000000n,
// mtimeNs: 1318289051000000000n,
// ctimeNs: 1318289051000000000n,
// birthtimeNs: 1318289051000000000n,
// atime: Mon, 10 Oct 2011 23:24:11 GMT,
// mtime: Mon, 10 Oct 2011 23:24:11 GMT,
// ctime: Mon, 10 Oct 2011 23:24:11 GMT,
// birthtime: Mon, 10 Oct 2011 23:24:11 GMT

}).call(this);

//# sourceMappingURL=fs.js.map