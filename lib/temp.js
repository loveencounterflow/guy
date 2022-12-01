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
    var type;
    type = Object.prototype.toString.call(handler);
    if (type === '[object AsyncFunction]') {
      return this._with_shadow_file_async(original_path, handler);
    }
    if (type === '[object Function]') {
      return this._with_shadow_file_sync(original_path, handler);
    }
    throw new Error(`^guy.temp@3^ expected an (sync or async) function, got a ${type}`);
  };

  //-----------------------------------------------------------------------------------------------------------
  this._with_shadow_file_sync = function(original_path, handler) {
    /* TAINT check that original_path is nonexistent or file path, not directory */
    var FS, PATH, real_path;
    FS = require('node:fs');
    PATH = require('node:path');
    real_path = FS.realpathSync(original_path);
    this.with_directory(function({
        path: folder_path
      }) {
      var base_name, temp_path;
      base_name = PATH.basename(real_path);
      temp_path = PATH.join(folder_path, base_name);
      FS.copyFileSync(real_path, temp_path);
      handler({
        path: temp_path
      });
      return FS.renameSync(temp_path, real_path);
    });
    return null;
  };

}).call(this);

//# sourceMappingURL=temp.js.map