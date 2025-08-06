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
    var buffer, y;
    for (y of this.walk_buffers_with_positions(path, cfg)) {
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
    var line, y;
    for (y of this.walk_lines_with_positions(path, cfg)) {
      ({line} = y);
      yield line;
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.walk_lines_with_positions = function*(path, cfg) {
    var append, chunk_size, count, d, encoding, prepend, trim;
    H.types.validate.guy_fs_walk_lines_cfg((cfg = {...defaults.guy_fs_walk_lines_cfg, ...cfg}));
    H.types.validate.nonempty_text(path);
    ({chunk_size, encoding, trim, prepend, append} = cfg);
    //.........................................................................................................
    count = 0;
    for (d of this._walk_lines_with_positions(path, chunk_size)) {
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
    var buffer, eol, eol_cache, file_byte_idx, flush, has_extra_cr, line_cache, lnr, material, y, z;
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
//.........................................................................................................
    for (y of this.walk_buffers_with_positions(path, {chunk_size})) {
      ({
        buffer,
        byte_idx: file_byte_idx
      } = y);
// debug '^_walk_lines_with_positions@23-4^', byte_idx, ( rpr buffer.toString() )
// offset_bytes = 0
      for (z of this._walk_lines__walk_advancements(buffer)) {
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
    var line, line_count, loop_count;
    H.types.validate.guy_walk_circular_lines_cfg((cfg = {...defaults.guy_walk_circular_lines_cfg, ...cfg}));
    if ((cfg.line_count === 0) || (cfg.loop_count === 0)) {
      return;
    }
    line_count = 0;
    loop_count = 0;
    while (true) {
      for (line of this.walk_lines(path, {
        decode: cfg.decode
      })) {
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2ZzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQTtFQUFBO0FBQUEsTUFBQSxJQUFBLEVBQUEsV0FBQSxFQUFBLGNBQUEsRUFBQSxjQUFBLEVBQUEsSUFBQSxFQUFBLFdBQUEsRUFBQSxDQUFBLEVBQUEsaUNBQUEsRUFBQSxLQUFBLEVBQUEsUUFBQSxFQUFBLE1BQUEsRUFBQSxRQUFBLEVBQUEsR0FBQTs7O0VBR0EsQ0FBQSxHQUE0QixPQUFBLENBQVEsWUFBUjs7RUFDNUIsTUFBQSxHQUE0QixNQUFBLENBQU8sUUFBUDs7RUFDNUIsUUFBQSxHQUE0QixDQUFFLE9BQUEsQ0FBUSxJQUFSLENBQUYsQ0FBZ0IsQ0FBQyxRQUFqQixDQUFBOztFQUM1QixHQUFBLEdBQTRCLENBQUUsT0FBQSxDQUFRLE1BQVIsQ0FBRixDQUFrQixDQUFDOztFQUMvQyxLQUFBLEdBQTRCLE9BQU8sQ0FBQyxJQVBwQzs7OztFQVVBLElBQUEsR0FBNEIsSUFBQyxDQUFBLEtBQUQsR0FBb0I7O0VBQ2hELElBQUEsR0FBNEIsSUFBQyxDQUFBLEtBQUQsR0FBb0I7O0VBQ2hELGNBQUEsR0FBNEIsSUFBQyxDQUFBLGVBQUQsR0FBb0I7O0VBQ2hELGNBQUEsR0FBNEIsSUFBQyxDQUFBLGVBQUQsR0FBb0IsTUFBTSxDQUFDLElBQVAsQ0FBWSxjQUFaOztFQUNoRCxXQUFBLEdBQTRCLElBQUMsQ0FBQSxZQUFELEdBQW9CLE1BQU0sQ0FBQyxJQUFQLENBQVksQ0FBRSxJQUFGLENBQVo7O0VBQ2hELFdBQUEsR0FBNEIsSUFBQyxDQUFBLFlBQUQsR0FBb0IsTUFBTSxDQUFDLElBQVAsQ0FBWSxDQUFFLElBQUYsQ0FBWixFQWZoRDs7O0VBa0JBLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBUixDQUFnQixnQkFBaEIsRUFBa0MsUUFBQSxDQUFFLENBQUYsQ0FBQTtJQUNoQyxJQUFlLENBQUUsSUFBQyxDQUFBLEdBQUcsQ0FB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LFVBQVk7O0lBQ1osSUFBcUIsT0FBQSxJQUFXLENBQUUsQ0FBSSxJQUFOLENBQWhDO01BQUEsSUFBQSxHQUFZLE1BQVo7O0lBQ0EsSUFBMkMsQ0FBTSxZQUFOLENBQUEsSUFBa0IsQ0FBRSxDQUFJLE9BQU4sQ0FBN0Q7QUFBQSxhQUFPO1FBQUUsSUFBQSxFQUFNLE1BQVI7UUFBZ0IsSUFBaEI7UUFBc0I7TUFBdEIsRUFBUDs7SUFDQSxJQUFBLEdBQVUsQ0FBQSxDQUFBLENBQUEsR0FBQTtBQUNaLFVBQUEsQ0FBQSxFQUFBLEdBQUEsRUFBQTtNQUFJLEtBQUEsbUVBQUE7U0FBSSxDQUFFLElBQUYsRUFBUSxXQUFSO1FBQ0YsSUFBZSxJQUFJLENBQUUsV0FBRixDQUFKLENBQUEsQ0FBZjtBQUFBLGlCQUFPLEtBQVA7O01BREY7QUFFQSxhQUFPO0lBSEMsQ0FBQSxJQXRCWjs7O01BMkJFLE9BQVE7O0FBQ1IsV0FBTyxDQUFFLElBQUYsRUFBUSxJQUFSLEVBQWMsT0FBZDtFQTdCVSxFQTdRbkI7OztFQTZTQSxJQUFDLENBQUEsY0FBRCxHQUFrQixRQUFBLENBQUEsR0FBRSxDQUFGLENBQUE7V0FBWSxJQUFDLENBQUEsZUFBRCxDQUFpQixHQUFBLENBQWpCO0VBQVo7O0VBN1NsQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSIsInNvdXJjZXNDb250ZW50IjpbIlxuJ3VzZSBzdHJpY3QnXG5cbiMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuSCAgICAgICAgICAgICAgICAgICAgICAgICA9IHJlcXVpcmUgJy4vX2hlbHBlcnMnXG5taXNmaXQgICAgICAgICAgICAgICAgICAgID0gU3ltYm9sICdtaXNmaXQnXG5wbGF0Zm9ybSAgICAgICAgICAgICAgICAgID0gKCByZXF1aXJlICdvcycgKS5wbGF0Zm9ybSgpXG5ycHIgICAgICAgICAgICAgICAgICAgICAgID0gKCByZXF1aXJlICd1dGlsJyApLmluc3BlY3RcbmRlYnVnICAgICAgICAgICAgICAgICAgICAgPSBjb25zb2xlLmxvZ1xuIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4jIyMgQ29uc3RhbnRzOiAjIyNcbkNfY3IgICAgICAgICAgICAgICAgICAgICAgPSBAX0NfY3IgICAgICAgICAgICA9IDB4MGRcbkNfbGYgICAgICAgICAgICAgICAgICAgICAgPSBAX0NfbGYgICAgICAgICAgICA9IDB4MGFcbkNfZW1wdHlfc3RyaW5nICAgICAgICAgICAgPSBAX0NfZW1wdHlfc3RyaW5nICA9ICcnXG5DX2VtcHR5X2J1ZmZlciAgICAgICAgICAgID0gQF9DX2VtcHR5X2J1ZmZlciAgPSBCdWZmZXIuZnJvbSBDX2VtcHR5X3N0cmluZ1xuQ19jcl9idWZmZXIgICAgICAgICAgICAgICA9IEBfQ19jcl9idWZmZXIgICAgID0gQnVmZmVyLmZyb20gWyBDX2NyLCBdXG5DX2xmX2J1ZmZlciAgICAgICAgICAgICAgID0gQF9DX2xmX2J1ZmZlciAgICAgPSBCdWZmZXIuZnJvbSBbIENfbGYsIF1cblxuIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5ILnR5cGVzLmRlY2xhcmUgJ2d1eV9idWZmZXJfY2hyJywgKCB4ICkgLT5cbiAgcmV0dXJuIHRydWUgaWYgKCBAaXNhLmludGVnZXIgeCApIGFuZCAoIDB4MDAgPD0geCA8PSAweGZmIClcbiAgcmV0dXJuIHRydWUgaWYgKCBAaXNhLmJ1ZmZlciAgeCApIGFuZCAoIHgubGVuZ3RoID4gMCApXG4gIHJldHVybiB0cnVlIGlmICggQGlzYS50ZXh0ICAgIHggKSBhbmQgKCB4Lmxlbmd0aCA+IDAgKVxuICByZXR1cm4gZmFsc2VcblxuIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5ILnR5cGVzLmRlY2xhcmUgJ2d1eV9mc193YWxrX2J1ZmZlcnNfY2ZnJywgdGVzdHM6XG4gIFwiQGlzYS5wb3NpdGl2ZV9pbnRlZ2VyIHguY2h1bmtfc2l6ZVwiOiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoIHggKSAtPiBAaXNhLnBvc2l0aXZlX2ludGVnZXIgeC5jaHVua19zaXplXG5cbiMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuSC50eXBlcy5kZWNsYXJlICdndXlfZnNfd2Fsa19saW5lc19jZmcnLCB0ZXN0czpcbiAgXCJAaXNhLm9iamVjdCB4XCI6ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICggeCApIC0+IEBpc2Eub2JqZWN0IHhcbiAgXCJAaXNhX29wdGlvbmFsLm5vbmVtcHR5X3RleHQgeC5lbmNvZGluZ1wiOiAgICAgICAgICAgICAgICAgICAgICAgICAgICggeCApIC0+IEBpc2Ffb3B0aW9uYWwubm9uZW1wdHlfdGV4dCB4LmVuY29kaW5nXG4gIFwiQGlzYS5wb3NpdGl2ZV9pbnRlZ2VyIHguY2h1bmtfc2l6ZVwiOiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoIHggKSAtPiBAaXNhLnBvc2l0aXZlX2ludGVnZXIgeC5jaHVua19zaXplXG4gIFwiQGlzYS5ib29sZWFuIHgudHJpbVwiOiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoIHggKSAtPiBAaXNhLmJvb2xlYW4geC50cmltXG4gIFwiQGlzYS50ZXh0IHgucHJlcGVuZFwiOiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoIHggKSAtPiBAaXNhLnRleHQgeC5wcmVwZW5kXG4gIFwiQGlzYS50ZXh0IHguYXBwZW5kXCI6ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoIHggKSAtPiBAaXNhLnRleHQgeC5hcHBlbmRcblxuIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5ILnR5cGVzLmRlY2xhcmUgJ2d1eV93YWxrX2NpcmN1bGFyX2xpbmVzX2NmZycsIHRlc3RzOlxuICBcIkBpc2Eub2JqZWN0IHhcIjogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKCB4ICkgLT4gQGlzYS5vYmplY3QgeFxuICBcIkBpc2EuYm9vbGVhbiB4LmRlY29kZVwiOiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKCB4ICkgLT4gQGlzYS5ib29sZWFuIHguZGVjb2RlXG4gIFwiKCB4Lmxvb3BfY291bnQgaXMgK0luZmluaXR5ICkgb3IgKCBAaXNhLmNhcmRpbmFsIHgubG9vcF9jb3VudCApXCI6ICAoIHggKSAtPiAoIHgubG9vcF9jb3VudCBpcyArSW5maW5pdHkgKSBvciAoIEBpc2EuY2FyZGluYWwgeC5sb29wX2NvdW50IClcbiAgXCIoIHgubGluZV9jb3VudCBpcyArSW5maW5pdHkgKSBvciAoIEBpc2EuY2FyZGluYWwgeC5saW5lX2NvdW50IClcIjogICggeCApIC0+ICggeC5saW5lX2NvdW50IGlzICtJbmZpbml0eSApIG9yICggQGlzYS5jYXJkaW5hbCB4LmxpbmVfY291bnQgKVxuXG4jLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbkgudHlwZXMuZGVjbGFyZSAnZ3V5X2dldF9jb250ZW50X2hhc2hfY2ZnJywgdGVzdHM6XG4gIFwiQGlzYS5vYmplY3QgeFwiOiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoIHggKSAtPiBAaXNhLm9iamVjdCB4XG4gIFwiQGlzYS5jYXJkaW5hbCB4Lmxlbmd0aFwiOiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoIHggKSAtPiBAaXNhLmNhcmRpbmFsIHgubGVuZ3RoXG5cbiMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZGVmYXVsdHMgPVxuICBndXlfZnNfd2Fsa19idWZmZXJzX2NmZzpcbiAgICBjaHVua19zaXplOiAgICAgMTYgKiAxMDI0XG4gIGd1eV9mc193YWxrX2xpbmVzX2NmZzpcbiAgICBlbmNvZGluZzogICAgICAgJ3V0Zi04J1xuICAgIGNodW5rX3NpemU6ICAgICAxNiAqIDEwMjRcbiAgICB0cmltOiAgICAgICAgICAgdHJ1ZVxuICAgIHByZXBlbmQ6ICAgICAgICAnJ1xuICAgIGFwcGVuZDogICAgICAgICAnJ1xuICBndXlfd2Fsa19jaXJjdWxhcl9saW5lc19jZmc6XG4gICAgZGVjb2RlOiAgICAgICAgIHRydWVcbiAgICBsb29wX2NvdW50OiAgICAgMVxuICAgIGxpbmVfY291bnQ6ICAgICArSW5maW5pdHlcbiAgZ3V5X2dldF9jb250ZW50X2hhc2hfY2ZnOlxuICAgIGxlbmd0aDogICAgICAgICAxN1xuICAgIGZhbGxiYWNrOiAgICAgICBtaXNmaXRcblxuIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5Ad2Fsa19idWZmZXJzID0gKCBwYXRoLCBjZmcgKSAtPlxuICBmb3IgeyBidWZmZXIsIH0gZnJvbSBAd2Fsa19idWZmZXJzX3dpdGhfcG9zaXRpb25zIHBhdGgsIGNmZ1xuICAgIHlpZWxkIGJ1ZmZlclxuICByZXR1cm4gbnVsbFxuXG4jLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbkB3YWxrX2J1ZmZlcnNfd2l0aF9wb3NpdGlvbnMgPSAoIHBhdGgsIGNmZyApIC0+XG4gIEgudHlwZXMudmFsaWRhdGUuZ3V5X2ZzX3dhbGtfYnVmZmVyc19jZmcgKCBjZmcgPSB7IGRlZmF1bHRzLmd1eV9mc193YWxrX2J1ZmZlcnNfY2ZnLi4uLCBjZmcuLi4sIH0gKVxuICBILnR5cGVzLnZhbGlkYXRlLm5vbmVtcHR5X3RleHQgcGF0aFxuICB7IGNodW5rX3NpemUgfSA9IGNmZ1xuICBGUyAgICAgICAgICAgID0gcmVxdWlyZSAnbm9kZTpmcydcbiAgZmQgICAgICAgICAgICA9IEZTLm9wZW5TeW5jIHBhdGhcbiAgYnl0ZV9pZHggICAgICA9IDBcbiAgbG9vcFxuICAgIGJ1ZmZlciAgICAgID0gQnVmZmVyLmFsbG9jIGNodW5rX3NpemVcbiAgICBieXRlX2NvdW50ICA9IEZTLnJlYWRTeW5jIGZkLCBidWZmZXIsIDAsIGNodW5rX3NpemUsIGJ5dGVfaWR4XG4gICAgYnJlYWsgaWYgYnl0ZV9jb3VudCBpcyAwXG4gICAgYnVmZmVyICAgICAgPSBidWZmZXIuc3ViYXJyYXkgMCwgYnl0ZV9jb3VudCBpZiBieXRlX2NvdW50IDwgY2h1bmtfc2l6ZVxuICAgIHlpZWxkIHsgYnVmZmVyLCBieXRlX2lkeCwgfVxuICAgIGJ5dGVfaWR4ICAgKz0gYnl0ZV9jb3VudFxuICByZXR1cm4gbnVsbFxuXG4jLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbkB3YWxrX2xpbmVzID0gKCBwYXRoLCBjZmcgKSAtPlxuICBmb3IgeyBsaW5lLCB9IGZyb20gQHdhbGtfbGluZXNfd2l0aF9wb3NpdGlvbnMgcGF0aCwgY2ZnXG4gICAgeWllbGQgbGluZVxuICByZXR1cm4gbnVsbFxuXG4jLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbkB3YWxrX2xpbmVzX3dpdGhfcG9zaXRpb25zID0gKCBwYXRoLCBjZmcgKSAtPlxuICBILnR5cGVzLnZhbGlkYXRlLmd1eV9mc193YWxrX2xpbmVzX2NmZyAoIGNmZyA9IHsgZGVmYXVsdHMuZ3V5X2ZzX3dhbGtfbGluZXNfY2ZnLi4uLCBjZmcuLi4sIH0gKVxuICBILnR5cGVzLnZhbGlkYXRlLm5vbmVtcHR5X3RleHQgcGF0aFxuICB7IGNodW5rX3NpemVcbiAgICBlbmNvZGluZ1xuICAgIHRyaW1cbiAgICBwcmVwZW5kXG4gICAgYXBwZW5kICAgIH0gPSBjZmdcbiAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICBjb3VudCAgICAgICAgID0gMFxuICBmb3IgZCBmcm9tIEBfd2Fsa19saW5lc193aXRoX3Bvc2l0aW9ucyBwYXRoLCBjaHVua19zaXplXG4gICAgY291bnQrK1xuICAgIGlmIGVuY29kaW5nP1xuICAgICAgZC5saW5lICA9IGQubGluZS50b1N0cmluZyBlbmNvZGluZ1xuICAgICAgZC5saW5lICA9IGQubGluZS50cmltRW5kKCkgaWYgdHJpbVxuICAgICAgZC5saW5lICA9IHByZXBlbmQgKyBkLmxpbmUgIHVubGVzcyBwcmVwZW5kICBpcyAnJ1xuICAgICAgZC5saW5lICA9IGQubGluZSAgKyBhcHBlbmQgIHVubGVzcyBhcHBlbmQgICBpcyAnJ1xuICAgICAgZC5lb2wgICA9IGQuZW9sLnRvU3RyaW5nIGVuY29kaW5nXG4gICAgICB5aWVsZCBkXG4gICAgZWxzZVxuICAgICAgeWllbGQgZFxuICByZXR1cm4gbnVsbFxuXG4jLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbkBfd2Fsa19saW5lc193aXRoX3Bvc2l0aW9ucyA9ICggcGF0aCwgY2h1bmtfc2l6ZSA9IDE2ICogMTAyNCApIC0+XG4gIGxpbmVfY2FjaGUgICAgICAgID0gW11cbiAgZW9sX2NhY2hlICAgICAgICAgPSBbXVxuICBsbnIgICAgICAgICAgICAgICA9IDBcbiAgIyBvZmZzZXRfYnl0ZXMgICAgICA9IG51bGxcbiAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICBmbHVzaCA9ICggbWF0ZXJpYWwgPSBudWxsLCBlb2wgPSBudWxsICkgLT5cbiAgICAjIHJldHVybiBudWxsIGlmICggbGluZV9jYWNoZS5sZW5ndGggaXMgMCApIGFuZCAoIGVvbF9jYWNoZS5sZW5ndGggaXMgMCApXG4gICAgIyBieXRlX2lkeCAgICAgICAgICA9IGZpbGVfYnl0ZV9pZHggKyBvZmZzZXRfYnl0ZXNcbiAgICBsaW5lICAgICAgICAgICAgICA9IEJ1ZmZlci5jb25jYXQgaWYgbWF0ZXJpYWw/IHRoZW4gWyBsaW5lX2NhY2hlLi4uLCAgbWF0ZXJpYWwsIF0gZWxzZSBsaW5lX2NhY2hlXG4gICAgZW9sICAgICAgICAgICAgICAgPSBCdWZmZXIuY29uY2F0IGlmIGVvbD8gICAgICB0aGVuIFsgZW9sX2NhY2hlLi4uLCAgIGVvbCwgICAgICBdIGVsc2UgZW9sX2NhY2hlXG4gICAgbGluZV9jYWNoZS5sZW5ndGggPSAwXG4gICAgZW9sX2NhY2hlLmxlbmd0aCAgPSAwXG4gICAgbG5yKytcbiAgICAjIHlpZWxkIHsgYnl0ZV9pZHgsIGxuciwgbGluZSwgZW9sLCB9XG4gICAgeWllbGQgeyBsbnIsIGxpbmUsIGVvbCwgfVxuICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gIGZvciB7IGJ1ZmZlciwgYnl0ZV9pZHg6IGZpbGVfYnl0ZV9pZHgsIH0gZnJvbSBAd2Fsa19idWZmZXJzX3dpdGhfcG9zaXRpb25zIHBhdGgsIHsgY2h1bmtfc2l6ZSwgfVxuICAgICMgZGVidWcgJ15fd2Fsa19saW5lc193aXRoX3Bvc2l0aW9uc0AyMy00XicsIGJ5dGVfaWR4LCAoIHJwciBidWZmZXIudG9TdHJpbmcoKSApXG4gICAgIyBvZmZzZXRfYnl0ZXMgPSAwXG4gICAgZm9yIHsgbWF0ZXJpYWwsIGVvbCwgfSBmcm9tIEBfd2Fsa19saW5lc19fd2Fsa19hZHZhbmNlbWVudHMgYnVmZmVyXG4gICAgICAjIGRlYnVnICdeX3dhbGtfbGluZXNfd2l0aF9wb3NpdGlvbnNAMjMtNF4nLCB7IGZpbGVfYnl0ZV9pZHgsIG9mZnNldF9ieXRlcywgfSwgKCBycHIgbWF0ZXJpYWwudG9TdHJpbmcoKSApLCAoIHJwciBlb2wudG9TdHJpbmcoKSApXG4gICAgICBpZiAoIGVvbF9jYWNoZS5sZW5ndGggPiAwICkgYW5kIG5vdCAoICggKCBlb2xfY2FjaGUuYXQgLTEgKSBpcyBDX2NyX2J1ZmZlciApIGFuZCBlb2wgaXMgQ19sZl9idWZmZXIgKVxuICAgICAgICB5aWVsZCBmcm9tIGZsdXNoKClcbiAgICAgIHN3aXRjaCBlb2xcbiAgICAgICAgd2hlbiBDX2NyX2J1ZmZlclxuICAgICAgICAgIGxpbmVfY2FjaGUucHVzaCBtYXRlcmlhbCBpZiBtYXRlcmlhbC5sZW5ndGggID4gMFxuICAgICAgICAgIGVvbF9jYWNoZS5wdXNoIGVvbFxuICAgICAgICB3aGVuIENfbGZfYnVmZmVyXG4gICAgICAgICAgeWllbGQgZnJvbSBmbHVzaCBtYXRlcmlhbCwgZW9sXG4gICAgICAgIHdoZW4gQ19lbXB0eV9idWZmZXJcbiAgICAgICAgICBsaW5lX2NhY2hlLnB1c2ggbWF0ZXJpYWwgaWYgbWF0ZXJpYWwubGVuZ3RoICA+IDBcbiAgICAgICAgZWxzZSB0aHJvdyBuZXcgRXJyb3IgXCJeNjM2NDU2XiBpbnRlcm5hbCBlcnJvclwiXG4gICAgICAjIG9mZnNldF9ieXRlcyArPSBtYXRlcmlhbC5sZW5ndGggKyBlb2wubGVuZ3RoXG4gICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgaGFzX2V4dHJhX2NyID0gKCBlb2xfY2FjaGUubGVuZ3RoID4gMCApIGFuZCAoICggZW9sX2NhY2hlLmF0IC0xICkgaXMgQ19jcl9idWZmZXIgKVxuICB5aWVsZCBmcm9tIGZsdXNoKClcbiAgaWYgaGFzX2V4dHJhX2NyXG4gICAgbG5yKytcbiAgICB5aWVsZCB7IGxuciwgbGluZTogQ19lbXB0eV9idWZmZXIsIGVvbDogQ19lbXB0eV9idWZmZXIsIH1cbiAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICByZXR1cm4gbnVsbFxuXG4jLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbkBfd2Fsa19saW5lc19fd2Fsa19hZHZhbmNlbWVudHMgPSAoIGJ1ZmZlciwgbWF5X2hhdmVfY3IgPSB0cnVlLCBtYXlfaGF2ZV9sZiA9IHRydWUgKSAtPlxuICBmaXJzdF9pZHggICA9IDBcbiAgbGFzdF9pZHggICAgPSBidWZmZXIubGVuZ3RoIC0gMVxuICBsb29wXG4gICAgYnJlYWsgaWYgZmlyc3RfaWR4ID4gbGFzdF9pZHhcbiAgICB5aWVsZCBkID0gQF93YWxrX2xpbmVzX19hZHZhbmNlIGJ1ZmZlciwgZmlyc3RfaWR4LCBtYXlfaGF2ZV9jciwgbWF5X2hhdmVfbGZcbiAgICBmaXJzdF9pZHggPSBkLm5leHRfaWR4XG4gIHJldHVybiBudWxsXG5cbiMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIyMjIFRBSU5UIGFkZCBtYXlfaGF2ZV9jciwgbWF5X2hhdmVfbGYgYXMgb3B0aW1pemF0aW9uIHRvIGZvcmVnbyByZXBlYXRlZCB1bm5lY2Vzc2FyeSBsb29rdXBzICMjI1xuQF93YWxrX2xpbmVzX19hZHZhbmNlID0gKCBidWZmZXIsIGZpcnN0X2lkeCwgbWF5X2hhdmVfY3IgPSB0cnVlLCBtYXlfaGF2ZV9sZiA9IHRydWUgKSAtPlxuICBtYXRlcmlhbCAgICA9IENfZW1wdHlfYnVmZmVyXG4gIGVvbCAgICAgICAgID0gQ19lbXB0eV9idWZmZXJcbiAgbmV4dF9pZHhfY3IgPSAtMVxuICBuZXh0X2lkeF9sZiA9IC0xXG4gIG5leHRfaWR4X2NyID0gYnVmZmVyLmluZGV4T2YgQ19jciwgZmlyc3RfaWR4IGlmIG1heV9oYXZlX2NyXG4gIG5leHRfaWR4X2xmID0gYnVmZmVyLmluZGV4T2YgQ19sZiwgZmlyc3RfaWR4IGlmIG1heV9oYXZlX2xmXG4gIG5leHRfaWR4ICAgID0gYnVmZmVyLmxlbmd0aFxuICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gIGlmIG5leHRfaWR4X2NyIGlzIC0xXG4gICAgaWYgbmV4dF9pZHhfbGYgaXMgLTFcbiAgICAgIHJldHVybiB7IG1hdGVyaWFsOiBidWZmZXIsIGVvbCwgbmV4dF9pZHgsIH0gaWYgZmlyc3RfaWR4IGlzIDBcbiAgICBlbHNlXG4gICAgICBuZXh0X2lkeCAgICA9IG5leHRfaWR4X2xmXG4gICAgICBlb2wgICAgICAgICA9IENfbGZfYnVmZmVyXG4gICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgZWxzZSBpZiAoIG5leHRfaWR4X2xmIGlzIC0xICkgb3IgKCBuZXh0X2lkeF9jciA8IG5leHRfaWR4X2xmIClcbiAgICBuZXh0X2lkeCAgICA9IG5leHRfaWR4X2NyXG4gICAgZW9sICAgICAgICAgPSBDX2NyX2J1ZmZlclxuICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gIGVsc2VcbiAgICBuZXh0X2lkeCAgICA9IG5leHRfaWR4X2xmXG4gICAgZW9sICAgICAgICAgPSBDX2xmX2J1ZmZlclxuICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gIG1hdGVyaWFsID0gYnVmZmVyLnN1YmFycmF5IGZpcnN0X2lkeCwgbmV4dF9pZHhcbiAgcmV0dXJuIHsgbWF0ZXJpYWwsIGVvbCwgbmV4dF9pZHg6IG5leHRfaWR4ICsgMSwgfVxuXG5cbiM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuI1xuIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5Ad2Fsa19jaXJjdWxhcl9saW5lcyA9ICggcGF0aCwgY2ZnICkgLT5cbiAgSC50eXBlcy52YWxpZGF0ZS5ndXlfd2Fsa19jaXJjdWxhcl9saW5lc19jZmcgKCBjZmcgPSB7IGRlZmF1bHRzLmd1eV93YWxrX2NpcmN1bGFyX2xpbmVzX2NmZy4uLiwgY2ZnLi4uLCB9IClcbiAgcmV0dXJuIGlmICggY2ZnLmxpbmVfY291bnQgaXMgMCApIG9yICggY2ZnLmxvb3BfY291bnQgaXMgMCApXG4gIGxpbmVfY291bnQgPSAwXG4gIGxvb3BfY291bnQgPSAwXG4gIGxvb3BcbiAgICBmb3IgbGluZSBmcm9tIEB3YWxrX2xpbmVzIHBhdGgsIHsgZGVjb2RlOiBjZmcuZGVjb2RlLCB9XG4gICAgICB5aWVsZCBsaW5lXG4gICAgICBsaW5lX2NvdW50Kys7IHJldHVybiBudWxsIGlmIGxpbmVfY291bnQgPj0gY2ZnLmxpbmVfY291bnRcbiAgICBsb29wX2NvdW50Kys7IHJldHVybiBudWxsIGlmIGxvb3BfY291bnQgPj0gY2ZnLmxvb3BfY291bnRcbiAgcmV0dXJuIG51bGxcblxuIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5AZ2V0X2ZpbGVfc2l6ZSA9ICggcGF0aCwgZmFsbGJhY2sgPSBtaXNmaXQgKSAtPlxuICBILnR5cGVzLnZhbGlkYXRlLm5vbmVtcHR5X3RleHQgcGF0aFxuICB0cnkgcmV0dXJuICggKCByZXF1aXJlICdmcycgKS5zdGF0U3luYyBwYXRoICkuc2l6ZSBjYXRjaCBlcnJvclxuICAgIHRocm93IGVycm9yIGlmICggZmFsbGJhY2sgaXMgbWlzZml0IClcbiAgICB0aHJvdyBlcnJvciBpZiAoIGVycm9yLmNvZGUgaXNudCAnRU5PRU5UJyApXG4gIHJldHVybiBmYWxsYmFja1xuXG4jLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbkBnZXRfY29udGVudF9oYXNoID0gKCBwYXRoLCBjZmcgKSAtPlxuICBILnR5cGVzLnZhbGlkYXRlLm5vbmVtcHR5X3RleHQgcGF0aFxuICBILnR5cGVzLnZhbGlkYXRlLmd1eV9nZXRfY29udGVudF9oYXNoX2NmZyAoIGNmZyA9IHsgZGVmYXVsdHMuZ3V5X2dldF9jb250ZW50X2hhc2hfY2ZnLi4uLCBjZmcuLi4sIH0gKVxuICBDUCAgICAgICAgPSByZXF1aXJlICdjaGlsZF9wcm9jZXNzJ1xuICBjb21tYW5kICAgPSBpZiBwbGF0Zm9ybSBpcyAnbGludXgnIHRoZW4gJ3NoYTFzdW0nIGVsc2UgJ3NoYXN1bSdcbiAgcmVzdWx0ICAgID0gQ1Auc3Bhd25TeW5jIGNvbW1hbmQsIFsgJy1iJywgcGF0aCwgXVxuICBpZiByZXN1bHQuc3RhdHVzIGlzbnQgMFxuICAgIHJldHVybiBjZmcuZmFsbGJhY2sgdW5sZXNzIGNmZy5mYWxsYmFjayBpcyBtaXNmaXRcbiAgICBpZiByZXN1bHQuc3RkZXJyP1xuICAgICAgdGhyb3cgbmV3IEVycm9yIFwiXmd1eS5mcy5nZXRfY29udGVudF9oYXNoQDFeIFwiICsgcmVzdWx0LnN0ZGVyci50b1N0cmluZyAndXRmLTgnXG4gICAgZWxzZVxuICAgICAgdGhyb3cgbmV3IEVycm9yIFwiXmd1eS5mcy5nZXRfY29udGVudF9oYXNoQDFeIFwiICsgKCByZXF1aXJlICd1dGlsJyApLmluc3BlY3QgcmVzdWx0LmVycm9yXG4gIFIgPSByZXN1bHRcbiAgUiA9IFIuc3Rkb3V0LnRvU3RyaW5nICd1dGYtOCdcbiAgUiA9IFIucmVwbGFjZSAvXFxzLiokLywgJydcbiAgUiA9IFJbIC4uLiBjZmcubGVuZ3RoIF1cbiAgdW5sZXNzIFIubGVuZ3RoIGlzIGNmZy5sZW5ndGhcbiAgICB0aHJvdyBuZXcgRXJyb3IgXCJeZ3V5LmZzLmdldF9jb250ZW50X2hhc2hAMV4gdW5hYmxlIHRvIGdlbmVyYXRlIGhhc2ggb2YgbGVuZ3RoICN7Y2ZnLmxlbmd0aH0gdXNpbmcgI3tjb21tYW5kfVwiXG4gIHJldHVybiBSXG5cbiMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuQHJlbmFtZV9zeW5jID0gKCBmcm9tX3BhdGgsIHRvX3BhdGggKSAtPlxuICAjIyMgU2FtZSBhcyBgRlMucmVuYW1lU3luYygpYCwgYnV0IGZhbGxzIGJhY2sgdG8gYEZTLmNvcHlGaWxlU3luYygpYCwgYEZTLnVubGlua1N5bmMoKWAgaW4gY2FzZSBkZXZpY2VcbiAgYm91bmRhcmllcyBhcmUgY3Jvc3NlZC4gVGh4IHRvIGh0dHBzOi8vZ2l0aHViLmNvbS9zaW5kcmVzb3JodXMvbW92ZS1maWxlL2Jsb2IvbWFpbi9pbmRleC5qcyAjIyNcbiAgRlMgPSByZXF1aXJlICdub2RlOmZzJ1xuICB0cnkgRlMucmVuYW1lU3luYyBmcm9tX3BhdGgsIHRvX3BhdGggY2F0Y2ggZXJyb3JcbiAgICB0aHJvdyBlcnJvciB1bmxlc3MgZXJyb3IuY29kZSBpcyAnRVhERVYnXG4gICAgRlMuY29weUZpbGVTeW5jIGZyb21fcGF0aCwgdG9fcGF0aFxuICAgIEZTLnVubGlua1N5bmMgZnJvbV9wYXRoXG4gIHJldHVybiBudWxsXG5cbiMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuX2dldF9kZXNjcmlwdG9yX3R5cGVzX2FuZF9tZXRob2RzID0gW1xuICB7IHR5cGU6ICdmaWxlJywgICAgICAgbWV0aG9kX25hbWU6ICdpc0ZpbGUnLCAgICAgICAgICAgIH1cbiAgeyB0eXBlOiAnZm9sZGVyJywgICAgIG1ldGhvZF9uYW1lOiAnaXNEaXJlY3RvcnknLCAgICAgICB9XG4gIHsgdHlwZTogJ2Jsb2NrJywgICAgICBtZXRob2RfbmFtZTogJ2lzQmxvY2tEZXZpY2UnLCAgICAgfVxuICB7IHR5cGU6ICdjaGFyYWN0ZXInLCAgbWV0aG9kX25hbWU6ICdpc0NoYXJhY3RlckRldmljZScsIH1cbiAgeyB0eXBlOiAnZmlmbycsICAgICAgIG1ldGhvZF9uYW1lOiAnaXNGSUZPJywgICAgICAgICAgICB9XG4gIHsgdHlwZTogJ3NvY2tldCcsICAgICBtZXRob2RfbmFtZTogJ2lzU29ja2V0JywgICAgICAgICAgfSBdXG5cbiMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuQF9nZXRfZGVzY3JpcHRvciA9ICggcGF0aCApIC0+XG4gIEZTICAgICAgPSByZXF1aXJlICdub2RlOmZzJ1xuICB0eXBlICAgID0gbnVsbFxuICBsaW5rICAgID0gZmFsc2VcbiAgaXNfbG9vcCA9IGZhbHNlXG4gICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgWyBsc3RhdCwgbGluaywgXSA9IGRvID0+XG4gICAgdHJ5IGxzdGF0ID0gRlMubHN0YXRTeW5jIHBhdGggY2F0Y2ggZXJyb3JcbiAgICAgIHJldHVybiBbIG51bGwsIGZhbHNlLCAgXSBpZiBlcnJvci5jb2RlIGlzICdFTk9FTlQnXG4gICAgICB0aHJvdyBlcnJvclxuICAgIHJldHVybiBbIGxzdGF0LCBsc3RhdC5pc1N5bWJvbGljTGluaygpLCBdXG4gICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgcmV0dXJuIHsgdHlwZSwgbGluaywgaXNfbG9vcCwgfSB1bmxlc3MgbHN0YXQ/XG4gICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgaWYgbGluayB0aGVuIFsgc3RhdCwgaXNfbG9vcCwgXSA9IGRvID0+XG4gICAgdHJ5IHN0YXQgPSBGUy5zdGF0U3luYyBwYXRoIGNhdGNoIGVycm9yXG4gICAgICByZXR1cm4gWyBudWxsLCAgdHJ1ZSwgICBdIGlmIGVycm9yLmNvZGUgaXMgJ0VMT09QJ1xuICAgICAgcmV0dXJuIFsgbnVsbCwgIGZhbHNlLCAgXSBpZiBlcnJvci5jb2RlIGlzICdFTk9FTlQnXG4gICAgICB0aHJvdyBlcnJvclxuICAgIHJldHVybiBbIHN0YXQsIGZhbHNlLCBdXG4gIGlzX2xvb3AgID89IGZhbHNlXG4gIHN0YXQgICAgICA9IGxzdGF0IGlmIGlzX2xvb3Agb3IgKCBub3QgbGluayApXG4gIHJldHVybiB7IHR5cGU6ICdsaW5rJywgbGluaywgaXNfbG9vcCwgfSBpZiAoIG5vdCBzdGF0PyApIGFuZCAoIG5vdCBpc19sb29wIClcbiAgdHlwZSA9IGRvID0+XG4gICAgZm9yIHsgdHlwZSwgbWV0aG9kX25hbWUsIH0gaW4gX2dldF9kZXNjcmlwdG9yX3R5cGVzX2FuZF9tZXRob2RzXG4gICAgICByZXR1cm4gdHlwZSBpZiBzdGF0WyBtZXRob2RfbmFtZSBdKClcbiAgICByZXR1cm4gbnVsbFxuICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gIHR5cGUgPz0gJ2xpbmsnXG4gIHJldHVybiB7IHR5cGUsIGxpbmssIGlzX2xvb3AsIH1cblxuIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5AZ2V0X2Rlc2NyaXB0b3IgPSAoIFAuLi4gKSAtPiBAX2dldF9kZXNjcmlwdG9yIFAuLi5cblxuIyAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiMgZ2V0X2xvbmdfZmlsZV9kZXNjcmlwdG9yID0gKCBQLi4uICkgLT5cbiMgICB0aHJvdyBuZXcgRXJyb3IgXCJub3QgaW1wbGVtZW50ZWRcIlxuIyAgIHsgZHNjLCBzdGF0cyB9ID0gX2dldF9kZXNjcmlwdG9yIFAuLi5cbiMgZGV2OiAyMTE0bixcbiMgaW5vOiA0ODA2NDk2OW4sXG4jIG1vZGU6IDMzMTg4bixcbiMgbmxpbms6IDFuLFxuIyB1aWQ6IDg1bixcbiMgZ2lkOiAxMDBuLFxuIyByZGV2OiAwbixcbiMgc2l6ZTogNTI3bixcbiMgYmxrc2l6ZTogNDA5Nm4sXG4jIGJsb2NrczogOG4sXG4jIGF0aW1lTXM6IDEzMTgyODkwNTEwMDBuLFxuIyBtdGltZU1zOiAxMzE4Mjg5MDUxMDAwbixcbiMgY3RpbWVNczogMTMxODI4OTA1MTAwMG4sXG4jIGJpcnRodGltZU1zOiAxMzE4Mjg5MDUxMDAwbixcbiMgYXRpbWVOczogMTMxODI4OTA1MTAwMDAwMDAwMG4sXG4jIG10aW1lTnM6IDEzMTgyODkwNTEwMDAwMDAwMDBuLFxuIyBjdGltZU5zOiAxMzE4Mjg5MDUxMDAwMDAwMDAwbixcbiMgYmlydGh0aW1lTnM6IDEzMTgyODkwNTEwMDAwMDAwMDBuLFxuIyBhdGltZTogTW9uLCAxMCBPY3QgMjAxMSAyMzoyNDoxMSBHTVQsXG4jIG10aW1lOiBNb24sIDEwIE9jdCAyMDExIDIzOjI0OjExIEdNVCxcbiMgY3RpbWU6IE1vbiwgMTAgT2N0IDIwMTEgMjM6MjQ6MTEgR01ULFxuIyBiaXJ0aHRpbWU6IE1vbiwgMTAgT2N0IDIwMTEgMjM6MjQ6MTEgR01UXG5cblxuXG4iXX0=
//# sourceURL=../src/fs.coffee