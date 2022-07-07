(function() {
  'use strict';
  var CND, Guy, alert, badge, debug, echo, freeze, help, info, lets, log, props, rpr, urge, warn, whisper;

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

  ({lets, freeze} = require('letsfreezethat'));

  props = require('./props');

  Guy = (function() {
    //===========================================================================================================
    class Guy {
      //---------------------------------------------------------------------------------------------------------
      // constructor: ( target = null ) ->
      constructor(settings = null) {
        this.settings = settings;
        //.......................................................................................................
        props.def_oneoff(this, 'async', {
          enumerable: true
        }, function() {
          return require('./async');
        });
        props.def_oneoff(this, 'cfg', {
          enumerable: true
        }, function() {
          return require('./cfg');
        });
        props.def_oneoff(this, 'lft', {
          enumerable: true
        }, function() {
          return require('letsfreezethat');
        });
        props.def_oneoff(this, 'process', {
          enumerable: true
        }, function() {
          return require('./process');
        });
        props.def_oneoff(this, 'fs', {
          enumerable: true
        }, function() {
          return require('./fs');
        });
        props.def_oneoff(this, 'str', {
          enumerable: true
        }, function() {
          return require('./str');
        });
        props.def_oneoff(this, 'src', {
          enumerable: true
        }, function() {
          return require('./src');
        });
        return void 0;
      }

    };

    //---------------------------------------------------------------------------------------------------------
    Guy.prototype.props = props;

    return Guy;

  }).call(this);

  //###########################################################################################################
  // if require.main is module then do =>
  module.exports = new Guy();

}).call(this);

//# sourceMappingURL=main.js.map