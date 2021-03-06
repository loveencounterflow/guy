// Generated by CoffeeScript 1.12.1
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
    var name, ref, value;
    ref = this;
    for (name in ref) {
      value = ref[name];
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
      'timeout': 30000
    });
  };

  this["demo"] = function(T, done) {
    return step((function(_this) {
      return function*(resume) {
        yield GUY.f(resume);
        return done();
      };
    })(this));
  };

  this["find maximum semvers"] = function(T, done) {
    var SEMVER, i, is_semver, is_v0, len, max_all_semver, max_v0_semver, probes, semver, v0_matcher;
    SEMVER = require('semver');
    probes = CND.shuffle(['modified', 'created', '0.1.1', '0.1.2', '0.1.3', '0.1.9', '1.0.1', '1.0.2', '1.0.3', '1.0.8', '1.0.9', '2.0.2', '4.1.5', '4.1.6']);
    max_all_semver = null;
    max_v0_semver = null;
    v0_matcher = '>=0.0.0 <1.0.0';
    is_semver = function(x) {
      return (SEMVER.valid(x)) != null;
    };
    is_v0 = function(semver) {
      return SEMVER.satisfies(semver, v0_matcher);
    };
    for (i = 0, len = probes.length; i < len; i++) {
      semver = probes[i];
      if (!is_semver(semver)) {
        continue;
      }
      if (max_all_semver != null) {
        if (SEMVER.gt(semver, max_all_semver)) {
          max_all_semver = semver;
        }
      } else {
        max_all_semver = semver;
      }
      if (is_v0(semver)) {
        if (max_v0_semver != null) {
          if (SEMVER.gt(semver, max_v0_semver)) {
            max_v0_semver = semver;
          }
        } else {
          max_v0_semver = semver;
        }
      }
      debug('34221', semver, max_v0_semver, max_all_semver, CND.truth(SEMVER.satisfies(semver, v0_matcher)));
    }
    debug('34221', max_v0_semver, max_all_semver);
    T.eq(max_v0_semver, '0.1.9');
    T.eq(max_all_semver, '4.1.6');
    return done();
  };

  if (module.parent == null) {
    include = ["demo"];
    this._prune();
    this._main();
  }

}).call(this);

//# sourceMappingURL=tests.js.map
