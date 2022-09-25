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

  //---------------------------------------------------------------------------------------------------------
  this.with_file = function(cfg, handler) {
    var TEMP, arity, fd, path, removeCallback;
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
    TEMP = require('tmp');
    ({
      name: path,
      fd,
      removeCallback
    } = TEMP.fileSync({}));
    try {
      // { name: path, fd }  = TEMP.fileSync cfg
      handler({path, fd});
    } finally {
      if (!cfg.keep) {
        removeCallback();
      }
    }
    return null;
  };

  //---------------------------------------------------------------------------------------------------------
  this.with_directory = function(cfg, handler) {
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

}).call(this);

//# sourceMappingURL=temp.js.map