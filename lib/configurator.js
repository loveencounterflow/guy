(function() {
  'use strict';
  var freeze, lets;

  ({lets, freeze} = require('letsfreezethat'));

  //-----------------------------------------------------------------------------------------------------------
  this.configure_with_types = (self, cfg = null, types = null) => {
    /* derive effective `cfg` from defaults and argument, make it an instance property, then instantiate
     `types` and make it an instance property as well. This will fail if `cfg` should not validate. We
     are free to declare types in `create_types()` that are parametrized from consumer-provided or default
     configuration properties. Freeze `cfg` b/c we won't support live `cfg` changes (can still use `lets`
     tho where called for) */
    var clasz, defaults, props, ref, ref1, ref2;
    ({props} = require('..'));
    clasz = self.constructor;
    //.........................................................................................................
    /* assign defaults object where to be found to obtain viable `cfg` object: */
    defaults = (ref = (ref1 = clasz.C) != null ? (ref2 = ref1.defaults) != null ? ref2.constructor_cfg : void 0 : void 0) != null ? ref : null;
    self.cfg = freeze({...defaults, ...cfg});
    //.........................................................................................................
    /* procure `types` where not given; make it a non-enumerable to avoid rpr of object: */
    if (types == null) {
      types = new (require('intertype')).Intertype();
    }
    props.def(self, 'types', {
      enumerable: false,
      value: types
    });
    if (clasz.declare_types != null) {
      //.........................................................................................................
      /* call class method `declare_types()`; this method may perform `self.types.validate.constructor_cfg self.cfg`: */
      clasz.declare_types(self);
    }
    return void 0;
  };

}).call(this);

//# sourceMappingURL=configurator.js.map