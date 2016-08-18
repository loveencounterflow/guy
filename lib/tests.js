// Generated by CoffeeScript 1.10.0
(function() {
  var CND, FS, GUY, PATH, alert, badge, debug, echo, help, include, info, log, rpr, step, test, urge, warn, whisper,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  PATH = require('path');

  FS = require('fs');

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

  step = require('coffeenode-suspend').step;

  test = require('guy-test');

  GUY = require('./main');

  this._prune = function() {
    var name, value;
    for (name in this) {
      value = this[name];
      if (name.startsWith('_')) {
        continue;
      }
      if (indexOf.call(include, name) < 0) {
        delete this[name];
      }
    }
    return null;
  };

  this._main = function(handler) {
    if (handler == null) {
      handler = null;
    }
    return test(this, {
      'timeout': 3000
    });
  };

  this["demo"] = function(T, done) {
    return step((function(_this) {
      return function*(resume) {
        (yield GUY.f(resume));
        return done();
      };
    })(this));
  };

  if (module.parent == null) {
    include = ["demo"];
    this._prune();
    this._main();
  }

}).call(this);

//# sourceMappingURL=tests.js.map