(function() {
  'use strict';
  var Guy, props;

  //###########################################################################################################
  props = require('./props');

  Guy = (function() {
    //===========================================================================================================
    class Guy {
      //---------------------------------------------------------------------------------------------------------
      // constructor: ( target = null ) ->
      constructor(settings = null) {
        this.settings = settings;
        //.......................................................................................................
        props.def_oneoff(this, 'async', {
          enumerable: true
        }, function() {
          return require('./async');
        });
        // props.def_oneoff @, 'lft',      { enumerable: true, }, -> require 'letsfreezethat'
        props.def_oneoff(this, 'process', {
          enumerable: true
        }, function() {
          return require('./process');
        });
        props.def_oneoff(this, 'fs', {
          enumerable: true
        }, function() {
          return require('./fs');
        });
        props.def_oneoff(this, 'sets', {
          enumerable: true
        }, function() {
          return require('./sets');
        });
        props.def_oneoff(this, 'str', {
          enumerable: true
        }, function() {
          return require('./str');
        });
        props.def_oneoff(this, 'fmt', {
          enumerable: true
        }, function() {
          return require('./fmt');
        });
        // props.def_oneoff @, 'src',      { enumerable: true, }, -> require './src'
        props.def_oneoff(this, 'trm', {
          enumerable: true
        }, function() {
          return require('./trm');
        });
        // props.def_oneoff @, 'temp',     { enumerable: true, }, -> require './temp'
        props.def_oneoff(this, 'samesame', {
          enumerable: true
        }, function() {
          return require('./samesame');
        });
        props.def_oneoff(this, 'rnd', {
          enumerable: true
        }, function() {
          return require('./rnd');
        });
        // props.def_oneoff @, 'datetime', { enumerable: true, }, -> require './datetime'
        // props.def_oneoff @, 'watch',    { enumerable: true, }, -> require './watch'
        return void 0;
      }

    };

    //---------------------------------------------------------------------------------------------------------
    Guy.prototype.props = props;

    return Guy;

  }).call(this);

  //###########################################################################################################
  // if require.main is module then do =>
  module.exports = new Guy();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL21haW4uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBO0VBQUE7QUFBQSxNQUFBLEdBQUEsRUFBQSxLQUFBOzs7RUFJQSxLQUFBLEdBQTRCLE9BQUEsQ0FBUSxTQUFSOztFQUl0Qjs7SUFBTixNQUFBLElBQUEsQ0FBQTs7O01BSUUsV0FBYSxZQUFjLElBQWQsQ0FBQTtRQUFFLElBQUMsQ0FBQSxvQkFDbEI7O1FBQ0ksS0FBSyxDQUFDLFVBQU4sQ0FBaUIsSUFBakIsRUFBb0IsT0FBcEIsRUFBZ0M7VUFBRSxVQUFBLEVBQVk7UUFBZCxDQUFoQyxFQUF1RCxRQUFBLENBQUEsQ0FBQTtpQkFBRyxPQUFBLENBQVEsU0FBUjtRQUFILENBQXZELEVBREo7O1FBR0ksS0FBSyxDQUFDLFVBQU4sQ0FBaUIsSUFBakIsRUFBb0IsU0FBcEIsRUFBZ0M7VUFBRSxVQUFBLEVBQVk7UUFBZCxDQUFoQyxFQUF1RCxRQUFBLENBQUEsQ0FBQTtpQkFBRyxPQUFBLENBQVEsV0FBUjtRQUFILENBQXZEO1FBQ0EsS0FBSyxDQUFDLFVBQU4sQ0FBaUIsSUFBakIsRUFBb0IsSUFBcEIsRUFBZ0M7VUFBRSxVQUFBLEVBQVk7UUFBZCxDQUFoQyxFQUF1RCxRQUFBLENBQUEsQ0FBQTtpQkFBRyxPQUFBLENBQVEsTUFBUjtRQUFILENBQXZEO1FBQ0EsS0FBSyxDQUFDLFVBQU4sQ0FBaUIsSUFBakIsRUFBb0IsTUFBcEIsRUFBZ0M7VUFBRSxVQUFBLEVBQVk7UUFBZCxDQUFoQyxFQUF1RCxRQUFBLENBQUEsQ0FBQTtpQkFBRyxPQUFBLENBQVEsUUFBUjtRQUFILENBQXZEO1FBQ0EsS0FBSyxDQUFDLFVBQU4sQ0FBaUIsSUFBakIsRUFBb0IsS0FBcEIsRUFBZ0M7VUFBRSxVQUFBLEVBQVk7UUFBZCxDQUFoQyxFQUF1RCxRQUFBLENBQUEsQ0FBQTtpQkFBRyxPQUFBLENBQVEsT0FBUjtRQUFILENBQXZEO1FBQ0EsS0FBSyxDQUFDLFVBQU4sQ0FBaUIsSUFBakIsRUFBb0IsS0FBcEIsRUFBZ0M7VUFBRSxVQUFBLEVBQVk7UUFBZCxDQUFoQyxFQUF1RCxRQUFBLENBQUEsQ0FBQTtpQkFBRyxPQUFBLENBQVEsT0FBUjtRQUFILENBQXZELEVBUEo7O1FBU0ksS0FBSyxDQUFDLFVBQU4sQ0FBaUIsSUFBakIsRUFBb0IsS0FBcEIsRUFBZ0M7VUFBRSxVQUFBLEVBQVk7UUFBZCxDQUFoQyxFQUF1RCxRQUFBLENBQUEsQ0FBQTtpQkFBRyxPQUFBLENBQVEsT0FBUjtRQUFILENBQXZELEVBVEo7O1FBV0ksS0FBSyxDQUFDLFVBQU4sQ0FBaUIsSUFBakIsRUFBb0IsVUFBcEIsRUFBZ0M7VUFBRSxVQUFBLEVBQVk7UUFBZCxDQUFoQyxFQUF1RCxRQUFBLENBQUEsQ0FBQTtpQkFBRyxPQUFBLENBQVEsWUFBUjtRQUFILENBQXZEO1FBQ0EsS0FBSyxDQUFDLFVBQU4sQ0FBaUIsSUFBakIsRUFBb0IsS0FBcEIsRUFBZ0M7VUFBRSxVQUFBLEVBQVk7UUFBZCxDQUFoQyxFQUF1RCxRQUFBLENBQUEsQ0FBQTtpQkFBRyxPQUFBLENBQVEsT0FBUjtRQUFILENBQXZELEVBWko7OztBQWVJLGVBQU87TUFoQkk7O0lBSmY7OztrQkF1QkUsS0FBQSxHQUFPOzs7O2dCQS9CVDs7OztFQW9DQSxNQUFNLENBQUMsT0FBUCxHQUFpQixJQUFJLEdBQUosQ0FBQTtBQXBDakIiLCJzb3VyY2VzQ29udGVudCI6WyJcbid1c2Ugc3RyaWN0J1xuXG5cbiMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xucHJvcHMgICAgICAgICAgICAgICAgICAgICA9IHJlcXVpcmUgJy4vcHJvcHMnXG5cblxuIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5jbGFzcyBHdXlcblxuICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICMgY29uc3RydWN0b3I6ICggdGFyZ2V0ID0gbnVsbCApIC0+XG4gIGNvbnN0cnVjdG9yOiAoIEBzZXR0aW5ncyA9IG51bGwgKSAtPlxuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgcHJvcHMuZGVmX29uZW9mZiBALCAnYXN5bmMnLCAgICB7IGVudW1lcmFibGU6IHRydWUsIH0sIC0+IHJlcXVpcmUgJy4vYXN5bmMnXG4gICAgIyBwcm9wcy5kZWZfb25lb2ZmIEAsICdsZnQnLCAgICAgIHsgZW51bWVyYWJsZTogdHJ1ZSwgfSwgLT4gcmVxdWlyZSAnbGV0c2ZyZWV6ZXRoYXQnXG4gICAgcHJvcHMuZGVmX29uZW9mZiBALCAncHJvY2VzcycsICB7IGVudW1lcmFibGU6IHRydWUsIH0sIC0+IHJlcXVpcmUgJy4vcHJvY2VzcydcbiAgICBwcm9wcy5kZWZfb25lb2ZmIEAsICdmcycsICAgICAgIHsgZW51bWVyYWJsZTogdHJ1ZSwgfSwgLT4gcmVxdWlyZSAnLi9mcydcbiAgICBwcm9wcy5kZWZfb25lb2ZmIEAsICdzZXRzJywgICAgIHsgZW51bWVyYWJsZTogdHJ1ZSwgfSwgLT4gcmVxdWlyZSAnLi9zZXRzJ1xuICAgIHByb3BzLmRlZl9vbmVvZmYgQCwgJ3N0cicsICAgICAgeyBlbnVtZXJhYmxlOiB0cnVlLCB9LCAtPiByZXF1aXJlICcuL3N0cidcbiAgICBwcm9wcy5kZWZfb25lb2ZmIEAsICdmbXQnLCAgICAgIHsgZW51bWVyYWJsZTogdHJ1ZSwgfSwgLT4gcmVxdWlyZSAnLi9mbXQnXG4gICAgIyBwcm9wcy5kZWZfb25lb2ZmIEAsICdzcmMnLCAgICAgIHsgZW51bWVyYWJsZTogdHJ1ZSwgfSwgLT4gcmVxdWlyZSAnLi9zcmMnXG4gICAgcHJvcHMuZGVmX29uZW9mZiBALCAndHJtJywgICAgICB7IGVudW1lcmFibGU6IHRydWUsIH0sIC0+IHJlcXVpcmUgJy4vdHJtJ1xuICAgICMgcHJvcHMuZGVmX29uZW9mZiBALCAndGVtcCcsICAgICB7IGVudW1lcmFibGU6IHRydWUsIH0sIC0+IHJlcXVpcmUgJy4vdGVtcCdcbiAgICBwcm9wcy5kZWZfb25lb2ZmIEAsICdzYW1lc2FtZScsIHsgZW51bWVyYWJsZTogdHJ1ZSwgfSwgLT4gcmVxdWlyZSAnLi9zYW1lc2FtZSdcbiAgICBwcm9wcy5kZWZfb25lb2ZmIEAsICdybmQnLCAgICAgIHsgZW51bWVyYWJsZTogdHJ1ZSwgfSwgLT4gcmVxdWlyZSAnLi9ybmQnXG4gICAgIyBwcm9wcy5kZWZfb25lb2ZmIEAsICdkYXRldGltZScsIHsgZW51bWVyYWJsZTogdHJ1ZSwgfSwgLT4gcmVxdWlyZSAnLi9kYXRldGltZSdcbiAgICAjIHByb3BzLmRlZl9vbmVvZmYgQCwgJ3dhdGNoJywgICAgeyBlbnVtZXJhYmxlOiB0cnVlLCB9LCAtPiByZXF1aXJlICcuL3dhdGNoJ1xuICAgIHJldHVybiB1bmRlZmluZWRcblxuICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIHByb3BzOiBwcm9wc1xuXG5cbiMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuIyBpZiByZXF1aXJlLm1haW4gaXMgbW9kdWxlIHRoZW4gZG8gPT5cbm1vZHVsZS5leHBvcnRzID0gbmV3IEd1eSgpXG5cblxuXG5cbiJdfQ==
//# sourceURL=../src/main.coffee