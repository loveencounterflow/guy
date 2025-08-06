(function() {
  'use strict';
  var inspect;

  //###########################################################################################################
  inspect = (require('util')).inspect;

  this.types = new (require('intertype-legacy')).Intertype();

  this.types.defaults = {};

  //-----------------------------------------------------------------------------------------------------------
  this._trm_cfg = {
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
  this.rpr = (...P) => {
    var x;
    return ((function() {
      var i, len, results;
      results = [];
      for (i = 0, len = P.length; i < len; i++) {
        x = P[i];
        results.push(inspect(x, this._trm_cfg.rpr));
      }
      return results;
    }).call(this)).join(this._trm_cfg.separator);
  };

  this.inspect = (...P) => {
    var x;
    return ((function() {
      var i, len, results;
      results = [];
      for (i = 0, len = P.length; i < len; i++) {
        x = P[i];
        results.push(inspect(x, this._trm_cfg.inspect));
      }
      return results;
    }).call(this)).join(this._trm_cfg.separator);
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL19oZWxwZXJzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQTtFQUFBO0FBQUEsTUFBQSxPQUFBOzs7RUFJQSxPQUFBLEdBQTRCLENBQUUsT0FBQSxDQUFRLE1BQVIsQ0FBRixDQUFrQixDQUFDOztFQUMvQyxJQUFDLENBQUEsS0FBRCxHQUE0QixJQUFJLENBQUUsT0FBQSxDQUFRLGtCQUFSLENBQUYsQ0FBOEIsQ0FBQyxTQUFuQyxDQUFBOztFQUM1QixJQUFDLENBQUEsS0FBSyxDQUFDLFFBQVAsR0FBNEIsQ0FBQSxFQU41Qjs7O0VBU0EsSUFBQyxDQUFBLFFBQUQsR0FDRTtJQUFBLFNBQUEsRUFBVyxHQUFYOztJQUVBLEdBQUEsRUFDRTtNQUFBLEtBQUEsRUFBa0IsS0FBbEI7TUFDQSxjQUFBLEVBQWtCLEtBRGxCO01BRUEsV0FBQSxFQUFrQixLQUZsQjtNQUdBLE9BQUEsRUFBa0IsSUFIbEI7TUFJQSxNQUFBLEVBQWtCO0lBSmxCLENBSEY7O0lBU0EsT0FBQSxFQUNFO01BQUEsS0FBQSxFQUFrQixLQUFsQjtNQUNBLGNBQUEsRUFBa0IsS0FEbEI7TUFFQSxXQUFBLEVBQWtCLEtBRmxCO01BR0EsT0FBQSxFQUFrQixLQUhsQjtNQUlBLE1BQUEsRUFBa0I7SUFKbEI7RUFWRixFQVZGOzs7RUEyQkEsSUFBQyxDQUFBLEdBQUQsR0FBWSxDQUFBLEdBQUUsQ0FBRixDQUFBLEdBQUE7QUFBVyxRQUFBO1dBQUM7O0FBQUU7TUFBQSxLQUFBLG1DQUFBOztxQkFBRSxPQUFBLENBQVEsQ0FBUixFQUFXLElBQUMsQ0FBQSxRQUFRLENBQUMsR0FBckI7TUFBRixDQUFBOztpQkFBRixDQUFnRCxDQUFDLElBQWpELENBQXNELElBQUMsQ0FBQSxRQUFRLENBQUMsU0FBaEU7RUFBWjs7RUFDWixJQUFDLENBQUEsT0FBRCxHQUFZLENBQUEsR0FBRSxDQUFGLENBQUEsR0FBQTtBQUFXLFFBQUE7V0FBQzs7QUFBRTtNQUFBLEtBQUEsbUNBQUE7O3FCQUFFLE9BQUEsQ0FBUSxDQUFSLEVBQVcsSUFBQyxDQUFBLFFBQVEsQ0FBQyxPQUFyQjtNQUFGLENBQUE7O2lCQUFGLENBQWdELENBQUMsSUFBakQsQ0FBc0QsSUFBQyxDQUFBLFFBQVEsQ0FBQyxTQUFoRTtFQUFaO0FBNUJaIiwic291cmNlc0NvbnRlbnQiOlsiXG4ndXNlIHN0cmljdCdcblxuXG4jIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbmluc3BlY3QgICAgICAgICAgICAgICAgICAgPSAoIHJlcXVpcmUgJ3V0aWwnICkuaW5zcGVjdFxuQHR5cGVzICAgICAgICAgICAgICAgICAgICA9IG5ldyAoIHJlcXVpcmUgJ2ludGVydHlwZS1sZWdhY3knICkuSW50ZXJ0eXBlKClcbkB0eXBlcy5kZWZhdWx0cyAgICAgICAgICAgPSB7fVxuXG4jLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbkBfdHJtX2NmZyA9XG4gIHNlcGFyYXRvcjogJyAnXG4gICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgcnByOlxuICAgIGRlcHRoOiAgICAgICAgICAgIEluZmluaXR5XG4gICAgbWF4QXJyYXlMZW5ndGg6ICAgSW5maW5pdHlcbiAgICBicmVha0xlbmd0aDogICAgICBJbmZpbml0eVxuICAgIGNvbXBhY3Q6ICAgICAgICAgIHRydWVcbiAgICBjb2xvcnM6ICAgICAgICAgICBmYWxzZVxuICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gIGluc3BlY3Q6XG4gICAgZGVwdGg6ICAgICAgICAgICAgSW5maW5pdHlcbiAgICBtYXhBcnJheUxlbmd0aDogICBJbmZpbml0eVxuICAgIGJyZWFrTGVuZ3RoOiAgICAgIEluZmluaXR5XG4gICAgY29tcGFjdDogICAgICAgICAgZmFsc2VcbiAgICBjb2xvcnM6ICAgICAgICAgICB0cnVlXG5cbiMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuQHJwciAgICAgID0gKCBQLi4uICkgPT4gKCAoIGluc3BlY3QgeCwgQF90cm1fY2ZnLnJwciAgICAgICkgZm9yIHggaW4gUCApLmpvaW4gQF90cm1fY2ZnLnNlcGFyYXRvclxuQGluc3BlY3QgID0gKCBQLi4uICkgPT4gKCAoIGluc3BlY3QgeCwgQF90cm1fY2ZnLmluc3BlY3QgICkgZm9yIHggaW4gUCApLmpvaW4gQF90cm1fY2ZnLnNlcGFyYXRvclxuXG4iXX0=
//# sourceURL=../src/_helpers.coffee