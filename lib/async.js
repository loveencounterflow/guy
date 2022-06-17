(function() {
  'use strict';
  this.every = (dts, f) => {
    return setInterval(f, dts * 1000);
  };

  this.after = (dts, f) => {
    return setTimeout(f, dts * 1000);
  };

  this.sleep = (dts) => {
    return new Promise((done) => {
      return setTimeout(done, dts * 1000);
    });
  };

  this.defer = async(f = function() {}) => {
    await this.sleep(0);
    return (await f());
  };

}).call(this);

//# sourceMappingURL=async.js.map