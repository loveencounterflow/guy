(function() {
  'use strict';
  var H, debug, defaults;

  //###########################################################################################################
  H = require('./_helpers');

  debug = console.log;

  defaults = {
    dir: null,
    prefix: 'guy.temp-',
    suffix: ''
  };

  //---------------------------------------------------------------------------------------------------------
  this.with_file = function(cfg, handler) {
    var R, TEMP, arity, fd, path;
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
    TEMP = (require('temp')).track();
    ({path, fd} = TEMP.openSync(cfg));
    try {
      handler({path, fd});
    } finally {
      R = TEMP.cleanupSync();
    }
    return R;
  };

  //---------------------------------------------------------------------------------------------------------
  this.with_directory = function(cfg, handler) {
    var R, TEMP, arity, path;
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
    TEMP = (require('temp')).track();
    path = TEMP.mkdirSync(cfg);
    try {
      handler({path});
    } finally {
      R = TEMP.cleanupSync();
    }
    return R;
  };

}).call(this);

//# sourceMappingURL=temp.js.map