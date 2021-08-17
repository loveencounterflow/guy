(function() {
  'use strict';
  var splice = [].splice;

  //###########################################################################################################
  this.for_callbackable = require('deasync');

  //-----------------------------------------------------------------------------------------------------------
  this.for_awaitable = function(fn_with_promise) {
    return this.for_callbackable(async(...P) => {
      var error, handler, ref, result;
      ref = P, [...P] = ref, [handler] = splice.call(P, -1);
      try {
        result = (await fn_with_promise(...P));
      } catch (error1) {
        error = error1;
        return handler(error);
      }
      handler(null, result);
      return null;
    });
  };

}).call(this);

//# sourceMappingURL=nowait.js.map