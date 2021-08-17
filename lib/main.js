(function() {
  'use strict';
  var CND, Guy, alert, badge, debug, def, def_oneoff, echo, help, info, isa, log, rpr, type_of, types, urge, validate, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'GUY';

  log = CND.get_logger('plain', badge);

  info = CND.get_logger('info', badge);

  whisper = CND.get_logger('whisper', badge);

  alert = CND.get_logger('alert', badge);

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  help = CND.get_logger('help', badge);

  urge = CND.get_logger('urge', badge);

  echo = CND.echo.bind(CND);

  types = new (require('intertype')).Intertype();

  ({isa, validate, type_of} = types.export());

  //---------------------------------------------------------------------------------------------------------
  def = Object.defineProperty;

  //---------------------------------------------------------------------------------------------------------
  def_oneoff = function(object, name, cfg, method) {
    var get;
    get = function() {
      var R, ref, ref1;
      R = method();
      delete cfg.get;
      def(object, name, {
        configurable: (ref = cfg.configurable) != null ? ref : true,
        enumerable: (ref1 = cfg.enumerable) != null ? ref1 : true,
        value: R
      });
      return R;
    };
    def(object, name, {
      enumerable: true,
      configurable: true,
      get
    });
    return null;
  };

  //===========================================================================================================
  Guy = class Guy {
    //---------------------------------------------------------------------------------------------------------
    // constructor: ( target = null ) ->
    constructor(settings = null) {
      this.settings = settings;
      this.props = {def, def_oneoff};
      this.async = {
        defer: setImmediate,
        after: function(dts, f) {
          return setTimeout(f, dts * 1000);
        }
      };
      //.......................................................................................................
      // def_oneoff @, 'foo', { enumerable: true, }, -> require 'intertype'
      def_oneoff(this, 'nowait', {
        enumerable: true
      }, function() {
        return require('./nowait');
      });
      return void 0;
    }

  };

  //###########################################################################################################
  // if require.main is module then do =>
  module.exports = new Guy();

}).call(this);

//# sourceMappingURL=main.js.map