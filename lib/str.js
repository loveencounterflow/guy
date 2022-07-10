(function() {
  'use strict';
  var C, H, _cfg, _inspect, alert, base, debug, get_timestamp, help, info, plain, praise, urge, warn, whisper, σ_guy;

  //###########################################################################################################
  _inspect = (require('util')).inspect;

  H = require('./_helpers');

  C = require('./_temporary_colors');

  C._temoprary_compile_colors(this);

  σ_guy = Symbol('GUY');

  if (globalThis[σ_guy] == null) {
    globalThis[σ_guy] = {};
  }

  if ((base = globalThis[σ_guy]).t0 == null) {
    base.t0 = Date.now();
  }

  //-----------------------------------------------------------------------------------------------------------
  _cfg = {
    separator: ' ',
    //.........................................................................................................
    rpr: {
      depth: 2e308,
      maxArrayLength: 2e308,
      breakLength: 2e308,
      compact: true,
      colors: false
    },
    //.........................................................................................................
    inspect: {
      depth: 2e308,
      maxArrayLength: 2e308,
      breakLength: 2e308,
      compact: false,
      colors: true
    }
  };

  //-----------------------------------------------------------------------------------------------------------
  this.rpr = function(...P) {
    var x;
    return ((function() {
      var i, len, results;
      results = [];
      for (i = 0, len = P.length; i < len; i++) {
        x = P[i];
        results.push(_inspect(x, _cfg.rpr));
      }
      return results;
    })()).join(' ');
  };

  this.inspect = function(...P) {
    var x;
    return ((function() {
      var i, len, results;
      results = [];
      for (i = 0, len = P.length; i < len; i++) {
        x = P[i];
        results.push(_inspect(x, _cfg.inspect));
      }
      return results;
    })()).join(' ');
  };

  //-----------------------------------------------------------------------------------------------------------
  this.get_writer = function(target, front = '', back = '\n') {
    return (...P) => {
      target.write(front + (this.pen(...P)) + back);
      return null;
    };
  };

  //-----------------------------------------------------------------------------------------------------------
  this.pen = function(...P) {
    /* Given any number of arguments, return a text representing the arguments as seen fit for output
     commands like `log` and `echo`. */
    var R, p;
    R = (function() {
      var i, len, results;
      results = [];
      for (i = 0, len = P.length; i < len; i++) {
        p = P[i];
        results.push(H.types.isa.text(p) ? p : this.rpr(p));
      }
      return results;
    }).call(this);
    return R.join(_cfg.separator);
  };

  //-----------------------------------------------------------------------------------------------------------
  this.get_loggers = function(badge = null) {
    var R, prefix;
    prefix = badge != null ? ' ' + (this.grey(badge)) + ' ' : '';
    R = {
      alert: (...P) => {
        return this.log((this.grey(get_timestamp())) + (this.blink(this.RED(' ⚠ '))) + prefix + (this.RED(...P)));
      },
      debug: (...P) => {
        return this.log((this.grey(get_timestamp())) + (this.grey(' ⚙ ')) + prefix + (this.pink(...P)));
      },
      help: (...P) => {
        return this.log((this.grey(get_timestamp())) + (this.gold(' ☛ ')) + prefix + (this.lime(...P)));
      },
      info: (...P) => {
        return this.log((this.grey(get_timestamp())) + (this.grey(' ▶ ')) + prefix + (this.BLUE(...P)));
      },
      plain: (...P) => {
        return this.log((this.grey(get_timestamp())) + (this.grey(' ▶ ')) + prefix + (this.pen(...P)));
      },
      praise: (...P) => {
        return this.log((this.grey(get_timestamp())) + (this.GREEN(' ✔ ')) + prefix + (this.GREEN(...P)));
      },
      urge: (...P) => {
        return this.log((this.grey(get_timestamp())) + (this.bold(this.RED(' ? '))) + prefix + (this.orange(...P)));
      },
      warn: (...P) => {
        return this.log((this.grey(get_timestamp())) + (this.bold(this.RED(' ! '))) + prefix + (this.RED(...P)));
      },
      whisper: (...P) => {
        return this.log((this.grey(get_timestamp())) + (this.grey(' ▶ ')) + prefix + (this.grey(...P)));
      }
    };
    //.........................................................................................................
    return R;
  };

  //-----------------------------------------------------------------------------------------------------------
  get_timestamp = function() {
    var m, s, t1;
    t1 = Math.floor((Date.now() - globalThis[σ_guy].t0) / 1000);
    s = t1 % 60;
    s = '' + s;
    if (s.length < 2) {
      s = '0' + s;
    }
    m = (Math.floor(t1 / 60)) % 100;
    m = '' + m;
    if (m.length < 2) {
      m = '0' + m;
    }
    return `${m}:${s}`;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.log = this.get_writer(process.stderr);

  this.echo = this.get_writer(process.stdout);

  this.debug = this.get_writer(process.stdout, C.cyan, C.reset + '\n');

  console.log(this.rpr(this.pen(['foo', 42, 'bar', true])));

  this.echo('helo');

  this.debug(this.rpr(this.pen(['foo', 42, 'bar', true])));

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = this.get_loggers('GUY'));

  alert("alert    XXXXXXX");

  debug("debug    XXXXXXX");

  help("help     XXXXXXX");

  info("info     XXXXXXX");

  plain("plain    XXXXXXX");

  praise("praise   XXXXXXX");

  urge("urge     XXXXXXX");

  warn("warn     XXXXXXX");

  whisper("whisper  XXXXXXX");

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  this.SQL = function(parts, ...expressions) {
    var R, expression, i, idx, len;
    R = parts[0];
    for (idx = i = 0, len = expressions.length; i < len; idx = ++i) {
      expression = expressions[idx];
      R += expression.toString() + parts[idx + 1];
    }
    return R;
  };

}).call(this);

//# sourceMappingURL=str.js.map