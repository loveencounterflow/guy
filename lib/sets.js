(function() {
  'use strict';
  var H;

  //###########################################################################################################
  H = require('./_helpers');

  /* thx to https://exploringjs.com/impatient-js/ch_sets.html#missing-set-operations */
  //-----------------------------------------------------------------------------------------------------------
  this.unite = function(...P) {
    var p;
    return new Set(((function() {
      var i, len, results;
      results = [];
      for (i = 0, len = P.length; i < len; i++) {
        p = P[i];
        results.push([...p]);
      }
      return results;
    })()).flat());
  };

  this._intersect = function(a, b) {
    return new Set((Array.from(a)).filter((x) => {
      return b.has(x);
    }));
  };

  //-----------------------------------------------------------------------------------------------------------
  this.intersect = function(...P) {
    var R, arity, i, idx, p, ref;
    if (!((arity = P.length) >= 2)) {
      throw new Error(`^guy.sets.intersect@1^ expected at least 2 arguments, got ${arity}`);
    }
    R = P[0];
    H.types.validate.set(R);
    for (idx = i = 1, ref = arity; (1 <= ref ? i < ref : i > ref); idx = 1 <= ref ? ++i : --i) {
      p = P[idx];
      H.types.validate.set(p);
      R = this._intersect(R, p);
      if (R.size === 0) {
        return R;
      }
    }
    return R;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.subtract = function(a, b) {
    return new Set((Array.from(a)).filter((x) => {
      return !b.has(x);
    }));
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3NldHMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBO0VBQUE7QUFBQSxNQUFBLENBQUE7OztFQUdBLENBQUEsR0FBNEIsT0FBQSxDQUFRLFlBQVIsRUFINUI7Ozs7RUFTQSxJQUFDLENBQUEsS0FBRCxHQUFjLFFBQUEsQ0FBQSxHQUFFLENBQUYsQ0FBQTtBQUFXLFFBQUE7V0FBQyxJQUFJLEdBQUosQ0FBUTs7QUFBRTtNQUFBLEtBQUEsbUNBQUE7O3FCQUFBLENBQUUsR0FBQSxDQUFGO01BQUEsQ0FBQTs7UUFBRixDQUF3QixDQUFDLElBQXpCLENBQUEsQ0FBUjtFQUFaOztFQUNkLElBQUMsQ0FBQSxVQUFELEdBQWMsUUFBQSxDQUFFLENBQUYsRUFBSyxDQUFMLENBQUE7V0FBWSxJQUFJLEdBQUosQ0FBUSxDQUFFLEtBQUssQ0FBQyxJQUFOLENBQVcsQ0FBWCxDQUFGLENBQWdCLENBQUMsTUFBakIsQ0FBd0IsQ0FBRSxDQUFGLENBQUEsR0FBQTthQUFTLENBQUMsQ0FBQyxHQUFGLENBQU0sQ0FBTjtJQUFULENBQXhCLENBQVI7RUFBWixFQVZkOzs7RUFhQSxJQUFDLENBQUEsU0FBRCxHQUFhLFFBQUEsQ0FBQSxHQUFFLENBQUYsQ0FBQTtBQUNiLFFBQUEsQ0FBQSxFQUFBLEtBQUEsRUFBQSxDQUFBLEVBQUEsR0FBQSxFQUFBLENBQUEsRUFBQTtJQUFFLE1BQU8sQ0FBRSxLQUFBLEdBQVEsQ0FBQyxDQUFDLE1BQVosQ0FBQSxJQUF3QixFQUEvQjtNQUNFLE1BQU0sSUFBSSxLQUFKLENBQVUsQ0FBQSwwREFBQSxDQUFBLENBQTZELEtBQTdELENBQUEsQ0FBVixFQURSOztJQUVBLENBQUEsR0FBSSxDQUFDLENBQUUsQ0FBRjtJQUNMLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEdBQWpCLENBQXFCLENBQXJCO0lBQ0EsS0FBVyxvRkFBWDtNQUNFLENBQUEsR0FBSSxDQUFDLENBQUUsR0FBRjtNQUNMLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEdBQWpCLENBQXFCLENBQXJCO01BQ0EsQ0FBQSxHQUFJLElBQUMsQ0FBQSxVQUFELENBQVksQ0FBWixFQUFlLENBQWY7TUFDSixJQUFZLENBQUMsQ0FBQyxJQUFGLEtBQVUsQ0FBdEI7QUFBQSxlQUFPLEVBQVA7O0lBSkY7QUFLQSxXQUFPO0VBVkksRUFiYjs7O0VBMEJBLElBQUMsQ0FBQSxRQUFELEdBQVksUUFBQSxDQUFFLENBQUYsRUFBSyxDQUFMLENBQUE7V0FBWSxJQUFJLEdBQUosQ0FBUSxDQUFFLEtBQUssQ0FBQyxJQUFOLENBQVcsQ0FBWCxDQUFGLENBQWdCLENBQUMsTUFBakIsQ0FBd0IsQ0FBRSxDQUFGLENBQUEsR0FBQTthQUFTLENBQUksQ0FBQyxDQUFDLEdBQUYsQ0FBTSxDQUFOO0lBQWIsQ0FBeEIsQ0FBUjtFQUFaO0FBMUJaIiwic291cmNlc0NvbnRlbnQiOlsiXG4ndXNlIHN0cmljdCdcblxuIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5IICAgICAgICAgICAgICAgICAgICAgICAgID0gcmVxdWlyZSAnLi9faGVscGVycydcblxuXG4jIyMgdGh4IHRvIGh0dHBzOi8vZXhwbG9yaW5nanMuY29tL2ltcGF0aWVudC1qcy9jaF9zZXRzLmh0bWwjbWlzc2luZy1zZXQtb3BlcmF0aW9ucyAjIyNcblxuIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5AdW5pdGUgICAgICA9ICggUC4uLiApIC0+IG5ldyBTZXQgKCBbIHAuLi4sIF0gZm9yIHAgaW4gUCApLmZsYXQoKVxuQF9pbnRlcnNlY3QgPSAoIGEsIGIgKSAtPiBuZXcgU2V0ICggQXJyYXkuZnJvbSBhICkuZmlsdGVyICggeCApID0+IGIuaGFzIHhcblxuIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5AaW50ZXJzZWN0ID0gKCBQLi4uICkgLT5cbiAgdW5sZXNzICggYXJpdHkgPSBQLmxlbmd0aCApID49IDJcbiAgICB0aHJvdyBuZXcgRXJyb3IgXCJeZ3V5LnNldHMuaW50ZXJzZWN0QDFeIGV4cGVjdGVkIGF0IGxlYXN0IDIgYXJndW1lbnRzLCBnb3QgI3thcml0eX1cIlxuICBSID0gUFsgMCBdXG4gIEgudHlwZXMudmFsaWRhdGUuc2V0IFJcbiAgZm9yIGlkeCBpbiBbIDEgLi4uIGFyaXR5IF1cbiAgICBwID0gUFsgaWR4IF1cbiAgICBILnR5cGVzLnZhbGlkYXRlLnNldCBwXG4gICAgUiA9IEBfaW50ZXJzZWN0IFIsIHBcbiAgICByZXR1cm4gUiBpZiBSLnNpemUgaXMgMFxuICByZXR1cm4gUlxuXG4jLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbkBzdWJ0cmFjdCA9ICggYSwgYiApIC0+IG5ldyBTZXQgKCBBcnJheS5mcm9tIGEgKS5maWx0ZXIgKCB4ICkgPT4gbm90IGIuaGFzIHhcbiJdfQ==
//# sourceURL=../src/sets.coffee