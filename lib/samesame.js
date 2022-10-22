(function() {
  'use strict';
  var rpr;

  //###########################################################################################################
  ({rpr} = require('./trm'));

  //-----------------------------------------------------------------------------------------------------------
  this.equals = (require('util')).isDeepStrictEqual;

  this.deep_copy = (require('../dependencies/rfdc-patched.js'))();

  this.copy_regex = (require('../dependencies/sindresorhus-clone-regexp.js')).cloneRegExp;

}).call(this);

//# sourceMappingURL=samesame.js.map