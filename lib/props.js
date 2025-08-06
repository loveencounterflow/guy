(function() {
  'use strict';
  /* see https://nodejs.org/dist/latest-v18.x/docs/api/util.html#utilinspectcustom */
  var GUY_props, H, Strict_owner, builtins, def, def_oneoff, get, hide, no_such_value, node_inspect, rpr;

  //###########################################################################################################
  GUY_props = this;

  no_such_value = Symbol('no_such_value');

  H = require('./_helpers');

  builtins = require('./_builtins');

  this._misfit = Symbol('misfit');

  this._misfit2 = Symbol('misfit2');

  ({rpr} = require('./trm'));

  node_inspect = Symbol.for('nodejs.util.inspect.custom');

  //-----------------------------------------------------------------------------------------------------------
  H.types.declare('guy_props_keys_cfg', {
    tests: {
      "@isa.object x": function(x) {
        return this.isa.object(x);
      },
      "@isa_optional.cardinal x.depth": function(x) {
        return this.isa_optional.cardinal(x.depth);
      },
      "@isa.boolean x.allow_any": function(x) {
        return this.isa.boolean(x.allow_any);
      },
      "@isa.boolean x.symbols": function(x) {
        return this.isa.boolean(x.symbols);
      },
      "@isa.boolean x.hidden": function(x) {
        return this.isa.boolean(x.hidden);
      },
      "@isa.boolean x.depth_first": function(x) {
        return this.isa.boolean(x.depth_first);
      },
      "@isa.boolean x.builtins": function(x) {
        return this.isa.boolean(x.builtins);
      },
      "@isa.boolean x.builtins implies x.hidden": function(x) {
        return (!x.builtins) || x.hidden;
      }
    }
  });

  //...........................................................................................................
  H.types.defaults.guy_props_keys_cfg = {
    allow_any: true,
    symbols: false,
    builtins: false,
    hidden: false,
    depth: null,
    depth_first: false
  };

  //-----------------------------------------------------------------------------------------------------------
  H.types.declare('guy_props_crossmerge_cfg', {
    tests: {
      "@isa.guy_props_keys_cfg x": function(x) {
        return this.isa.guy_props_keys_cfg(x);
      },
      "x.keys?": function(x) {
        return x.keys != null;
      },
      "x.values?": function(x) {
        return x.values != null;
      },
      "x.fallback can be anything": function(x) {
        return true;
      }
    }
  });

  //...........................................................................................................
  /* TAINT code duplication */
  H.types.defaults.guy_props_crossmerge_cfg = {
    allow_any: true,
    symbols: false,
    builtins: false,
    hidden: false,
    depth: null,
    depth_first: false,
    keys: null,
    values: null,
    fallback: this._misfit
  };

  //-----------------------------------------------------------------------------------------------------------
  H.types.declare('guy_props_tree_cfg', {
    tests: {
      "@isa.guy_props_keys_cfg x": function(x) {
        return this.isa.guy_props_keys_cfg(x);
      },
      "@isa_optional.function x.evaluate": function(x) {
        return this.isa_optional.function(x.evaluate);
      },
      "@isa_optional.text x.sep": function(x) {
        return this.isa_optional.text(x.sep);
      }
    }
  });

  //...........................................................................................................
  /* TAINT code duplication */
  H.types.defaults.guy_props_tree_cfg = {
    allow_any: true,
    symbols: false,
    builtins: false,
    hidden: false,
    depth: null,
    depth_first: null,
    evaluate: null,
    sep: null
  };

  //-----------------------------------------------------------------------------------------------------------
  H.types.declare('guy_props_tree_verdict', function(x) {
    if (this.isa.boolean(x)) {
      return true;
    }
    if (!this.isa.text(x)) {
      return false;
    }
    return true;
  });

  //-----------------------------------------------------------------------------------------------------------
  H.types.declare('guy_props_strict_owner', function(x) {
    return x instanceof Strict_owner;
  });

  //-----------------------------------------------------------------------------------------------------------
  H.types.declare('guy_props_strict_owner_cfg', {
    tests: {
      "@isa.object x": function(x) {
        return this.isa.object(x);
      },
      "x.target?": function(x) {
        return x.target != null;
      },
      "@isa.boolean x.locked": function(x) {
        return this.isa.boolean(x.locked);
      },
      "@isa.boolean x.seal": function(x) {
        return this.isa.boolean(x.seal);
      },
      "@isa.boolean x.freeze": function(x) {
        return this.isa.boolean(x.freeze);
      },
      "@isa.boolean x.oneshot": function(x) {
        return this.isa.boolean(x.oneshot);
      },
      "@isa_optional.boolean x.reset": function(x) {
        return this.isa_optional.boolean(x.reset);
      },
      // "reassignable object cannot be frozen": ( x ) ->
      //   return false if x.oneshot and x.freeze
      //   return true
      "x.reset is deprecated": function(x) {
        if (x.reset != null) {
          return true;
        }
        if (x.reset === true) {
          return true;
        }
        throw new Error("^guy.props.Strict_owner@1^ `cfg.reset: false` is deprecated; use `cfg.seal: true` instead");
      }
    }
  });

  //...........................................................................................................
  H.types.defaults.guy_props_strict_owner_cfg = {
    target: null,
    reset: true,
    locked: true,
    seal: false,
    freeze: false,
    oneshot: false
  };

  //-----------------------------------------------------------------------------------------------------------
  this.def = def = Object.defineProperty;

  this.hide = hide = (object, name, value) => {
    return Object.defineProperty(object, name, {
      enumerable: false,
      writable: true,
      configurable: true,
      value: value
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this.def_oneoff = def_oneoff = (object, name, cfg, method) => {
    var get;
    get = function() {
      var R, ref, ref1;
      R = method.apply(object);
      delete cfg.get;
      def(object, name, {
        configurable: (ref = cfg.configurable) != null ? ref : true,
        enumerable: (ref1 = cfg.enumerable) != null ? ref1 : true,
        value: R
      });
      return R;
    };
    def(object, name, {
      enumerable: true,
      configurable: true,
      get
    });
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this._pick_with_fallback = function(d, fallback, ...keys) {
    var R, i, key, len, value;
    R = {};
    keys = keys.flat(2e308);
    for (i = 0, len = keys.length; i < len; i++) {
      key = keys[i];
      R[key] = (value = d[key]) === void 0 ? fallback : value;
    }
    return [R, keys];
  };

  //-----------------------------------------------------------------------------------------------------------
  this.pick_with_fallback = function(d, fallback, ...keys) {
    return (this._pick_with_fallback(d, fallback, keys))[0];
  };

  //-----------------------------------------------------------------------------------------------------------
  this.pluck_with_fallback = function(d, fallback, ...keys) {
    var R, i, key, len;
    [R, keys] = this._pick_with_fallback(d, fallback, ...keys);
    for (i = 0, len = keys.length; i < len; i++) {
      key = keys[i];
      delete d[key];
    }
    return R;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.nullify_undefined = function(d) {
    var R, k, v;
    R = {};
    for (k in d) {
      v = d[k];
      R[k] = v != null ? v : null;
    }
    return R;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.omit_nullish = function(d) {
    var R, k, v;
    R = {};
    for (k in d) {
      v = d[k];
      if (v != null) {
        R[k] = v;
      }
    }
    return R;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.nonull_assign = function(first, ...others) {
    var other;
    return Object.assign({}, first, ...((function() {
      var i, len, results;
      results = [];
      for (i = 0, len = others.length; i < len; i++) {
        other = others[i];
        results.push(this.omit_nullish(other));
      }
      return results;
    }).call(this)));
  };

  //-----------------------------------------------------------------------------------------------------------
  this.crossmerge = function(cfg) {
    var R, key, value;
    H.types.validate.guy_props_crossmerge_cfg((cfg = {...H.types.defaults.guy_props_crossmerge_cfg, ...cfg}));
    R = {};
    for (key of this._walk_keys(cfg.keys, cfg)) {
      if ((value = this.get(cfg.values, key, this._misfit2)) !== this._misfit2) {
        R[key] = value;
        continue;
      }
      if (cfg.fallback === this._misfit) {
        throw new Error(`^guy.props.crossmerge@1^ missing key ${H.rpr(key)} in values`);
      }
      R[key] = cfg.fallback;
    }
    return R;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.resolve_property_chain = function(owner, property_chain) {
    var R, i, len, term;
    R = owner;
    for (i = 0, len = property_chain.length; i < len; i++) {
      term = property_chain[i];
      R = R[term];
    }
    return R;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.Strict_owner = (function() {
    var Strict_owner_cfg;

    class Strict_owner {
      //---------------------------------------------------------------------------------------------------------
      static _get_proxy_cfg(instance, cfg) {
        var R;
        R = {
          //.....................................................................................................
          ownKeys: function(target) {
            return Reflect.ownKeys(target);
          },
          //.....................................................................................................
          get: function(target, key) {
            var value;
            if (key === Symbol.toStringTag) {
              return `${instance.constructor.name}`;
            }
            if (key === 'constructor') {
              return target.constructor;
            }
            if (key === 'toString') {
              return target.toString;
            }
            if (key === 'call') {
              return target.call;
            }
            if (key === 'apply') {
              return target.apply;
            }
            if (key === 'then') {
              return target.then;
            }
            if (key === Symbol.iterator) {
              return target[Symbol.iterator];
            }
            if (key === node_inspect) {
              return target[node_inspect];
            }
            if (key === '0') {
              /* NOTE necessitated by behavior of `node:util.inspect()`: */
              return target[0];
            }
            if ((value = GUY_props.get(target, key, no_such_value)) === no_such_value) {
              if (!cfg.locked) {
                return void 0;
              }
              throw new Error(`^guy.props.Strict_owner@1^ ${instance.constructor.name} instance does not have property ${H.rpr(key)}`);
            }
            return value;
          },
          //.....................................................................................................
          set: function(target, key, value) {
            if (GUY_props.has(target, key)) {
              throw new Error(`^guy.props.Strict_owner@1^ ${instance.constructor.name} instance already has property ${H.rpr(key)}`);
            }
            return Reflect.set(target, key, value);
          }
        };
        //.......................................................................................................
        return R;
      }

      //---------------------------------------------------------------------------------------------------------
      static get_locked(self) {
        return self[Strict_owner_cfg].locked;
      }

      //---------------------------------------------------------------------------------------------------------
      static set_locked(self, flag) {
        H.types.validate.boolean(flag);
        self[Strict_owner_cfg].locked = flag;
        return flag;
      }

      //---------------------------------------------------------------------------------------------------------
      constructor(cfg) {
        var R, proxy_cfg;
        cfg = {
          target: this,
          ...cfg
        };
        H.types.validate.guy_props_strict_owner_cfg(cfg = {...H.types.defaults.guy_props_strict_owner_cfg, ...cfg});
        proxy_cfg = this.constructor._get_proxy_cfg(this, cfg);
        if (!cfg.oneshot) {
          delete proxy_cfg.set;
        }
        R = new Proxy(cfg.target, proxy_cfg);
        GUY_props.hide(R, Strict_owner_cfg, cfg);
        if (cfg.freeze) {
          Object.freeze(R);
        }
        if (cfg.seal) {
          Object.seal(R);
        }
        return R;
      }

      //---------------------------------------------------------------------------------------------------------
      static create(cfg) {
        var R, proxy_cfg;
        cfg = {
          target: {},
          ...cfg
        };
        H.types.validate.guy_props_strict_owner_cfg(cfg = {...H.types.defaults.guy_props_strict_owner_cfg, ...cfg});
        proxy_cfg = this._get_proxy_cfg(cfg.target, cfg);
        if (!cfg.oneshot) {
          delete proxy_cfg.set;
        }
        R = new Proxy(cfg.target, proxy_cfg);
        GUY_props.hide(R, Strict_owner_cfg, cfg);
        if (cfg.freeze) {
          /* TAINT consider to freeze, seal target instread of proxy */
          Object.freeze(R);
        }
        if (cfg.seal) {
          Object.seal(R);
        }
        return R;
      }

    };

    //---------------------------------------------------------------------------------------------------------
    Strict_owner_cfg = Symbol('Strict_owner_cfg');

    return Strict_owner;

  }).call(this);

  //-----------------------------------------------------------------------------------------------------------
  Strict_owner = this.Strict_owner;

  //===========================================================================================================
  // KEY TESTING, RETRIEVAL, CATALOGUING
  //-----------------------------------------------------------------------------------------------------------
  this.has = (target, key) => {
    var error, prototype;
    try {
      /* safe version of `Reflect.has()` that never throws an error */
      /* try to use `Reflect.has()` on given target; will fail for `null`, `undefined`, primitive values: */
      return Reflect.has(target, key);
    } catch (error1) {
      error = error1;
      null;
    }
    try {
      if ((prototype = Object.getPrototypeOf(target)) == null) {
        /* try to retrieve prototype of target; will fail for `null`, `undefined`: */
        return false;
      }
    } catch (error1) {
      error = error1;
      null;
    }
    if (prototype == null) {
      /* give up if no prototye has been returned (may happen e.g. with `target = Object.create null`): */
      return false;
    }
    /* apply `Reflect.has()` to prototype of target; this should be the definitive answer: */
    return Reflect.has(prototype, key);
  };

  //-----------------------------------------------------------------------------------------------------------
  get = function(target, key, fallback) {
    var arity;
    switch (arity = arguments.length) {
      case 2:
        fallback = this._misfit;
        break;
      case 3:
        null;
        break;
      default:
        throw new Error(`^guy.props.get@1^ expected 2 or 3 arguments, got ${arity}`);
    }
    if (this.has(target, key)) {
      return target[key];
    }
    if (fallback !== this._misfit) {
      return fallback;
    }
    throw new Error(`^guy.props.get@1^ no such property ${H.rpr(key)}`);
  };

  this.get = get.bind(this);

  //-----------------------------------------------------------------------------------------------------------
  this./* avoiding fat-arrow function so we can use `arguments` */_get_keys_cfg = function(cfg) {
    var has_hidden;
    has_hidden = (cfg != null ? cfg : {}).hidden != null;
    cfg = {...H.types.defaults.guy_props_keys_cfg, ...cfg};
    if (!has_hidden && cfg.builtins) {
      cfg.hidden = true;
    }
    H.types.validate.guy_props_keys_cfg(cfg);
    return cfg;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.keys = (owner, cfg) => {
    return [...(this._walk_keys(owner, this._get_keys_cfg(cfg)))];
  };

  //-----------------------------------------------------------------------------------------------------------
  this.has_any_keys = (owner, cfg) => {
    var key;
    for (key of this._walk_keys(owner, this._get_keys_cfg(cfg))) {
      return true;
    }
    return false;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.walk_keys = (owner, cfg) => {
    return this._walk_keys(owner, this._get_keys_cfg(cfg));
  };

  //-----------------------------------------------------------------------------------------------------------
  this._walk_keys = function*(owner, cfg) {
    var cache, collector, i, j, key, len, len1, ref, ref1, seen, y, z;
    seen = new Set();
    if (cfg.depth_first) {
      cache = new Map();
      for (y of this._walk_keyowners(owner, cfg)) {
        ({key, owner} = y);
        if ((collector = cache.get(owner)) == null) {
          cache.set(owner, collector = []);
        }
        collector.push(key);
      }
      ref = [...cache.keys()].reverse();
      for (i = 0, len = ref.length; i < len; i++) {
        owner = ref[i];
        ref1 = cache.get(owner);
        for (j = 0, len1 = ref1.length; j < len1; j++) {
          key = ref1[j];
          if (seen.has(key)) {
            continue;
          }
          seen.add(key);
          yield key;
        }
      }
    } else {
      for (z of this._walk_keyowners(owner, cfg)) {
        ({key} = z);
        if (seen.has(key)) {
          continue;
        }
        seen.add(key);
        yield key;
      }
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.get_prototype_chain = function(x) {
    var R;
    if (x == null) {
      return [];
    }
    R = [x];
    while (true) {
      if ((x = Object.getPrototypeOf(x)) == null) {
        break;
      }
      R.push(x);
    }
    return R;
  };

  //-----------------------------------------------------------------------------------------------------------
  this._walk_keyowners = function*(owner, cfg, current_depth = 0) {
    var d, error, i, key, len, proto_owner, ref;
    if ((cfg.depth != null) && current_depth > cfg.depth) {
      return null;
    }
    if ((!cfg.builtins) && builtins.has(owner)) {
      return null;
    }
    try {
      ref = Reflect.ownKeys(owner);
      for (i = 0, len = ref.length; i < len; i++) {
        key = ref[i];
        if ((!cfg.symbols) && (H.types.isa.symbol(key))) {
          continue;
        }
        d = Object.getOwnPropertyDescriptor(owner, key);
        if ((!cfg.hidden) && (!d.enumerable)) {
          continue;
        }
        yield ({key, owner});
      }
    } catch (error1) {
      error = error1;
      if (cfg.allow_any && (error.message === 'Reflect.ownKeys called on non-object')) {
        return null;
      }
      throw new Error(`^guy.props._walk_keyowners@1^ Reflect.ownKeys called on non-object ${rpr(owner)}`);
    }
    //.........................................................................................................
    if ((proto_owner = Object.getPrototypeOf(owner)) != null) {
      yield* this._walk_keyowners(proto_owner, cfg, current_depth + 1);
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.xray = (owner, base = {}) => {
    var k;
    for (k of this._walk_keys(owner, {
      hidden: true,
      symbols: true,
      builtins: false
    })) {
      base[k] = owner[k];
    }
    return base;
  };

  //-----------------------------------------------------------------------------------------------------------
  /* thx to https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptors#creating_a_shallow_copy */
  this._shallow_copy = function(d) {
    return Object.create(Object.getPrototypeOf(d), Object.getOwnPropertyDescriptors(d));
  };

  //===========================================================================================================
  // TREE
  //-----------------------------------------------------------------------------------------------------------
  this.tree = function(owner, cfg) {
    return [...(this.walk_tree(owner, cfg))];
  };

  //-----------------------------------------------------------------------------------------------------------
  this.walk_tree = function*(owner, cfg) {
    var p, x;
    H.types.validate.guy_props_tree_cfg((cfg = {...H.types.defaults.guy_props_tree_cfg, ...cfg}));
    if (cfg.sep == null) {
      return (yield* this._walk_tree(owner, cfg));
    }
    for (p of this._walk_tree(owner, cfg)) {
      yield ((function() {
        var i, len, results;
        results = [];
        for (i = 0, len = p.length; i < len; i++) {
          x = p[i];
          results.push(x.toString());
        }
        return results;
      })()).join(cfg.sep);
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this._walk_tree = function*(owner, cfg, seen) {
    var error, key, seen_keys, subkey, subowner, value, verdict, y;
    if (seen == null) {
      seen = new Map();
    }
    for (y of this._walk_keyowners(owner, cfg)) {
      ({
        key,
        owner: subowner
      } = y);
      if (!seen.has(subowner)) {
        seen.set(subowner, new Set());
      }
      if ((seen_keys = seen.get(subowner)).has(key)) {
        continue;
      }
      seen_keys.add(key);
      try {
        value = subowner[key];
      } catch (error1) {
        error = error1;
        if (cfg.allow_any && (/'caller', 'callee', and 'arguments' properties may not be accessed/.test(error.message))) {
          continue;
        }
      }
      verdict = cfg.evaluate != null ? cfg.evaluate({
        owner: subowner,
        key,
        value
      }) : 'take,descend';
      H.types.validate.guy_props_tree_verdict(verdict);
      if (verdict === false) {
        continue;
      }
      if (verdict === true) {
        verdict = 'take,descend';
      }
      if (/\btake\b/.test(verdict)) {
        yield [key];
      }
      if (!/\bdescend\b/.test(verdict)) {
        continue;
      }
      for (subkey of this._walk_tree(value, cfg, seen)) {
        yield [key, subkey].flat();
      }
    }
    return null;
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3Byb3BzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQTtFQUFBLGFBQUE7O0FBQUEsTUFBQSxTQUFBLEVBQUEsQ0FBQSxFQUFBLFlBQUEsRUFBQSxRQUFBLEVBQUEsR0FBQSxFQUFBLFVBQUEsRUFBQSxHQUFBLEVBQUEsSUFBQSxFQUFBLGFBQUEsRUFBQSxZQUFBLEVBQUEsR0FBQTs7O0VBR0EsU0FBQSxHQUE0Qjs7RUFDNUIsYUFBQSxHQUE0QixNQUFBLENBQU8sZUFBUDs7RUFDNUIsQ0FBQSxHQUE0QixPQUFBLENBQVEsWUFBUjs7RUFDNUIsUUFBQSxHQUE0QixPQUFBLENBQVEsYUFBUjs7RUFDNUIsSUFBQyxDQUFBLE9BQUQsR0FBNEIsTUFBQSxDQUFPLFFBQVA7O0VBQzVCLElBQUMsQ0FBQSxRQUFELEdBQTRCLE1BQUEsQ0FBTyxTQUFQOztFQUM1QixDQUFBLENBQUUsR0FBRixDQUFBLEdBQTRCLE9BQUEsQ0FBUSxPQUFSLENBQTVCOztFQUVBLFlBQUEsR0FBNEIsTUFBTSxDQUFDLEdBQVAsQ0FBVyw0QkFBWCxFQVg1Qjs7O0VBZ0JBLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBUixDQUFnQixvQkFBaEIsRUFBc0M7SUFBQSxLQUFBLEVBQ3BDO01BQUEsZUFBQSxFQUFvRSxRQUFBLENBQUUsQ0FBRixDQUFBO2VBQVMsSUFBQyxDQUFBLEdBQUcsQ0FBQyxNQUFMLENBQVksQ0FBWjtNQUFULENBQXBFO01BQ0EsZ0NBQUEsRUFBb0UsUUFBQSxDQUFFLENBQUYsQ0FBQTtlQUFTLElBQUMsQ0FBQSxZQUFZLENBQUMsUUFBZCxDQUF1QixDQUFDLENBQUMsS0FBekI7TUFBVCxDQURwRTtNQUVBLDBCQUFBLEVBQW9FLFFBQUEsQ0FBRSxDQUFGLENBQUE7ZUFBUyxJQUFDLENBQUEsR0FBRyxDQUFDLE9BQUwsQ0FBYSxDQUFDLENBQUMsU0FBZjtNQUFULENBRnBFO01BR0Esd0JBQUEsRUFB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TUFDdkYsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsc0JBQWpCLENBQXdDLE9BQXhDO01BQ0EsSUFBWSxPQUFBLEtBQVcsS0FBdkI7QUFBQSxpQkFBQTs7TUFDQSxJQUE0QixPQUFBLEtBQVcsSUFBdkM7UUFBQSxPQUFBLEdBQVUsZUFBVjs7TUFDQSxJQUFpQixVQUFVLENBQUMsSUFBWCxDQUFnQixPQUFoQixDQUFqQjtRQUFBLE1BQU0sQ0FBRSxHQUFGLEVBQU47O01BQ0EsS0FBZ0IsYUFBYSxDQUFDLElBQWQsQ0FBbUIsT0FBbkIsQ0FBaEI7QUFBQSxpQkFBQTs7TUFDQSxLQUFBLDJDQUFBO1FBQ0UsTUFBTSxDQUFFLEdBQUYsRUFBTyxNQUFQLENBQWdCLENBQUMsSUFBakIsQ0FBQTtNQURSO0lBZkY7QUFpQkEsV0FBTztFQW5CSztBQWpYZCIsInNvdXJjZXNDb250ZW50IjpbIlxuJ3VzZSBzdHJpY3QnXG5cbiMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuR1VZX3Byb3BzICAgICAgICAgICAgICAgICA9IEBcbm5vX3N1Y2hfdmFsdWUgICAgICAgICAgICAgPSBTeW1ib2wgJ25vX3N1Y2hfdmFsdWUnXG5IICAgICAgICAgICAgICAgICAgICAgICAgID0gcmVxdWlyZSAnLi9faGVscGVycydcbmJ1aWx0aW5zICAgICAgICAgICAgICAgICAgPSByZXF1aXJlICcuL19idWlsdGlucydcbkBfbWlzZml0ICAgICAgICAgICAgICAgICAgPSBTeW1ib2wgJ21pc2ZpdCdcbkBfbWlzZml0MiAgICAgICAgICAgICAgICAgPSBTeW1ib2wgJ21pc2ZpdDInXG57IHJwciwgfSAgICAgICAgICAgICAgICAgID0gcmVxdWlyZSAnLi90cm0nXG4jIyMgc2VlIGh0dHBzOi8vbm9kZWpzLm9yZy9kaXN0L2xhdGVzdC12MTgueC9kb2NzL2FwaS91dGlsLmh0bWwjdXRpbGluc3BlY3RjdXN0b20gIyMjXG5ub2RlX2luc3BlY3QgICAgICAgICAgICAgID0gU3ltYm9sLmZvciAnbm9kZWpzLnV0aWwuaW5zcGVjdC5jdXN0b20nXG5cblxuXG4jLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbkgudHlwZXMuZGVjbGFyZSAnZ3V5X3Byb3BzX2tleXNfY2ZnJywgdGVzdHM6XG4gIFwiQGlzYS5vYmplY3QgeFwiOiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoIHggKSAtPiBAaXNhLm9iamVjdCB4XG4gIFwiQGlzYV9vcHRpb25hbC5jYXJkaW5hbCB4LmRlcHRoXCI6ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoIHggKSAtPiBAaXNhX29wdGlvbmFsLmNhcmRpbmFsIHguZGVwdGhcbiAgXCJAaXNhLmJvb2xlYW4geC5hbGxvd19hbnlcIjogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICggeCApIC0+IEBpc2EuYm9vbGVhbiB4LmFsbG93X2FueVxuICBcIkBpc2EuYm9vbGVhbiB4LnN5bWJvbHNcIjogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKCB4ICkgLT4gQGlzYS5ib29sZWFuIHguc3ltYm9sc1xuICBcIkBpc2EuYm9vbGVhbiB4LmhpZGRlblwiOiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKCB4ICkgLT4gQGlzYS5ib29sZWFuIHguaGlkZGVuXG4gIFwiQGlzYS5ib29sZWFuIHguZGVwdGhfZmlyc3RcIjogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoIHggKSAtPiBAaXNhLmJvb2xlYW4geC5kZXB0aF9maXJzdFxuICBcIkBpc2EuYm9vbGVhbiB4LmJ1aWx0aW5zXCI6ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKCB4ICkgLT4gQGlzYS5ib29sZWFuIHguYnVpbHRpbnNcbiAgXCJAaXNhLmJvb2xlYW4geC5idWlsdGlucyBpbXBsaWVzIHguaGlkZGVuXCI6ICAgICAgICAgICAgICAgICAgICAgICAgICggeCApIC0+XG4gICAgcmV0dXJuICggbm90IHguYnVpbHRpbnMgKSBvciAoIHguaGlkZGVuIClcbiMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuSC50eXBlcy5kZWZhdWx0cy5ndXlfcHJvcHNfa2V5c19jZmcgPVxuICBhbGxvd19hbnk6ICAgIHRydWVcbiAgc3ltYm9sczogICAgICBmYWxzZVxuICBidWlsdGluczogICAgIGZhbHNlXG4gIGhpZGRlbjogICAgICAgZmFsc2VcbiAgZGVwdGg6ICAgICAgICBudWxsXG4gIGRlcHRoX2ZpcnN0OiAgZmFsc2VcblxuIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5ILnR5cGVzLmRlY2xhcmUgJ2d1eV9wcm9wc19jcm9zc21lcmdlX2NmZycsIHRlc3RzOlxuICBcIkBpc2EuZ3V5X3Byb3BzX2tleXNfY2ZnIHhcIjogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKCB4ICkgLT4gQGlzYS5ndXlfcHJvcHNfa2V5c19jZmcgeFxuICBcIngua2V5cz9cIjogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKCB4ICkgLT4geC5rZXlzP1xuICBcIngudmFsdWVzP1wiOiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKCB4ICkgLT4geC52YWx1ZXM/XG4gIFwieC5mYWxsYmFjayBjYW4gYmUgYW55dGhpbmdcIjogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoIHggKSAtPiB0cnVlXG4jLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiMjIyBUQUlOVCBjb2RlIGR1cGxpY2F0aW9uICMjI1xuSC50eXBlcy5kZWZhdWx0cy5ndXlfcHJvcHNfY3Jvc3NtZXJnZV9jZmcgPVxuICBhbGxvd19hbnk6ICAgIHRydWVcbiAgc3ltYm9sczogICAgICBmYWxzZVxuICBidWlsdGluczogICAgIGZhbHNlXG4gIGhpZGRlbjogICAgICAgZmFsc2VcbiAgZGVwdGg6ICAgICAgICBudWxsXG4gIGRlcHRoX2ZpcnN0OiAgZmFsc2VcbiAga2V5czogICAgICAgICBudWxsXG4gIHZhbHVlczogICAgICAgbnVsbFxuICBmYWxsYmFjazogICAgIEBfbWlzZml0XG5cbiMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuSC50eXBlcy5kZWNsYXJlICdndXlfcHJvcHNfdHJlZV9jZmcnLCB0ZXN0czpcbiAgXCJAaXNhLmd1eV9wcm9wc19rZXlzX2NmZyB4XCI6ICAgICAgICAgICAgICAgICAgKCB4ICkgLT4gQGlzYS5ndXlfcHJvcHNfa2V5c19jZmcgeFxuICBcIkBpc2Ffb3B0aW9uYWwuZnVuY3Rpb24geC5ldmFsdWF0ZVwiOiAgICAgICAgICAoIHggKSAtPiBAaXNhX29wdGlvbmFsLmZ1bmN0aW9uIHguZXZhbHVhdGVcbiAgXCJAaXNhX29wdGlvbmFsLnRleHQgeC5zZXBcIjogICAgICAgICAgICAgICAgICAgKCB4ICkgLT4gQGlzYV9vcHRpb25hbC50ZXh0IHguc2VwXG4jLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiMjIyBUQUlOVCBjb2RlIGR1cGxpY2F0aW9uICMjI1xuSC50eXBlcy5kZWZhdWx0cy5ndXlfcHJvcHNfdHJlZV9jZmcgPVxuICBhbGxvd19hbnk6ICAgIHRydWVcbiAgc3ltYm9sczogICAgICBmYWxzZVxuICBidWlsdGluczogICAgIGZhbHNlXG4gIGhpZGRlbjogICAgICAgZmFsc2VcbiAgZGVwdGg6ICAgICAgICBudWxsXG4gIGRlcHRoX2ZpcnN0OiAgbnVsbFxuICBldmFsdWF0ZTogICAgIG51bGxcbiAgc2VwOiAgICAgICAgICBudWxsXG5cbiMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuSC50eXBlcy5kZWNsYXJlICdndXlfcHJvcHNfdHJlZV92ZXJkaWN0JywgKCB4ICkgLT5cbiAgcmV0dXJuIHRydWUgaWYgQGlzYS5ib29sZWFuIHhcbiAgcmV0dXJuIGZhbHNlIHVubGVzcyBAaXNhLnRleHQgeFxuICByZXR1cm4gdHJ1ZVxuXG4jLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbkgudHlwZXMuZGVjbGFyZSAnZ3V5X3Byb3BzX3N0cmljdF9vd25lcicsICggeCApIC0+IHggaW5zdGFuY2VvZiBTdHJpY3Rfb3duZXJcblxuIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5ILnR5cGVzLmRlY2xhcmUgJ2d1eV9wcm9wc19zdHJpY3Rfb3duZXJfY2ZnJywgdGVzdHM6XG4gIFwiQGlzYS5vYmplY3QgeFwiOiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoIHggKSAtPiBAaXNhLm9iamVjdCB4XG4gIFwieC50YXJnZXQ/XCI6ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoIHggKSAtPiB4LnRhcmdldD9cbiAgXCJAaXNhLmJvb2xlYW4geC5sb2NrZWRcIjogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICggeCApIC0+IEBpc2EuYm9vbGVhbiB4LmxvY2tlZFxuICBcIkBpc2EuYm9vbGVhbiB4LnNlYWxcIjogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKCB4ICkgLT4gQGlzYS5ib29sZWFuIHguc2VhbFxuICBcIkBpc2EuYm9vbGVhbiB4LmZyZWV6ZVwiOiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKCB4ICkgLT4gQGlzYS5ib29sZWFuIHguZnJlZXplXG4gIFwiQGlzYS5ib29sZWFuIHgub25lc2hvdFwiOiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoIHggKSAtPiBAaXNhLmJvb2xlYW4geC5vbmVzaG90XG4gIFwiQGlzYV9vcHRpb25hbC5ib29sZWFuIHgucmVzZXRcIjogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoIHggKSAtPiBAaXNhX29wdGlvbmFsLmJvb2xlYW4geC5yZXNldFxuICAjIFwicmVhc3NpZ25hYmxlIG9iamVjdCBjYW5ub3QgYmUgZnJvemVuXCI6ICggeCApIC0+XG4gICMgICByZXR1cm4gZmFsc2UgaWYgeC5vbmVzaG90IGFuZCB4LmZyZWV6ZVxuICAjICAgcmV0dXJuIHRydWVcbiAgXCJ4LnJlc2V0IGlzIGRlcHJlY2F0ZWRcIjogKCB4ICkgLT5cbiAgICByZXR1cm4gdHJ1ZSBpZiB4LnJlc2V0P1xuICAgIHJldHVybiB0cnVlIGlmIHgucmVzZXQgaXMgdHJ1ZVxuICAgIHRocm93IG5ldyBFcnJvciBcIl5ndXkucHJvcHMuU3RyaWN0X293bmVyQDFeIGBjZmcucmVzZXQ6IGZhbHNlYCBpcyBkZXByZWNhdGVkOyB1c2UgYGNmZy5zZWFsOiB0cnVlYCBpbnN0ZWFkXCJcbiMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuSC50eXBlcy5kZWZhdWx0cy5ndXlfcHJvcHNfc3RyaWN0X293bmVyX2NmZyA9XG4gIHRhcmdldDogICAgIG51bGxcbiAgcmVzZXQ6ICAgICAgdHJ1ZVxuICBsb2NrZWQ6ICAgICB0cnVlXG4gIHNlYWw6ICAgICAgIGZhbHNlXG4gIGZyZWV6ZTogICAgIGZhbHNlXG4gIG9uZXNob3Q6ICAgIGZhbHNlXG5cbiMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuQGRlZiAgPSBkZWYgICA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eVxuQGhpZGUgPSBoaWRlICA9ICggb2JqZWN0LCBuYW1lLCB2YWx1ZSApID0+IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSBvYmplY3QsIG5hbWUsXG4gICAgZW51bWVyYWJsZTogICBmYWxzZVxuICAgIHdyaXRhYmxlOiAgICAgdHJ1ZVxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIHZhbHVlOiAgICAgICAgdmFsdWVcblxuIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5AZGVmX29uZW9mZiA9IGRlZl9vbmVvZmYgPSAoIG9iamVjdCwgbmFtZSwgY2ZnLCBtZXRob2QgKSA9PlxuICBnZXQgPSAtPlxuICAgIFIgPSBtZXRob2QuYXBwbHkgb2JqZWN0XG4gICAgZGVsZXRlIGNmZy5nZXRcbiAgICBkZWYgb2JqZWN0LCBuYW1lLFxuICAgICAgY29uZmlndXJhYmxlOiAoIGNmZy5jb25maWd1cmFibGUgID8gdHJ1ZSApXG4gICAgICBlbnVtZXJhYmxlOiAgICggY2ZnLmVudW1lcmFibGUgICAgPyB0cnVlIClcbiAgICAgIHZhbHVlOiAgICAgICAgUlxuICAgIHJldHVybiBSXG4gIGRlZiBvYmplY3QsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlLCBnZXQsIH1cbiAgcmV0dXJuIG51bGxcblxuIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5AX3BpY2tfd2l0aF9mYWxsYmFjayA9ICggZCwgZmFsbGJhY2ssIGtleXMuLi4gKSAtPlxuICBSICAgICA9IHt9XG4gIGtleXMgID0ga2V5cy5mbGF0IEluZmluaXR5XG4gIGZvciBrZXkgaW4ga2V5c1xuICAgIFJbIGtleSBdID0gaWYgKCB2YWx1ZSA9IGRbIGtleSBdICkgaXMgdW5kZWZpbmVkIHRoZW4gZmFsbGJhY2sgZWxzZSB2YWx1ZVxuICByZXR1cm4gWyBSLCBrZXlzLCBdXG5cbiMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuQHBpY2tfd2l0aF9mYWxsYmFjayA9ICggZCwgZmFsbGJhY2ssIGtleXMuLi4gKSAtPiAoIEBfcGlja193aXRoX2ZhbGxiYWNrIGQsIGZhbGxiYWNrLCBrZXlzIClbIDAgXVxuXG4jLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbkBwbHVja193aXRoX2ZhbGxiYWNrID0gKCBkLCBmYWxsYmFjaywga2V5cy4uLiApIC0+XG4gIFsgUiwga2V5cywgXSA9IEBfcGlja193aXRoX2ZhbGxiYWNrIGQsIGZhbGxiYWNrLCBrZXlzLi4uXG4gIGRlbGV0ZSBkWyBrZXkgXSBmb3Iga2V5IGluIGtleXNcbiAgcmV0dXJuIFJcblxuIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5AbnVsbGlmeV91bmRlZmluZWQgPSAoIGQgKSAtPlxuICBSICAgICAgID0ge31cbiAgUlsgayBdICA9ICggdiA/IG51bGwgKSBmb3IgaywgdiBvZiBkXG4gIHJldHVybiBSXG5cbiMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuQG9taXRfbnVsbGlzaCA9ICggZCApIC0+XG4gIFIgICAgICAgPSB7fVxuICBSWyBrIF0gID0gdiBmb3IgaywgdiBvZiBkIHdoZW4gdj9cbiAgcmV0dXJuIFJcblxuIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5Abm9udWxsX2Fzc2lnbiA9ICggZmlyc3QsIG90aGVycy4uLiApIC0+XG4gIHJldHVybiBPYmplY3QuYXNzaWduIHt9LCBmaXJzdCwgKCBAb21pdF9udWxsaXNoIG90aGVyIGZvciBvdGhlciBpbiBvdGhlcnMgKS4uLlxuXG4jLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbkBjcm9zc21lcmdlID0gKCBjZmcgKSAtPlxuICBILnR5cGVzLnZhbGlkYXRlLmd1eV9wcm9wc19jcm9zc21lcmdlX2NmZyAoIGNmZyA9IHsgSC50eXBlcy5kZWZhdWx0cy5ndXlfcHJvcHNfY3Jvc3NtZXJnZV9jZmcuLi4sIGNmZy4uLiwgfSApXG4gIFIgICAgICAgPSB7fVxuICBmb3Iga2V5IGZyb20gQF93YWxrX2tleXMgY2ZnLmtleXMsIGNmZ1xuICAgIGlmICggdmFsdWUgPSBAZ2V0IGNmZy52YWx1ZXMsIGtleSwgQF9taXNmaXQyICkgaXNudCBAX21pc2ZpdDJcbiAgICAgIFJbIGtleSBdID0gdmFsdWVcbiAgICAgIGNvbnRpbnVlXG4gICAgaWYgY2ZnLmZhbGxiYWNrIGlzIEBfbWlzZml0XG4gICAgICB0aHJvdyBuZXcgRXJyb3IgXCJeZ3V5LnByb3BzLmNyb3NzbWVyZ2VAMV4gbWlzc2luZyBrZXkgI3tILnJwciBrZXl9IGluIHZhbHVlc1wiXG4gICAgUlsga2V5IF0gPSBjZmcuZmFsbGJhY2tcbiAgcmV0dXJuIFJcblxuIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5AcmVzb2x2ZV9wcm9wZXJ0eV9jaGFpbiA9ICggb3duZXIsIHByb3BlcnR5X2NoYWluICkgLT5cbiAgUiA9IG93bmVyXG4gIFIgPSBSWyB0ZXJtIF0gZm9yIHRlcm0gaW4gcHJvcGVydHlfY2hhaW5cbiAgcmV0dXJuIFJcblxuIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5jbGFzcyBAU3RyaWN0X293bmVyXG5cbiAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBTdHJpY3Rfb3duZXJfY2ZnID0gU3ltYm9sICdTdHJpY3Rfb3duZXJfY2ZnJ1xuXG4gICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgQF9nZXRfcHJveHlfY2ZnOiAoIGluc3RhbmNlLCBjZmcgKSAtPlxuICAgIFIgPVxuICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICBvd25LZXlzOiAoIHRhcmdldCApIC0+IFJlZmxlY3Qub3duS2V5cyB0YXJnZXRcbiAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgZ2V0OiAoIHRhcmdldCwga2V5ICkgLT5cbiAgICAgICAgcmV0dXJuIFwiI3tpbnN0YW5jZS5jb25zdHJ1Y3Rvci5uYW1lfVwiIGlmIGtleSBpcyBTeW1ib2wudG9TdHJpbmdUYWdcbiAgICAgICAgcmV0dXJuIHRhcmdldC5jb25zdHJ1Y3RvciAgICAgICAgICAgICBpZiBrZXkgaXMgJ2NvbnN0cnVjdG9yJ1xuICAgICAgICByZXR1cm4gdGFyZ2V0LnRvU3RyaW5nICAgICAgICAgICAgICAgIGlmIGtleSBpcyAndG9TdHJpbmcnXG4gICAgICAgIHJldHVybiB0YXJnZXQuY2FsbCAgICAgICAgICAgICAgICAgICAgaWYga2V5IGlzICdjYWxsJ1xuICAgICAgICByZXR1cm4gdGFyZ2V0LmFwcGx5ICAgICAgICAgICAgICAgICAgIGlmIGtleSBpcyAnYXBwbHknXG4gICAgICAgIHJldHVybiB0YXJnZXQudGhlbiAgICAgICAgICAgICAgICAgICAgaWYga2V5IGlzICd0aGVuJ1xuICAgICAgICByZXR1cm4gdGFyZ2V0WyBTeW1ib2wuaXRlcmF0b3IgIF0gICAgIGlmIGtleSBpcyBTeW1ib2wuaXRlcmF0b3JcbiAgICAgICAgcmV0dXJuIHRhcmdldFsgbm9kZV9pbnNwZWN0ICAgICBdICAgICBpZiBrZXkgaXMgbm9kZV9pbnNwZWN0XG4gICAgICAgICMjIyBOT1RFIG5lY2Vzc2l0YXRlZCBieSBiZWhhdmlvciBvZiBgbm9kZTp1dGlsLmluc3BlY3QoKWA6ICMjI1xuICAgICAgICByZXR1cm4gdGFyZ2V0WyAwICAgICAgICAgICAgICAgIF0gICAgIGlmIGtleSBpcyAnMCdcbiAgICAgICAgaWYgKCB2YWx1ZSA9IEdVWV9wcm9wcy5nZXQgdGFyZ2V0LCBrZXksIG5vX3N1Y2hfdmFsdWUgKSBpcyBub19zdWNoX3ZhbHVlXG4gICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZCB1bmxlc3MgY2ZnLmxvY2tlZFxuICAgICAgICAgIHRocm93IG5ldyBFcnJvciBcIl5ndXkucHJvcHMuU3RyaWN0X293bmVyQDFeICN7aW5zdGFuY2UuY29uc3RydWN0b3IubmFtZX0gaW5zdGFuY2UgZG9lcyBub3QgaGF2ZSBwcm9wZXJ0eSAje0gucnByIGtleX1cIlxuICAgICAgICByZXR1cm4gdmFsdWVcbiAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgc2V0OiAoIHRhcmdldCwga2V5LCB2YWx1ZSApIC0+XG4gICAgICAgIGlmIEdVWV9wcm9wcy5oYXMgdGFyZ2V0LCBrZXlcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IgXCJeZ3V5LnByb3BzLlN0cmljdF9vd25lckAxXiAje2luc3RhbmNlLmNvbnN0cnVjdG9yLm5hbWV9IGluc3RhbmNlIGFscmVhZHkgaGFzIHByb3BlcnR5ICN7SC5ycHIga2V5fVwiXG4gICAgICAgIHJldHVybiBSZWZsZWN0LnNldCB0YXJnZXQsIGtleSwgdmFsdWVcbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgIHJldHVybiBSXG5cbiAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBAZ2V0X2xvY2tlZDogKCBzZWxmICkgLT5cbiAgICByZXR1cm4gc2VsZlsgU3RyaWN0X293bmVyX2NmZyBdLmxvY2tlZFxuXG4gICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgQHNldF9sb2NrZWQ6ICggc2VsZiwgZmxhZyApIC0+XG4gICAgSC50eXBlcy52YWxpZGF0ZS5ib29sZWFuIGZsYWdcbiAgICBzZWxmWyBTdHJpY3Rfb3duZXJfY2ZnIF0ubG9ja2VkID0gZmxhZ1xuICAgIHJldHVybiBmbGFnXG5cbiAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBjb25zdHJ1Y3RvcjogKCBjZmcgKSAtPlxuICAgICMjIyB0aHggdG8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzQwNzE0NDU4Lzc1NjgwOTEgIyMjXG4gICAgY2ZnID0geyB0YXJnZXQ6IEAsIGNmZy4uLiwgfVxuICAgIEgudHlwZXMudmFsaWRhdGUuZ3V5X3Byb3BzX3N0cmljdF9vd25lcl9jZmcgY2ZnID0geyBILnR5cGVzLmRlZmF1bHRzLmd1eV9wcm9wc19zdHJpY3Rfb3duZXJfY2ZnLi4uLCBjZmcuLi4sIH1cbiAgICBwcm94eV9jZmcgICAgICAgICAgICAgICAgID0gQGNvbnN0cnVjdG9yLl9nZXRfcHJveHlfY2ZnIEAsIGNmZ1xuICAgIGRlbGV0ZSBwcm94eV9jZmcuc2V0IHVubGVzcyBjZmcub25lc2hvdFxuICAgIFIgICAgICAgICAgICAgICAgICAgICAgICAgPSBuZXcgUHJveHkgY2ZnLnRhcmdldCwgcHJveHlfY2ZnXG4gICAgR1VZX3Byb3BzLmhpZGUgUiwgU3RyaWN0X293bmVyX2NmZywgY2ZnXG4gICAgT2JqZWN0LmZyZWV6ZSBSIGlmIGNmZy5mcmVlemVcbiAgICBPYmplY3Quc2VhbCAgIFIgaWYgY2ZnLnNlYWxcbiAgICByZXR1cm4gUlxuXG4gICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgQGNyZWF0ZTogKCBjZmcgKSAtPlxuICAgIGNmZyA9IHsgdGFyZ2V0OiB7fSwgY2ZnLi4uLCB9XG4gICAgSC50eXBlcy52YWxpZGF0ZS5ndXlfcHJvcHNfc3RyaWN0X293bmVyX2NmZyBjZmcgPSB7IEgudHlwZXMuZGVmYXVsdHMuZ3V5X3Byb3BzX3N0cmljdF9vd25lcl9jZmcuLi4sIGNmZy4uLiwgfVxuICAgIHByb3h5X2NmZyA9IEBfZ2V0X3Byb3h5X2NmZyBjZmcudGFyZ2V0LCBjZmdcbiAgICBkZWxldGUgcHJveHlfY2ZnLnNldCB1bmxlc3MgY2ZnLm9uZXNob3RcbiAgICBSICAgICAgICAgPSBuZXcgUHJveHkgY2ZnLnRhcmdldCwgcHJveHlfY2ZnXG4gICAgR1VZX3Byb3BzLmhpZGUgUiwgU3RyaWN0X293bmVyX2NmZywgY2ZnXG4gICAgIyMjIFRBSU5UIGNvbnNpZGVyIHRvIGZyZWV6ZSwgc2VhbCB0YXJnZXQgaW5zdHJlYWQgb2YgcHJveHkgIyMjXG4gICAgT2JqZWN0LmZyZWV6ZSBSIGlmIGNmZy5mcmVlemVcbiAgICBPYmplY3Quc2VhbCAgIFIgaWYgY2ZnLnNlYWxcbiAgICByZXR1cm4gUlxuXG4jLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblN0cmljdF9vd25lciA9IEBTdHJpY3Rfb3duZXJcblxuXG4jPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiMgS0VZIFRFU1RJTkcsIFJFVFJJRVZBTCwgQ0FUQUxPR1VJTkdcbiMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuQGhhcyA9ICggdGFyZ2V0LCBrZXkgKSA9PlxuICAjIyMgc2FmZSB2ZXJzaW9uIG9mIGBSZWZsZWN0LmhhcygpYCB0aGF0IG5ldmVyIHRocm93cyBhbiBlcnJvciAjIyNcbiAgIyMjIHRyeSB0byB1c2UgYFJlZmxlY3QuaGFzKClgIG9uIGdpdmVuIHRhcmdldDsgd2lsbCBmYWlsIGZvciBgbnVsbGAsIGB1bmRlZmluZWRgLCBwcmltaXRpdmUgdmFsdWVzOiAjIyNcbiAgdHJ5IHJldHVybiBSZWZsZWN0LmhhcyB0YXJnZXQsIGtleSBjYXRjaCBlcnJvciB0aGVuIG51bGxcbiAgIyMjIHRyeSB0byByZXRyaWV2ZSBwcm90b3R5cGUgb2YgdGFyZ2V0OyB3aWxsIGZhaWwgZm9yIGBudWxsYCwgYHVuZGVmaW5lZGA6ICMjI1xuICB0cnkgcmV0dXJuIGZhbHNlIHVubGVzcyAoIHByb3RvdHlwZSA9IE9iamVjdC5nZXRQcm90b3R5cGVPZiB0YXJnZXQgKT8gY2F0Y2ggZXJyb3IgdGhlbiBudWxsXG4gICMjIyBnaXZlIHVwIGlmIG5vIHByb3RvdHllIGhhcyBiZWVuIHJldHVybmVkIChtYXkgaGFwcGVuIGUuZy4gd2l0aCBgdGFyZ2V0ID0gT2JqZWN0LmNyZWF0ZSBudWxsYCk6ICMjI1xuICByZXR1cm4gZmFsc2UgdW5sZXNzIHByb3RvdHlwZT9cbiAgIyMjIGFwcGx5IGBSZWZsZWN0LmhhcygpYCB0byBwcm90b3R5cGUgb2YgdGFyZ2V0OyB0aGlzIHNob3VsZCBiZSB0aGUgZGVmaW5pdGl2ZSBhbnN3ZXI6ICMjI1xuICByZXR1cm4gUmVmbGVjdC5oYXMgcHJvdG90eXBlLCBrZXlcblxuIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5nZXQgPSAoIHRhcmdldCwga2V5LCBmYWxsYmFjayApIC0+XG4gIHN3aXRjaCBhcml0eSA9IGFyZ3VtZW50cy5sZW5ndGhcbiAgICB3aGVuIDIgdGhlbiBmYWxsYmFjayA9IEBfbWlzZml0XG4gICAgd2hlbiAzIHRoZW4gbnVsbFxuICAgIGVsc2UgdGhyb3cgbmV3IEVycm9yIFwiXmd1eS5wcm9wcy5nZXRAMV4gZXhwZWN0ZWQgMiBvciAzIGFyZ3VtZW50cywgZ290ICN7YXJpdHl9XCJcbiAgcmV0dXJuIHRhcmdldFsga2V5IF0gaWYgQGhhcyB0YXJnZXQsIGtleVxuICByZXR1cm4gZmFsbGJhY2sgdW5sZXNzIGZhbGxiYWNrIGlzIEBfbWlzZml0XG4gIHRocm93IG5ldyBFcnJvciBcIl5ndXkucHJvcHMuZ2V0QDFeIG5vIHN1Y2ggcHJvcGVydHkgI3tILnJwciBrZXl9XCJcbkBnZXQgPSBnZXQuYmluZCBAICMjIyBhdm9pZGluZyBmYXQtYXJyb3cgZnVuY3Rpb24gc28gd2UgY2FuIHVzZSBgYXJndW1lbnRzYCAjIyNcblxuIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5AX2dldF9rZXlzX2NmZyA9ICggY2ZnICkgLT5cbiAgaGFzX2hpZGRlbiAgPSAoIGNmZyA/IHt9ICkuaGlkZGVuP1xuICBjZmcgICAgICAgICA9IHsgSC50eXBlcy5kZWZhdWx0cy5ndXlfcHJvcHNfa2V5c19jZmcuLi4sIGNmZy4uLiwgfVxuICBjZmcuaGlkZGVuICA9IHRydWUgaWYgbm90IGhhc19oaWRkZW4gYW5kIGNmZy5idWlsdGluc1xuICBILnR5cGVzLnZhbGlkYXRlLmd1eV9wcm9wc19rZXlzX2NmZyBjZmdcbiAgcmV0dXJuIGNmZ1xuXG4jLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbkBrZXlzID0gKCBvd25lciwgY2ZnICkgPT4gWyAoIEBfd2Fsa19rZXlzIG93bmVyLCAoIEBfZ2V0X2tleXNfY2ZnIGNmZyApICkuLi4sIF1cblxuIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5AaGFzX2FueV9rZXlzID0gKCBvd25lciwgY2ZnICkgPT5cbiAgcmV0dXJuIHRydWUgZm9yIGtleSBmcm9tIEBfd2Fsa19rZXlzIG93bmVyLCAoIEBfZ2V0X2tleXNfY2ZnIGNmZyApXG4gIHJldHVybiBmYWxzZVxuXG4jLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbkB3YWxrX2tleXMgPSAoIG93bmVyLCBjZmcgKSA9PlxuICByZXR1cm4gQF93YWxrX2tleXMgb3duZXIsICggQF9nZXRfa2V5c19jZmcgY2ZnIClcblxuIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5AX3dhbGtfa2V5cyA9ICggb3duZXIsIGNmZyApIC0+XG4gIHNlZW4gPSBuZXcgU2V0KClcbiAgaWYgY2ZnLmRlcHRoX2ZpcnN0XG4gICAgY2FjaGUgPSBuZXcgTWFwKClcbiAgICBmb3IgeyBrZXksIG93bmVyLCB9IGZyb20gQF93YWxrX2tleW93bmVycyBvd25lciwgY2ZnXG4gICAgICB1bmxlc3MgKCBjb2xsZWN0b3IgPSBjYWNoZS5nZXQgb3duZXIgKT9cbiAgICAgICAgY2FjaGUuc2V0IG93bmVyLCBjb2xsZWN0b3IgPSBbXVxuICAgICAgY29sbGVjdG9yLnB1c2gga2V5XG4gICAgZm9yIG93bmVyIGluIFsgY2FjaGUua2V5cygpLi4uLCBdLnJldmVyc2UoKVxuICAgICAgZm9yIGtleSBpbiBjYWNoZS5nZXQgb3duZXJcbiAgICAgICAgY29udGludWUgaWYgc2Vlbi5oYXMga2V5XG4gICAgICAgIHNlZW4uYWRkIGtleVxuICAgICAgICB5aWVsZCBrZXlcbiAgZWxzZVxuICAgIGZvciB7IGtleSwgfSBmcm9tIEBfd2Fsa19rZXlvd25lcnMgb3duZXIsIGNmZ1xuICAgICAgY29udGludWUgaWYgc2Vlbi5oYXMga2V5XG4gICAgICBzZWVuLmFkZCBrZXlcbiAgICAgIHlpZWxkIGtleVxuICByZXR1cm4gbnVsbFxuXG4jLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbkBnZXRfcHJvdG90eXBlX2NoYWluID0gKCB4ICkgLT5cbiAgcmV0dXJuIFtdIHVubGVzcyB4P1xuICBSID0gWyB4LCBdXG4gIGxvb3BcbiAgICBicmVhayB1bmxlc3MgKCB4ID0gT2JqZWN0LmdldFByb3RvdHlwZU9mIHggKT9cbiAgICBSLnB1c2ggeFxuICByZXR1cm4gUlxuXG4jLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbkBfd2Fsa19rZXlvd25lcnMgPSAoIG93bmVyLCBjZmcsIGN1cnJlbnRfZGVwdGggPSAwICkgLT5cbiAgcmV0dXJuIG51bGwgaWYgY2ZnLmRlcHRoPyBhbmQgY3VycmVudF9kZXB0aCA+IGNmZy5kZXB0aFxuICByZXR1cm4gbnVsbCBpZiAoIG5vdCBjZmcuYnVpbHRpbnMgKSBhbmQgYnVpbHRpbnMuaGFzIG93bmVyXG4gIHRyeVxuICAgIGZvciBrZXkgaW4gUmVmbGVjdC5vd25LZXlzIG93bmVyXG4gICAgICBjb250aW51ZSBpZiAoIG5vdCBjZmcuc3ltYm9scyApIGFuZCAoIEgudHlwZXMuaXNhLnN5bWJvbCBrZXkgKVxuICAgICAgZCA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Igb3duZXIsIGtleVxuICAgICAgY29udGludWUgaWYgKCBub3QgY2ZnLmhpZGRlbiApIGFuZCAoIG5vdCBkLmVudW1lcmFibGUgKVxuICAgICAgeWllbGQgeyBrZXksIG93bmVyLCB9XG4gIGNhdGNoIGVycm9yXG4gICAgcmV0dXJuIG51bGwgaWYgY2ZnLmFsbG93X2FueSBhbmQgKCBlcnJvci5tZXNzYWdlIGlzICdSZWZsZWN0Lm93bktleXMgY2FsbGVkIG9uIG5vbi1vYmplY3QnIClcbiAgICB0aHJvdyBuZXcgRXJyb3IgXCJeZ3V5LnByb3BzLl93YWxrX2tleW93bmVyc0AxXiBSZWZsZWN0Lm93bktleXMgY2FsbGVkIG9uIG5vbi1vYmplY3QgI3tycHIgb3duZXJ9XCJcbiAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICBpZiAoIHByb3RvX293bmVyID0gT2JqZWN0LmdldFByb3RvdHlwZU9mIG93bmVyICk/XG4gICAgeWllbGQgZnJvbSBAX3dhbGtfa2V5b3duZXJzIHByb3RvX293bmVyLCBjZmcsIGN1cnJlbnRfZGVwdGggKyAxXG4gIHJldHVybiBudWxsXG5cbiMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuQHhyYXkgPSAoIG93bmVyLCBiYXNlID0ge30gKSA9PlxuICBiYXNlWyBrIF0gPSBvd25lclsgayBdIGZvciBrIGZyb20gQF93YWxrX2tleXMgb3duZXIsIHsgaGlkZGVuOiB0cnVlLCBzeW1ib2xzOiB0cnVlLCBidWlsdGluczogZmFsc2UsIH1cbiAgcmV0dXJuIGJhc2VcblxuIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4jIyMgdGh4IHRvIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL09iamVjdC9nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzI2NyZWF0aW5nX2Ffc2hhbGxvd19jb3B5ICMjI1xuQF9zaGFsbG93X2NvcHkgPSAoIGQgKSAtPiBPYmplY3QuY3JlYXRlICggT2JqZWN0LmdldFByb3RvdHlwZU9mIGQgKSwgKCBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyBkIClcblxuXG4jPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiMgVFJFRVxuIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5AdHJlZSA9ICggb3duZXIsIGNmZyApIC0+IFsgKCBAd2Fsa190cmVlIG93bmVyLCBjZmcgKS4uLiwgXVxuXG4jLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbkB3YWxrX3RyZWUgPSAoIG93bmVyLCBjZmcgKSAtPlxuICBILnR5cGVzLnZhbGlkYXRlLmd1eV9wcm9wc190cmVlX2NmZyAoIGNmZyA9IHsgSC50eXBlcy5kZWZhdWx0cy5ndXlfcHJvcHNfdHJlZV9jZmcuLi4sIGNmZy4uLiwgfSApXG4gIHVubGVzcyBjZmcuc2VwPyB0aGVuIHJldHVybiB5aWVsZCBmcm9tIEBfd2Fsa190cmVlIG93bmVyLCBjZmdcbiAgeWllbGQgKCB4LnRvU3RyaW5nKCkgZm9yIHggaW4gcCApLmpvaW4gY2ZnLnNlcCBmb3IgcCBmcm9tIEBfd2Fsa190cmVlIG93bmVyLCBjZmdcbiAgcmV0dXJuIG51bGxcblxuIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5AX3dhbGtfdHJlZSA9ICggb3duZXIsIGNmZywgc2VlbiApIC0+XG4gIHNlZW4gPz0gbmV3IE1hcCgpXG4gIGZvciB7IGtleSwgb3duZXI6IHN1Ym93bmVyLCB9IGZyb20gQF93YWxrX2tleW93bmVycyBvd25lciwgY2ZnXG4gICAgc2Vlbi5zZXQgc3Vib3duZXIsIG5ldyBTZXQoKSB1bmxlc3Mgc2Vlbi5oYXMgc3Vib3duZXJcbiAgICBjb250aW51ZSBpZiAoIHNlZW5fa2V5cyA9IHNlZW4uZ2V0IHN1Ym93bmVyICkuaGFzIGtleVxuICAgIHNlZW5fa2V5cy5hZGQga2V5XG4gICAgdHJ5XG4gICAgICB2YWx1ZSA9IHN1Ym93bmVyWyBrZXkgXVxuICAgIGNhdGNoIGVycm9yXG4gICAgICBjb250aW51ZSBpZiBjZmcuYWxsb3dfYW55IGFuZCAoXG4gICAgICAgIC8nY2FsbGVyJywgJ2NhbGxlZScsIGFuZCAnYXJndW1lbnRzJyBwcm9wZXJ0aWVzIG1heSBub3QgYmUgYWNjZXNzZWQvLnRlc3QgZXJyb3IubWVzc2FnZSlcbiAgICB2ZXJkaWN0ID0gaWYgY2ZnLmV2YWx1YXRlPyB0aGVuICggY2ZnLmV2YWx1YXRlIHsgb3duZXI6IHN1Ym93bmVyLCBrZXksIHZhbHVlLCB9ICkgZWxzZSAndGFrZSxkZXNjZW5kJ1xuICAgIEgudHlwZXMudmFsaWRhdGUuZ3V5X3Byb3BzX3RyZWVfdmVyZGljdCB2ZXJkaWN0XG4gICAgY29udGludWUgaWYgdmVyZGljdCBpcyBmYWxzZVxuICAgIHZlcmRpY3QgPSAndGFrZSxkZXNjZW5kJyBpZiB2ZXJkaWN0IGlzIHRydWVcbiAgICB5aWVsZCBbIGtleSBdIGlmIC9cXGJ0YWtlXFxiLy50ZXN0IHZlcmRpY3RcbiAgICBjb250aW51ZSB1bmxlc3MgL1xcYmRlc2NlbmRcXGIvLnRlc3QgdmVyZGljdFxuICAgIGZvciBzdWJrZXkgZnJvbSBAX3dhbGtfdHJlZSB2YWx1ZSwgY2ZnLCBzZWVuXG4gICAgICB5aWVsZCBbIGtleSwgc3Via2V5LCBdLmZsYXQoKVxuICByZXR1cm4gbnVsbFxuXG5cblxuXG4iXX0=
//# sourceURL=../src/props.coffee