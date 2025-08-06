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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3NhbWVzYW1lLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQTtFQUFBO0FBQUEsTUFBQSxHQUFBOzs7RUFHQSxDQUFBLENBQUUsR0FBRixDQUFBLEdBQTRCLE9BQUEsQ0FBUSxPQUFSLENBQTVCLEVBSEE7OztFQU9BLElBQUMsQ0FBQSxNQUFELEdBQWMsQ0FBRSxPQUFBLENBQVEsTUFBUixDQUFGLENBQWtCLENBQUM7O0VBQ2pDLElBQUMsQ0FBQSxTQUFELEdBQWMsQ0FBRSxPQUFBLENBQVEsaUNBQVIsQ0FBRixDQUFBLENBQUE7O0VBQ2QsSUFBQyxDQUFBLFVBQUQsR0FBYyxDQUFFLE9BQUEsQ0FBUSw4Q0FBUixDQUFGLENBQTBELENBQUM7QUFUekUiLCJzb3VyY2VzQ29udGVudCI6WyJcbid1c2Ugc3RyaWN0J1xuXG4jIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbnsgcnByLCB9ICAgICAgICAgICAgICAgICAgPSByZXF1aXJlICcuL3RybSdcblxuXG4jLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbkBlcXVhbHMgICAgID0gKCByZXF1aXJlICd1dGlsJyApLmlzRGVlcFN0cmljdEVxdWFsXG5AZGVlcF9jb3B5ICA9ICggcmVxdWlyZSAnLi4vZGVwZW5kZW5jaWVzL3JmZGMtcGF0Y2hlZC5qcycgKSgpXG5AY29weV9yZWdleCA9ICggcmVxdWlyZSAnLi4vZGVwZW5kZW5jaWVzL3NpbmRyZXNvcmh1cy1jbG9uZS1yZWdleHAuanMnICkuY2xvbmVSZWdFeHBcblxuXG4iXX0=
//# sourceURL=../src/samesame.coffee