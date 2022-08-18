(function() {
  'use strict';
  var C, H, base, get_timestamp, σ_guy;

  //###########################################################################################################
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

  /* thx to https://github.com/chalk/ansi-regex/blob/main/index.js */
  // ansi_pattern              = ///
  //   [\u001B\u009B]
  //   [[\]()\#;?]*
  //   (?:(?:(?:(?:;[-a-zA-Z\d\/\#&.:=?%@~_]+)*
  //   |
  //   [a-zA-Z\d]+
  //   (?:;[-a-zA-Z\d\/\#&.:=?%@~_]*)*)?\u0007)
  //   |
  //   (?:(?:\d{1,4}(?:;\d{0,4})*)?
  //   [\dA-PR-TZcf-nq-uy=><~]))
  //   ///g
  this._ansi_pattern = (() => {
    
  function ansiRegex({onlyFirst = false} = {}) {
    const pattern = [
      '[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)',
      '(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))'
    ].join('|');

    return new RegExp(pattern, onlyFirst ? undefined : 'g');
  }
  ;
    return ansiRegex();
  })();

  //-----------------------------------------------------------------------------------------------------------
  this.truth = function(x) {
    if (x === true) {
      return this.green(this.rpr(x));
    }
    if (x === false) {
      return this.red(this.rpr(x));
    }
    return this.yellow(this.rpr(x));
  };

  //-----------------------------------------------------------------------------------------------------------
  this.rpr = H.rpr;

  this.inspect = H.inspect;

  //-----------------------------------------------------------------------------------------------------------
  this.get_writer = function(target, front = '', back = '\n') {
    return (...P) => {
      target.write(front + (this.pen(...P)) + back);
      return null;
    };
  };

  //-----------------------------------------------------------------------------------------------------------
  this.pen = (...P) => {
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
    return R.join(H._trm_cfg.separator);
  };

  //-----------------------------------------------------------------------------------------------------------
  this.get_loggers = (badge = null) => {
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
  get_timestamp = () => {
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

  this.strip_ansi = function(text) {
    return text.replace(this._ansi_pattern, '');
  };

}).call(this);

//# sourceMappingURL=trm.js.map