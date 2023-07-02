(function() {
  'use strict';
  var FS, FSWatcher, H, debug, path_exists, rpr;

  //###########################################################################################################
  H = require('./_helpers');

  debug = console.log;

  ({FSWatcher} = require('chokidar'));

  ({rpr} = H);

  FS = require('fs');

  //-----------------------------------------------------------------------------------------------------------
  path_exists = function(path) {
    var error;
    H.types.validate.nonempty_text(path);
    try {
      FS.statSync(path);
    } catch (error1) {
      error = error1;
      if (error.code === 'ENOENT') {
        return false;
      }
      throw error;
    }
    return true;
  };

  //===========================================================================================================
  this.Watcher = class Watcher {
    //---------------------------------------------------------------------------------------------------------
    constructor() {
      this._watcher = new FSWatcher({
        recursive: true,
        persistent: true,
        awaitWriteFinish: {
          stabilityThreshold: 100
        }
      });
      this._attach_handlers();
      return void 0;
    }

    //---------------------------------------------------------------------------------------------------------
    async stop() {
      return (await this._watcher.close());
    }

    //---------------------------------------------------------------------------------------------------------
    _attach_handlers() {
      if (this.on_add != null) {
        //.......................................................................................................
        this._watcher.on('add', ((path, stats) => {
          return this.on_add(path);
        }));
      }
      if (this.on_change != null) {
        this._watcher.on('change', ((path, stats) => {
          return this.on_change(path);
        }));
      }
      if (this.on_unlink != null) {
        this._watcher.on('unlink', ((path) => {
          return this.on_unlink(path);
        }));
      }
      if (this.on_add_folder != null) {
        this._watcher.on('addDir', ((path) => {
          return this.on_add_folder(path);
        }));
      }
      if (this.on_unlink_folder != null) {
        this._watcher.on('unlinkDir', ((path) => {
          return this.on_unlink_folder(path);
        }));
      }
      if (this.on_ready != null) {
        //.......................................................................................................
        this._watcher.on('ready', (() => {
          return this.on_ready();
        }));
      }
      if (this.on_raw != null) {
        this._watcher.on('raw', ((key, path, d) => {
          return this.on_raw(key, path, d);
        }));
      }
      if (this.on_error != null) {
        this._watcher.on('error', ((error) => {
          return this.on_error(error);
        }));
      }
      //.......................................................................................................
      if (this.on_all != null) {
        this._watcher.on('all', (key, path) => {
          if (key === 'addDir') {
            key = 'add_folder';
          }
          if (key === 'unlinkDir') {
            key = 'unlink_folder';
          }
          return this.on_all(key, path);
        });
      }
      //.......................................................................................................
      return null;
    }

    //---------------------------------------------------------------------------------------------------------
    on_error(path) {
      throw error;
    }

    /*
    watcher.on 'error', ( error ) ->
      debug '^guy.watch@2^', 'error', error.message
      for k, v of error
        key = k + ': '
        debug ( CND.reverse key.padEnd 25 ), ( CND.yellow rpr v )
      if error.message.startsWith "Couldn't initialize inotify"
        reject error.message
        defer -> process.exit 1
      debug CND.reverse "error #{rpr error.message} occurred for path: #{CND.yellow rpr path}"
    */
    //---------------------------------------------------------------------------------------------------------
    add_path(path, ...P) {
      this._watcher.add(path, ...P);
      return null;
    }

  };

  //===========================================================================================================
  this.Reporting_watcher = class Reporting_watcher extends this.Watcher {
    on_add(path) {
      return debug('^guy.watch@3^ add           ', {path});
    }

    on_change(path) {
      return debug('^guy.watch@4^ change        ', {path});
    }

    on_unlink(path) {
      return debug('^guy.watch@5^ unlink        ', {path});
    }

    on_add_folder(path) {
      return debug('^guy.watch@6^ add_folder    ', {path});
    }

    on_unlink_folder(path) {
      return debug('^guy.watch@7^ unlink_folder ', {path});
    }

    on_ready() {
      return debug('^guy.watch@8^ ready         ');
    }

  };

  // on_all:           ( key, path ) -> debug '^guy.watch@3^ all           ', { key, path, }
// on_raw:           ( P... ) -> debug '^guy.watch@9^ raw           ', P
// on_error:         ( error     ) -> debug '^guy.watch@10^ error         ', rpr error

}).call(this);

//# sourceMappingURL=watch.js.map