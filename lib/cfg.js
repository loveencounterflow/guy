(function() {
  'use strict';
  var freeze, lets;

  ({lets, freeze} = require('letsfreezethat'));

  //-----------------------------------------------------------------------------------------------------------
  this.configure_with_types = (self, cfg = null, types = null) => {
    var clasz, defaults, props, ref, ref1, ref2;
    ({props} = require('..'));
    clasz = self.constructor;
    //.........................................................................................................
    /* assign defaults object where to be found to obtain viable `cfg` object: */
    defaults = (ref = (ref1 = clasz.C) != null ? (ref2 = ref1.defaults) != null ? ref2.constructor_cfg : void 0 : void 0) != null ? ref : null;
    self.cfg = {...defaults, ...cfg};
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
    self.cfg = freeze(self.cfg);
    return void 0;
  };

}).call(this);

//# sourceMappingURL=cfg.js.map