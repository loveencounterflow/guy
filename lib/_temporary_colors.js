(function() {
  'use strict';
  var H, L;

  /* NOTE: this module is here to speed up deprecation of CND (up to v9); it will change in the future */
  //###########################################################################################################
  H = require('./_helpers');

  L = this;

  //-----------------------------------------------------------------------------------------------------------
  // Effects On
  //...........................................................................................................
  this.blink = "\x1b[5m";

  this.bold = "\x1b[1m";

  this.reverse = "\x1b[7m";

  this.underline = "\x1b[4m";

  //-----------------------------------------------------------------------------------------------------------
  // Effects Off
  //...........................................................................................................
  this.no_blink = "\x1b[25m";

  this.no_bold = "\x1b[22m";

  this.no_reverse = "\x1b[27m";

  this.no_underline = "\x1b[24m";

  this.reset = "\x1b[0m";

  //-----------------------------------------------------------------------------------------------------------
  // Colors
  //...........................................................................................................
  this.colors = {
    black: "\x1b[38;05;16m",
    blue: "\x1b[38;05;27m",
    green: "\x1b[38;05;34m",
    cyan: "\x1b[38;05;51m",
    sepia: "\x1b[38;05;52m",
    indigo: "\x1b[38;05;54m",
    steel: "\x1b[38;05;67m",
    brown: "\x1b[38;05;94m",
    olive: "\x1b[38;05;100m",
    lime: "\x1b[38;05;118m",
    red: "\x1b[38;05;124m",
    crimson: "\x1b[38;05;161m",
    plum: "\x1b[38;05;176m",
    pink: "\x1b[38;05;199m",
    orange: "\x1b[38;05;208m",
    gold: "\x1b[38;05;214m",
    tan: "\x1b[38;05;215m",
    yellow: "\x1b[38;05;226m",
    grey: "\x1b[38;05;240m",
    darkgrey: "\x1b[38;05;234m",
    white: "\x1b[38;05;255m",
    // experimental:
    // colors as defined by http://ethanschoonover.com/solarized
    BASE03: "\x1b[38;05;234m",
    BASE02: "\x1b[38;05;235m",
    BASE01: "\x1b[38;05;240m",
    BASE00: "\x1b[38;05;241m",
    BASE0: "\x1b[38;05;244m",
    BASE1: "\x1b[38;05;245m",
    BASE2: "\x1b[38;05;254m",
    BASE3: "\x1b[38;05;230m",
    YELLOW: "\x1b[38;05;136m",
    ORANGE: "\x1b[38;05;166m",
    RED: "\x1b[38;05;124m",
    MAGENTA: "\x1b[38;05;125m",
    VIOLET: "\x1b[38;05;61m",
    BLUE: "\x1b[38;05;33m",
    CYAN: "\x1b[38;05;37m",
    GREEN: "\x1b[38;05;64m"
  };

  //-----------------------------------------------------------------------------------------------------------
  // Moves etc
  //...........................................................................................................
  this.cr = "\x1b[1G"; // Carriage Return; move to first column

  this.clear_line_right = "\x1b[0K"; // Clear to end   of line

  this.clear_line_left = "\x1b[1K"; // Clear to start of line

  this.clear_line = "\x1b[2K"; // Clear all line content

  this.clear_below = "\x1b[0J"; // Clear to the bottom

  this.clear_above = "\x1b[1J"; // Clear to the top (including current line)

  this.clear = "\x1b[2J"; // Clear entire screen

  
  //-----------------------------------------------------------------------------------------------------------
  this._temoprary_compile_colors = function(target) {
    var color_code, color_name, effect_name, effect_names, effect_off, effect_on, ref;
    effect_names = {
      blink: 1,
      bold: 1,
      reverse: 1,
      underline: 1
    };
//.........................................................................................................
    for (effect_name in effect_names) {
      effect_on = L[effect_name];
      effect_off = L['no_' + effect_name];
      ((effect_name, effect_on, effect_off) => {
        return target[effect_name] = (...P) => {
          var R, i, idx, last_idx, len, p;
          R = [effect_on];
          last_idx = P.length - 1;
          for (idx = i = 0, len = P.length; i < len; idx = ++i) {
            p = P[idx];
            R.push(H.types.isa.text(p) ? p : target.rpr(p));
            if (idx !== last_idx) {
              R.push(effect_on);
              R.push(' '); // _cfg.separator
            }
          }
          R.push(effect_off);
          return R.join('');
        };
      })(effect_name, effect_on, effect_off);
    }
    ref = L.colors;
    //.........................................................................................................
    for (color_name in ref) {
      color_code = ref[color_name];
      ((color_name, color_code) => {
        return target[color_name] = (...P) => {
          var R, i, idx, last_idx, len, p;
          R = [color_code];
          last_idx = P.length - 1;
          for (idx = i = 0, len = P.length; i < len; idx = ++i) {
            p = P[idx];
            R.push(H.types.isa.text(p) ? p : target.rpr(p));
            if (idx !== last_idx) {
              R.push(color_code);
              R.push(' '); // _cfg.separator
            }
          }
          R.push(L.reset);
          return R.join('');
        };
      })(color_name, color_code);
    }
    //.........................................................................................................
    return null;
  };

}).call(this);

//# sourceMappingURL=_temporary_colors.js.map