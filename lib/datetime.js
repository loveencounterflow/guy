(function() {
  'use strict';
  var H, defaults;

  //###########################################################################################################
  /* https://day.js.org */
  H = require('./_helpers');

  this._dayjs = require('dayjs');

  this._timestamp_input_template = 'YYYYMMDD-HHmmssZ';

  this._timestamp_output_template = 'YYYYMMDD-HHmmss[Z]';

  defaults = {};

  (() => {    //===========================================================================================================
    var customParseFormat, duration, relativeTime, toObject, utc;
    utc = require('dayjs/plugin/utc');
    this._dayjs.extend(utc);
    relativeTime = require('dayjs/plugin/relativeTime');
    this._dayjs.extend(relativeTime);
    toObject = require('dayjs/plugin/toObject');
    this._dayjs.extend(toObject);
    customParseFormat = require('dayjs/plugin/customParseFormat');
    this._dayjs.extend(customParseFormat);
    duration = require('dayjs/plugin/duration');
    return this._dayjs.extend(duration);
  })();

  //===========================================================================================================
  H.types.declare('guy_dt_valid_dayjs', {
    tests: {
      "( @type_of x ) is 'm'": function(x) {
        return (this.type_of(x)) === 'm';
      },
      "@isa.float x.$y": function(x) {
        return this.isa.float(x.$y);
      },
      "@isa.float x.$M": function(x) {
        return this.isa.float(x.$M);
      },
      "@isa.float x.$D": function(x) {
        return this.isa.float(x.$D);
      },
      "@isa.float x.$W": function(x) {
        return this.isa.float(x.$W);
      },
      "@isa.float x.$H": function(x) {
        return this.isa.float(x.$H);
      },
      "@isa.float x.$m": function(x) {
        return this.isa.float(x.$m);
      },
      "@isa.float x.$s": function(x) {
        return this.isa.float(x.$s);
      },
      "@isa.float x.$ms": function(x) {
        return this.isa.float(x.$ms);
      }
    }
  });

  //-----------------------------------------------------------------------------------------------------------
  H.types.declare('guy_dt_timestamp', {
    tests: {
      "@isa.text x": function(x) {
        return this.isa.text(x);
      },
      "( /^\\d{8}-\\d{6}Z$/ ).test x": function(x) {
        return /^\d{8}-\d{6}Z$/.test(x);
      }
    }
  });

  //-----------------------------------------------------------------------------------------------------------
  H.types.declare('guy_dt_now_cfg', {
    tests: {
      "@isa.object x": function(x) {
        return this.isa.object(x);
      }
    }
  });

  defaults.guy_dt_now_cfg = {
    subtract: null,
    add: null
  };

  //===========================================================================================================
  // DATETIME
  //-----------------------------------------------------------------------------------------------------------
  this.from_now = function(srts) {
    return (this.parse(srts)).fromNow();
  };

  //-----------------------------------------------------------------------------------------------------------
  this.now = function(cfg) {
    var R;
    H.types.validate.guy_dt_now_cfg((cfg = {...defaults.guy_dt_now_cfg, ...cfg}));
    R = this._dayjs().utc();
    if (cfg.subtract != null) {
      R = R.subtract(...cfg.subtract);
    }
    if (cfg.add != null) {
      R = R.add(...cfg.add);
    }
    return R.format(this._timestamp_output_template);
  };

  //-----------------------------------------------------------------------------------------------------------
  this.srts_from_isots = function(isots) {
    return (this._dayjs(isots)).utc().format(this._timestamp_output_template);
  };

  //-----------------------------------------------------------------------------------------------------------
  this.parse = function(srts) {
    var R;
    H.types.validate.guy_dt_timestamp(srts);
    R = (this._dayjs(srts, this._timestamp_input_template)).utc();
    if (!H.types.isa.guy_dt_valid_dayjs(R)) {
      throw new Error(`^guy.datetime.dt_parse@1^ ${rpr(srts)}`);
    }
    return R;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.format = function(srts, ...P) {
    var R;
    R = this.parse(srts);
    return R.format(...P);
  };

  //-----------------------------------------------------------------------------------------------------------
  this.isots_from_srts = function(srts) {
    return (this.parse(srts)).format();
  };

}).call(this);

//# sourceMappingURL=datetime.js.map