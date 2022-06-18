(function() {
  'use strict';
  var CND, Guy, alert, badge, debug, def, def_oneoff, echo, freeze, help, hide, info, isa, lets, log, rpr, type_of, types, urge, validate, warn, whisper;

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

  ({lets, freeze} = require('letsfreezethat'));

  ({def, hide, def_oneoff} = require('./props'));

  //===========================================================================================================
  Guy = class Guy {
    //---------------------------------------------------------------------------------------------------------
    // constructor: ( target = null ) ->
    constructor(settings = null) {
      this.settings = settings;
      this.props = {def, hide, def_oneoff};
      //.......................................................................................................
      // def_oneoff @, 'foo', { enumerable: true, }, -> require 'intertype'
      // def_oneoff @, 'nowait',   { enumerable: true, }, -> require './nowait'
      def_oneoff(this, 'async', {
        enumerable: true
      }, function() {
        return require('./async');
      });
      def_oneoff(this, 'cfg', {
        enumerable: true
      }, function() {
        return require('./cfg');
      });
      def_oneoff(this, 'lft', {
        enumerable: true
      }, function() {
        return require('letsfreezethat');
      });
      def_oneoff(this, 'obj', {
        enumerable: true
      }, function() {
        return require('./obj');
      });
      def_oneoff(this, 'process', {
        enumerable: true
      }, function() {
        return require('./process');
      });
      def_oneoff(this, 'fs', {
        enumerable: true
      }, function() {
        return require('./fs');
      });
      def_oneoff(this, 'str', {
        enumerable: true
      }, function() {
        return require('./str');
      });
      return void 0;
    }

  };

  //###########################################################################################################
  // if require.main is module then do =>
  module.exports = new Guy();

}).call(this);

//# sourceMappingURL=main.js.map