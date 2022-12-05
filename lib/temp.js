(function() {
  'use strict';
  var H, debug, defaults;

  //###########################################################################################################
  H = require('./_helpers');

  debug = console.log;

  defaults = {
    keep: false,
    prefix: 'guy.temp-',
    suffix: ''
  };

  //-----------------------------------------------------------------------------------------------------------
  this.with_file = function(cfg, handler) {
    var arity, type;
    switch (arity = arguments.length) {
      case 1:
        [cfg, handler] = [null, cfg];
        break;
      case 2:
        null;
        break;
      default:
        throw new Error(`expected 1 or 2 arguments, got ${arity}`);
    }
    cfg = {...defaults, ...cfg};
    type = Object.prototype.toString.call(handler);
    if (type === '[object AsyncFunction]') {
      return this._with_file_async(cfg, handler);
    }
    if (type === '[object Function]') {
      return this._with_file_sync(cfg, handler);
    }
    throw new Error(`^guy.temp@1^ expected an (sync or async) function, got a ${type}`);
  };

  //-----------------------------------------------------------------------------------------------------------
  this.with_directory = function(cfg, handler) {
    var arity, type;
    switch (arity = arguments.length) {
      case 1:
        [cfg, handler] = [null, cfg];
        break;
      case 2:
        null;
        break;
      default:
        throw new Error(`expected 1 or 2 arguments, got ${arity}`);
    }
    cfg = {...defaults, ...cfg};
    type = Object.prototype.toString.call(handler);
    if (type === '[object AsyncFunction]') {
      return this._with_directory_async(cfg, handler);
    }
    if (type === '[object Function]') {
      return this._with_directory_sync(cfg, handler);
    }
    throw new Error(`^guy.temp@2^ expected an (sync or async) function, got a ${type}`);
  };

  //-----------------------------------------------------------------------------------------------------------
  this._with_file_sync = function(cfg, handler) {
    var TEMP, fd, path, removeCallback;
    TEMP = require('tmp');
    ({
      name: path,
      fd,
      removeCallback
    } = TEMP.fileSync(cfg));
    try {
      handler({path, fd});
    } finally {
      if (!cfg.keep) {
        removeCallback();
      }
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this._with_directory_sync = function(cfg, handler) {
    var FS, TEMP, path;
    FS = require('node:fs');
    TEMP = require('tmp');
    ({
      name: path
    } = TEMP.dirSync(cfg));
    try {
      handler({path});
    } finally {
      if (!cfg.keep) {
        FS.rmSync(path, {
          recursive: true
        });
      }
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this._with_file_async = async function(cfg, handler) {
    var TEMP, fd, path, removeCallback;
    TEMP = require('tmp');
    ({
      name: path,
      fd,
      removeCallback
    } = TEMP.fileSync(cfg));
    try {
      await handler({path, fd});
    } finally {
      if (!cfg.keep) {
        removeCallback();
      }
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this._with_directory_async = async function(cfg, handler) {
    var FS, TEMP, arity, path;
    switch (arity = arguments.length) {
      case 1:
        [cfg, handler] = [null, cfg];
        break;
      case 2:
        null;
        break;
      default:
        throw new Error(`expected 1 or 2 arguments, got ${arity}`);
    }
    cfg = {...defaults, ...cfg};
    FS = require('node:fs');
    TEMP = require('tmp');
    ({
      name: path
    } = TEMP.dirSync(cfg));
    try {
      await handler({path});
    } finally {
      if (!cfg.keep) {
        FS.rmSync(path, {
          recursive: true
        });
      }
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.with_shadow_file = function(original_path, handler) {
    var cfg, type;
    if ((type = Object.prototype.toString.call(original_path)) === '[object Object]') {
      cfg = {
        path: null,
        all: false,
        ...original_path
      };
      return this._with_shadow_file(cfg.path, cfg.all, handler);
    }
    return this._with_shadow_file(original_path, false, handler);
  };

  //-----------------------------------------------------------------------------------------------------------
  this._with_shadow_file = function(original_path, all, handler) {
    var type;
    type = Object.prototype.toString.call(handler);
    if (type === '[object AsyncFunction]') {
      return this._with_shadow_file_async(original_path, all, handler);
    }
    if (type === '[object Function]') {
      return this._with_shadow_file_sync(original_path, all, handler);
    }
    throw new Error(`^guy.temp@3^ expected an (sync or async) function, got a ${type}`);
  };

  //-----------------------------------------------------------------------------------------------------------
  this._with_shadow_file_sync = function(original_path, all, handler) {
    /* TAINT check that original_path is nonexistent or file path, not directory */
    var FS, GFS, PATH, real_path;
    GFS = require('./fs');
    FS = require('node:fs');
    PATH = require('node:path');
    real_path = FS.realpathSync(original_path);
    this.with_directory(function({
        path: folder_path
      }) {
      var base_name, filename, i, len, real_folder_path, ref, results, source_path, target_path, temp_path;
      base_name = PATH.basename(real_path);
      temp_path = PATH.join(folder_path, base_name);
      FS.copyFileSync(real_path, temp_path);
      handler({
        path: temp_path
      });
      if (all) {
        real_folder_path = PATH.dirname(real_path);
        ref = FS.readdirSync(folder_path);
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          filename = ref[i];
          source_path = PATH.join(folder_path, filename);
          target_path = PATH.join(real_folder_path, filename);
          if (!(FS.lstatSync(source_path)).isFile()) {
            continue;
          }
          results.push(GFS.rename_sync(source_path, target_path));
        }
        return results;
      } else {
        return GFS.rename_sync(temp_path, real_path);
      }
    });
    return null;
  };

  // #-----------------------------------------------------------------------------------------------------------
// @with_shadow_files = ( original_paths..., handler ) ->
//   unless ( arity = arguments.length ) > 1
//     throw new Error "^guy.temp@1^ expected 2 or more arguments, got #{arity}"
//   type = Object::toString.call handler
//   return @_with_shadow_files_async original_paths, handler if type is '[object AsyncFunction]'
//   return @_with_shadow_files_sync  original_paths, handler if type is '[object Function]'
//   throw new Error "^guy.temp@3^ expected an (sync or async) function, got a #{type}"

  // #-----------------------------------------------------------------------------------------------------------
// @_with_shadow_files_sync = ( original_paths, handler ) ->
//   ### TAINT check that original_path is nonexistent or file path, not directory ###
//   GFS           = require './fs'
//   FS            = require 'node:fs'
//   PATH          = require 'node:path'
//   paths         = []
//   real_paths    = original_paths # ( FS.realpathSync original_path for original_path in original_paths )
//   @with_directory ({ path: folder_path, }) ->
//     temp_paths = []
//     for real_path in real_paths
//       base_name = PATH.basename real_path
//       temp_path = PATH.join folder_path, base_name
//       FS.copyFileSync real_path, temp_path
//       temp_paths.push temp_path
//     handler { paths: temp_paths, }
//     for temp_path, idx in temp_paths
//       real_path = real_paths[ idx ]
//       if safe_is_file FS, temp_path then  GFS.rename_sync temp_path,  real_path
//       else                                FS.unlinkSync               real_path
//   return null

  // #-----------------------------------------------------------------------------------------------------------
// safe_is_file = ( FS, path ) ->
//   try return ( FS.lstatSync path ).isFile() catch error
//     throw error if error.code isnt 'ENOENT'
//   return false

}).call(this);

//# sourceMappingURL=temp.js.map