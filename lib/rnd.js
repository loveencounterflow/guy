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

//# sourceMappingURL=rnd.js.map