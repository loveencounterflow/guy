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
    throw new Error(`^guy.async@45^ expected an (sync or async) function, got a ${type}`);
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
    throw new Error(`^guy.async@45^ expected an (sync or async) function, got a ${type}`);
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

}).call(this);

//# sourceMappingURL=temp.js.map