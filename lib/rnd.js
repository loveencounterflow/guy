(function() {
  'use strict';
  //===========================================================================================================
  // UNSORTING
  //-----------------------------------------------------------------------------------------------------------
  this.shuffle = function(list, ratio = 1) {
    var this_idx;
    if ((this_idx = list.length) < 2) {
      /* Shuffles the elements of a list randomly. After the call, the elements of will be—most of the time—
      be reordered (but this is not guaranteed, as there is a realistic probability for recurrence of orderings
      with short lists).

      This is an implementation of the renowned Fisher-Yates algorithm, but with a twist: You may pass in a
      `ratio` as second argument (which should be a float in the range `0 <= ratio <= 1`); if set to a value
      less than one, a random number will be used to decide whether or not to perform a given step in the
      shuffling process, so lists shuffled with zero-ish ratios will show less disorder than lists shuffled with
      a one-ish ratio.

      Implementation gleaned from http://stackoverflow.com/a/962890/256361. */
      //.........................................................................................................
      return list;
    }
    return this._shuffle(list, ratio, Math.random, this.random_integer.bind(this));
  };

  //-----------------------------------------------------------------------------------------------------------
  this.get_shuffle = function(seed_0 = 0, seed_1 = 1) {
    /* This method works similar to `get_rnd`; it accepts two `seed`s which are used to produce random number
     generators and returns a predictable shuffling function that accepts arguments like Bits'N'Pieces
     `shuffle`. */
    var random_integer, rnd;
    rnd = this.get_rnd(seed_0);
    random_integer = this.get_rnd_int(seed_1);
    return (list, ratio = 1) => {
      return this._shuffle(list, ratio, rnd, random_integer);
    };
  };

  //-----------------------------------------------------------------------------------------------------------
  this._shuffle = function(list, ratio, rnd, random_integer) {
    var that_idx, this_idx;
    if ((this_idx = list.length) < 2) {
      //.........................................................................................................
      return list;
    }
    while (true) {
      //.........................................................................................................
      this_idx += -1;
      if (this_idx < 1) {
        return list;
      }
      if (ratio >= 1 || rnd() <= ratio) {
        // return list if this_idx < 1
        that_idx = random_integer(0, this_idx);
        [list[that_idx], list[this_idx]] = [list[this_idx], list[that_idx]];
      }
    }
    //.........................................................................................................
    return list;
  };

  //===========================================================================================================
  // RANDOM NUMBERS
  //-----------------------------------------------------------------------------------------------------------
  // ### see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number ###
  // @MIN_SAFE_INTEGER = -( 2 ** 53 ) - 1
  // @MAX_SAFE_INTEGER = +( 2 ** 53 ) - 1

  //-----------------------------------------------------------------------------------------------------------
  this.random_number = function(min = 0, max = 1) {
    /* Return a random number between min (inclusive) and max (exclusive).
     From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
     via http://stackoverflow.com/a/1527820/256361. */
    return Math.random() * (max - min) + min;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.integer_from_normal_float = function(x, min = 0, max = 2) {
    /* Given a 'normal' float `x` so that `0 <= x < 1`, return an integer `n` so that `min <= n < min`. */
    return (Math.floor(x * (max - min))) + min;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.random_integer = function(min = 0, max = 2) {
    /* Return a random integer between min (inclusive) and max (exclusive).
     From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
     via http://stackoverflow.com/a/1527820/256361. */
    return this.integer_from_normal_float(Math.random(), min, max);
  };

  //-----------------------------------------------------------------------------------------------------------
  this.get_rnd_int = function(seed = 1, delta = 1) {
    /* Like `get_rnd`, but returns a predictable random integer generator. */
    var rnd;
    rnd = this.get_rnd(seed, delta);
    return (min = 0, max = 1) => {
      return this.integer_from_normal_float(rnd(), min, max);
    };
  };

  //-----------------------------------------------------------------------------------------------------------
  this.get_rnd = function(seed = 1, delta = 1) {
    var R;
    /* This method returns a simple deterministic pseudo-random number generator—basically like
    `Math.random`, but (1) very probably with a much worse distribution of results, and (2) with predictable
    series of numbers, which is good for some testing scenarios. You may seed this method by passing in a
    `seed` and a `delta`, both of which must be non-zero numbers; the ensuing series of calls to the returned
    method will then always result in the same series of numbers. Here is a usage example that also shows how
    to reset the generator:

        CND = require 'cnd'
        rnd = CND.get_rnd() # or, say, `rnd = CND.get_rnd 123, 0.5`
        log rnd() for idx in [ 0 .. 5 ]
        log()
        rnd.reset()
        log rnd() for idx in [ 0 .. 5 ]

    Please note that there are no strong guarantees made about the quality of the generated values except the
    (1) deterministic repeatability, (2) boundedness, and (3) 'apparent randomness'. Do **not** use this for
    cryptographic purposes. */
    //.........................................................................................................
    R = function() {
      var x;
      R._idx += 1;
      x = (Math.sin(R._s)) * 10000;
      R._s += R._delta;
      return x - Math.floor(x);
    };
    //.........................................................................................................
    R.reset = function(seed, delta) {
      /* Reset the generator. After calling `rnd.reset` (or `rnd.seed` with the same arguments), ensuing calls
         to `rnd` will always result in the same sequence of pseudo-random numbers. */
      if (seed == null) {
        seed = this._seed;
      }
      if (delta == null) {
        delta = this._delta;
      }
      //.......................................................................................................
      if (!((typeof seed) === 'number' && (Number.isFinite(seed)))) {
        throw new Error(`^3397^ expected a number, got ${rpr(seed)}`);
      }
      if (!((typeof delta) === 'number' && (Number.isFinite(delta)))) {
        throw new Error(`^3398^ expected a number, got ${rpr(delta)}`);
      }
      if (seed === 0) {
        //.......................................................................................................
        throw new Error("seed should not be zero");
      }
      if (delta === 0) {
        throw new Error("delta should not be zero");
      }
      //.......................................................................................................
      R._s = seed;
      R._seed = seed;
      R._delta = delta;
      R._idx = -1;
      return null;
    };
    //.........................................................................................................
    R.reset(seed, delta);
    //.........................................................................................................
    return R;
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3JuZC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0E7RUFBQSxhQUFBOzs7O0VBTUEsSUFBQyxDQUFBLE9BQUQsR0FBVyxRQUFBLENBQUUsSUFBRixFQUFRLFFBQVEsQ0FBaEIsQ0FBQTtBQUNYLFFBQUE7SUFZRSxJQUFlLENBQUUsUUFBQSxHQUFXLElBQUksQ0FBQyxNQUFsQixDQUFBLEdBQTZCLENBQTVDOzs7Ozs7Ozs7Ozs7O0FBQUEsYUFBTyxLQUFQOztBQUNBLFdBQU8sSUFBQyxDQUFBLFFBQUQsQ0FBVSxJQUFWLEVBQWdCLEtBQWhCLEVBQXVCLElBQUksQ0FBQyxNQUE1QixFQUFvQyxJQUFDLENBQUEsY0FBYyxDQUFDLElBQWhCLENBQXFCLElBQXJCLENBQXBDO0VBZEUsRUFOWDs7O0VBdUJBLElBQUMsQ0FBQSxXQUFELEdBQWUsUUFBQSxDQUFFLFNBQVMsQ0FBWCxFQUFjLFNBQVMsQ0FBdkIsQ0FBQSxFQUFBOzs7O0FBQ2YsUUFBQSxjQUFBLEVBQUE7SUFHRSxHQUFBLEdBQWtCLElBQUMsQ0FBQSxPQUFELENBQWMsTUFBZDtJQUNsQixjQUFBLEdBQWtCLElBQUMsQ0FBQSxXQUFELENBQWMsTUFBZDtBQUNsQixXQUFPLENBQUUsSUFBRixFQUFRLFFBQVEsQ0FBaEIsQ0FBQSxHQUFBO2FBQXVCLElBQUMsQ0FBQSxRQUFELENBQVUsSUFBVixFQUFnQixLQUFoQixFQUF1QixHQUF2QixFQUE0QixjQUE1QjtJQUF2QjtFQU5NLEVBdkJmOzs7RUFnQ0EsSUFBQyxDQUFBLFFBQUQsR0FBWSxRQUFBLENBQUUsSUFBRixFQUFRLEtBQVIsRUFBZSxHQUFmLEVBQW9CLGNBQXBCLENBQUE7QUFDWixRQUFBLFFBQUEsRUFBQTtJQUNFLElBQWUsQ0FBRSxRQUFBLEdBQVcsSUFBSSxDQUFDLE1BQWxCLENBQUEsR0FBNkIsQ0FBNUM7O0FBQUEsYUFBTyxLQUFQOztBQUVBLFdBQUEsSUFBQSxH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LE1BQU0sQ0FBQyxRQUFQLENBQWdCLEtBQWhCLENBQUYsRUFBeEM7UUFBdUUsTUFBTSxJQUFJLEtBQUosQ0FBVSxDQUFBLDhCQUFBLENBQUEsQ0FBaUMsR0FBQSxDQUFJLEtBQUosQ0FBakMsQ0FBQSxDQUFWLEVBQTdFOztNQUVBLElBQWtELElBQUEsS0FBUyxDQUEzRDs7UUFBQSxNQUFNLElBQUksS0FBSixDQUFVLHlCQUFWLEVBQU47O01BQ0EsSUFBa0QsS0FBQSxLQUFTLENBQTNEO1FBQUEsTUFBTSxJQUFJLEtBQUosQ0FBVSwwQkFBVixFQUFOO09BVEo7O01BV0ksQ0FBQyxDQUFDLEVBQUYsR0FBVztNQUNYLENBQUMsQ0FBQyxLQUFGLEdBQVc7TUFDWCxDQUFDLENBQUMsTUFBRixHQUFXO01BQ1gsQ0FBQyxDQUFDLElBQUYsR0FBVyxDQUFDO0FBQ1osYUFBTztJQWhCQyxFQXhCWjs7SUEwQ0UsQ0FBQyxDQUFDLEtBQUYsQ0FBUSxJQUFSLEVBQWMsS0FBZCxFQTFDRjs7QUE0Q0UsV0FBTztFQTdDRTtBQWpGWCIsInNvdXJjZXNDb250ZW50IjpbIlxuJ3VzZSBzdHJpY3QnXG5cblxuIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4jIFVOU09SVElOR1xuIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5Ac2h1ZmZsZSA9ICggbGlzdCwgcmF0aW8gPSAxICkgLT5cbiAgIyMjIFNodWZmbGVzIHRoZSBlbGVtZW50cyBvZiBhIGxpc3QgcmFuZG9tbHkuIEFmdGVyIHRoZSBjYWxsLCB0aGUgZWxlbWVudHMgb2Ygd2lsbCBiZeKAlG1vc3Qgb2YgdGhlIHRpbWXigJRcbiAgYmUgcmVvcmRlcmVkIChidXQgdGhpcyBpcyBub3QgZ3VhcmFudGVlZCwgYXMgdGhlcmUgaXMgYSByZWFsaXN0aWMgcHJvYmFiaWxpdHkgZm9yIHJlY3VycmVuY2Ugb2Ygb3JkZXJpbmdzXG4gIHdpdGggc2hvcnQgbGlzdHMpLlxuXG4gIFRoaXMgaXMgYW4gaW1wbGVtZW50YXRpb24gb2YgdGhlIHJlbm93bmVkIEZpc2hlci1ZYXRlcyBhbGdvcml0aG0sIGJ1dCB3aXRoIGEgdHdpc3Q6IFlvdSBtYXkgcGFzcyBpbiBhXG4gIGByYXRpb2AgYXMgc2Vjb25kIGFyZ3VtZW50ICh3aGljaCBzaG91bGQgYmUgYSBmbG9hdCBpbiB0aGUgcmFuZ2UgYDAgPD0gcmF0aW8gPD0gMWApOyBpZiBzZXQgdG8gYSB2YWx1ZVxuICBsZXNzIHRoYW4gb25lLCBhIHJhbmRvbSBudW1iZXIgd2lsbCBiZSB1c2VkIHRvIGRlY2lkZSB3aGV0aGVyIG9yIG5vdCB0byBwZXJmb3JtIGEgZ2l2ZW4gc3RlcCBpbiB0aGVcbiAgc2h1ZmZsaW5nIHByb2Nlc3MsIHNvIGxpc3RzIHNodWZmbGVkIHdpdGggemVyby1pc2ggcmF0aW9zIHdpbGwgc2hvdyBsZXNzIGRpc29yZGVyIHRoYW4gbGlzdHMgc2h1ZmZsZWQgd2l0aFxuICBhIG9uZS1pc2ggcmF0aW8uXG5cbiAgSW1wbGVtZW50YXRpb24gZ2xlYW5lZCBmcm9tIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzk2Mjg5MC8yNTYzNjEuICMjI1xuICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gIHJldHVybiBsaXN0IGlmICggdGhpc19pZHggPSBsaXN0Lmxlbmd0aCApIDwgMlxuICByZXR1cm4gQF9zaHVmZmxlIGxpc3QsIHJhdGlvLCBNYXRoLnJhbmRvbSwgQHJhbmRvbV9pbnRlZ2VyLmJpbmQgQFxuXG4jLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbkBnZXRfc2h1ZmZsZSA9ICggc2VlZF8wID0gMCwgc2VlZF8xID0gMSApIC0+XG4gICMjIyBUaGlzIG1ldGhvZCB3b3JrcyBzaW1pbGFyIHRvIGBnZXRfcm5kYDsgaXQgYWNjZXB0cyB0d28gYHNlZWRgcyB3aGljaCBhcmUgdXNlZCB0byBwcm9kdWNlIHJhbmRvbSBudW1iZXJcbiAgZ2VuZXJhdG9ycyBhbmQgcmV0dXJucyBhIHByZWRpY3RhYmxlIHNodWZmbGluZyBmdW5jdGlvbiB0aGF0IGFjY2VwdHMgYXJndW1lbnRzIGxpa2UgQml0cydOJ1BpZWNlc1xuICBgc2h1ZmZsZWAuICMjI1xuICBybmQgICAgICAgICAgICAgPSBAZ2V0X3JuZCAgICAgIHNlZWRfMFxuICByYW5kb21faW50ZWdlciAgPSBAZ2V0X3JuZF9pbnQgIHNlZWRfMVxuICByZXR1cm4gKCBsaXN0LCByYXRpbyA9IDEgKSA9PiBAX3NodWZmbGUgbGlzdCwgcmF0aW8sIHJuZCwgcmFuZG9tX2ludGVnZXJcblxuIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5AX3NodWZmbGUgPSAoIGxpc3QsIHJhdGlvLCBybmQsIHJhbmRvbV9pbnRlZ2VyICkgLT5cbiAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICByZXR1cm4gbGlzdCBpZiAoIHRoaXNfaWR4ID0gbGlzdC5sZW5ndGggKSA8IDJcbiAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICBsb29wXG4gICAgdGhpc19pZHggKz0gLTFcbiAgICByZXR1cm4gbGlzdCBpZiB0aGlzX2lkeCA8IDFcbiAgICBpZiByYXRpbyA+PSAxIG9yIHJuZCgpIDw9IHJhdGlvXG4gICAgICAjIHJldHVybiBsaXN0IGlmIHRoaXNfaWR4IDwgMVxuICAgICAgdGhhdF9pZHggPSByYW5kb21faW50ZWdlciAwLCB0aGlzX2lkeFxuICAgICAgWyBsaXN0WyB0aGF0X2lkeCBdLCBsaXN0WyB0aGlzX2lkeCBdIF0gPSBbIGxpc3RbIHRoaXNfaWR4IF0sIGxpc3RbIHRoYXRfaWR4IF0gXVxuICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gIHJldHVybiBsaXN0XG5cblxuXG4jPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiMgUkFORE9NIE5VTUJFUlNcbiMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIyAjIyMgc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL051bWJlciAjIyNcbiMgQE1JTl9TQUZFX0lOVEVHRVIgPSAtKCAyICoqIDUzICkgLSAxXG4jIEBNQVhfU0FGRV9JTlRFR0VSID0gKyggMiAqKiA1MyApIC0gMVxuXG4jLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbkByYW5kb21fbnVtYmVyID0gKCBtaW4gPSAwLCBtYXggPSAxICkgLT5cbiAgIyMjIFJldHVybiBhIHJhbmRvbSBudW1iZXIgYmV0d2VlbiBtaW4gKGluY2x1c2l2ZSkgYW5kIG1heCAoZXhjbHVzaXZlKS5cbiAgRnJvbSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9NYXRoL3JhbmRvbVxuICB2aWEgaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMTUyNzgyMC8yNTYzNjEuICMjI1xuICByZXR1cm4gTWF0aC5yYW5kb20oKSAqICggbWF4IC0gbWluICkgKyBtaW5cblxuIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5AaW50ZWdlcl9mcm9tX25vcm1hbF9mbG9hdCA9ICggeCwgbWluID0gMCwgbWF4ID0gMiApIC0+XG4gICMjIyBHaXZlbiBhICdub3JtYWwnIGZsb2F0IGB4YCBzbyB0aGF0IGAwIDw9IHggPCAxYCwgcmV0dXJuIGFuIGludGVnZXIgYG5gIHNvIHRoYXQgYG1pbiA8PSBuIDwgbWluYC4gIyMjXG4gIHJldHVybiAoIE1hdGguZmxvb3IgeCAqICggbWF4IC0gbWluICkgKSArIG1pblxuXG4jLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbkByYW5kb21faW50ZWdlciA9ICggbWluID0gMCwgbWF4ID0gMiApIC0+XG4gICMjIyBSZXR1cm4gYSByYW5kb20gaW50ZWdlciBiZXR3ZWVuIG1pbiAoaW5jbHVzaXZlKSBhbmQgbWF4IChleGNsdXNpdmUpLlxuICBGcm9tIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL01hdGgvcmFuZG9tXG4gIHZpYSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8xNTI3ODIwLzI1NjM2MS4gIyMjXG4gIHJldHVybiBAaW50ZWdlcl9mcm9tX25vcm1hbF9mbG9hdCBNYXRoLnJhbmRvbSgpLCBtaW4sIG1heFxuXG4jLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbkBnZXRfcm5kX2ludCA9ICggc2VlZCA9IDEsIGRlbHRhID0gMSApIC0+XG4gICMjIyBMaWtlIGBnZXRfcm5kYCwgYnV0IHJldHVybnMgYSBwcmVkaWN0YWJsZSByYW5kb20gaW50ZWdlciBnZW5lcmF0b3IuICMjI1xuICBybmQgPSBAZ2V0X3JuZCBzZWVkLCBkZWx0YVxuICByZXR1cm4gKCBtaW4gPSAwLCBtYXggPSAxICkgPT4gQGludGVnZXJfZnJvbV9ub3JtYWxfZmxvYXQgcm5kKCksIG1pbiwgbWF4XG5cbiMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuQGdldF9ybmQgPSAoIHNlZWQgPSAxLCBkZWx0YSA9IDEgKSAtPlxuICAjIyMgVGhpcyBtZXRob2QgcmV0dXJucyBhIHNpbXBsZSBkZXRlcm1pbmlzdGljIHBzZXVkby1yYW5kb20gbnVtYmVyIGdlbmVyYXRvcuKAlGJhc2ljYWxseSBsaWtlXG4gIGBNYXRoLnJhbmRvbWAsIGJ1dCAoMSkgdmVyeSBwcm9iYWJseSB3aXRoIGEgbXVjaCB3b3JzZSBkaXN0cmlidXRpb24gb2YgcmVzdWx0cywgYW5kICgyKSB3aXRoIHByZWRpY3RhYmxlXG4gIHNlcmllcyBvZiBudW1iZXJzLCB3aGljaCBpcyBnb29kIGZvciBzb21lIHRlc3Rpbmcgc2NlbmFyaW9zLiBZb3UgbWF5IHNlZWQgdGhpcyBtZXRob2QgYnkgcGFzc2luZyBpbiBhXG4gIGBzZWVkYCBhbmQgYSBgZGVsdGFgLCBib3RoIG9mIHdoaWNoIG11c3QgYmUgbm9uLXplcm8gbnVtYmVyczsgdGhlIGVuc3Vpbmcgc2VyaWVzIG9mIGNhbGxzIHRvIHRoZSByZXR1cm5lZFxuICBtZXRob2Qgd2lsbCB0aGVuIGFsd2F5cyByZXN1bHQgaW4gdGhlIHNhbWUgc2VyaWVzIG9mIG51bWJlcnMuIEhlcmUgaXMgYSB1c2FnZSBleGFtcGxlIHRoYXQgYWxzbyBzaG93cyBob3dcbiAgdG8gcmVzZXQgdGhlIGdlbmVyYXRvcjpcblxuICAgICAgQ05EID0gcmVxdWlyZSAnY25kJ1xuICAgICAgcm5kID0gQ05ELmdldF9ybmQoKSAjIG9yLCBzYXksIGBybmQgPSBDTkQuZ2V0X3JuZCAxMjMsIDAuNWBcbiAgICAgIGxvZyBybmQoKSBmb3IgaWR4IGluIFsgMCAuLiA1IF1cbiAgICAgIGxvZygpXG4gICAgICBybmQucmVzZXQoKVxuICAgICAgbG9nIHJuZCgpIGZvciBpZHggaW4gWyAwIC4uIDUgXVxuXG4gIFBsZWFzZSBub3RlIHRoYXQgdGhlcmUgYXJlIG5vIHN0cm9uZyBndWFyYW50ZWVzIG1hZGUgYWJvdXQgdGhlIHF1YWxpdHkgb2YgdGhlIGdlbmVyYXRlZCB2YWx1ZXMgZXhjZXB0IHRoZVxuICAoMSkgZGV0ZXJtaW5pc3RpYyByZXBlYXRhYmlsaXR5LCAoMikgYm91bmRlZG5lc3MsIGFuZCAoMykgJ2FwcGFyZW50IHJhbmRvbW5lc3MnLiBEbyAqKm5vdCoqIHVzZSB0aGlzIGZvclxuICBjcnlwdG9ncmFwaGljIHB1cnBvc2VzLiAjIyNcbiAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICBSID0gLT5cbiAgICBSLl9pZHggICs9IDFcbiAgICB4ICAgICAgID0gKCBNYXRoLnNpbiBSLl9zICkgKiAxMDAwMFxuICAgIFIuX3MgICAgKz0gUi5fZGVsdGFcbiAgICByZXR1cm4geCAtIE1hdGguZmxvb3IgeFxuICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gIFIucmVzZXQgPSAoIHNlZWQsIGRlbHRhICkgLT5cbiAgICAjIyMgUmVzZXQgdGhlIGdlbmVyYXRvci4gQWZ0ZXIgY2FsbGluZyBgcm5kLnJlc2V0YCAob3IgYHJuZC5zZWVkYCB3aXRoIHRoZSBzYW1lIGFyZ3VtZW50cyksIGVuc3VpbmcgY2FsbHNcbiAgICB0byBgcm5kYCB3aWxsIGFsd2F5cyByZXN1bHQgaW4gdGhlIHNhbWUgc2VxdWVuY2Ugb2YgcHNldWRvLXJhbmRvbSBudW1iZXJzLiAjIyNcbiAgICBzZWVkICAgPz0gQC5fc2VlZFxuICAgIGRlbHRhICA/PSBALl9kZWx0YVxuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgdW5sZXNzICggdHlwZW9mIHNlZWQgICkgaXMgJ251bWJlcicgYW5kICggTnVtYmVyLmlzRmluaXRlIHNlZWQgICkgdGhlbiB0aHJvdyBuZXcgRXJyb3IgXCJeMzM5N14gZXhwZWN0ZWQgYSBudW1iZXIsIGdvdCAje3JwciBzZWVkfVwiXG4gICAgdW5sZXNzICggdHlwZW9mIGRlbHRhICkgaXMgJ251bWJlcicgYW5kICggTnVtYmVyLmlzRmluaXRlIGRlbHRhICkgdGhlbiB0aHJvdyBuZXcgRXJyb3IgXCJeMzM5OF4gZXhwZWN0ZWQgYSBudW1iZXIsIGdvdCAje3JwciBkZWx0YX1cIlxuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgdGhyb3cgbmV3IEVycm9yIFwic2VlZCBzaG91bGQgbm90IGJlIHplcm9cIiAgdW5sZXNzIHNlZWQgICE9IDBcbiAgICB0aHJvdyBuZXcgRXJyb3IgXCJkZWx0YSBzaG91bGQgbm90IGJlIHplcm9cIiB1bmxlc3MgZGVsdGEgIT0gMFxuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgUi5fcyAgICAgPSBzZWVkXG4gICAgUi5fc2VlZCAgPSBzZWVkXG4gICAgUi5fZGVsdGEgPSBkZWx0YVxuICAgIFIuX2lkeCAgID0gLTFcbiAgICByZXR1cm4gbnVsbFxuICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gIFIucmVzZXQgc2VlZCwgZGVsdGFcbiAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICByZXR1cm4gUlxuXG4iXX0=
//# sourceURL=../src/rnd.coffee