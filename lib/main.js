(function() {
  'use strict';
  var Guy, props;

  //###########################################################################################################
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
        props.def_oneoff(this, 'sets', {
          enumerable: true
        }, function() {
          return require('./sets');
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
        props.def_oneoff(this, 'trm', {
          enumerable: true
        }, function() {
          return require('./trm');
        });
        props.def_oneoff(this, 'temp', {
          enumerable: true
        }, function() {
          return require('./temp');
        });
        props.def_oneoff(this, 'samesame', {
          enumerable: true
        }, function() {
          return require('./samesame');
        });
        props.def_oneoff(this, 'rnd', {
          enumerable: true
        }, function() {
          return require('./rnd');
        });
        props.def_oneoff(this, 'datetime', {
          enumerable: true
        }, function() {
          return require('./datetime');
        });
        props.def_oneoff(this, 'watch', {
          enumerable: true
        }, function() {
          return require('./watch');
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