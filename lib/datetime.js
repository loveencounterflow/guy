(function() {
  // 'use strict'

  // ############################################################################################################
// ### https://day.js.org ###
// H                                   = require './_helpers'
// @_dayjs                             = require 'dayjs'
// @_timestamp_input_template          = 'YYYYMMDD-HHmmssZ'
// @_timestamp_output_template         = 'YYYYMMDD-HHmmss[Z]'
// defaults                            = {}

  // #===========================================================================================================
// do =>
//   utc               = require 'dayjs/plugin/utc';               @_dayjs.extend utc
//   relativeTime      = require 'dayjs/plugin/relativeTime';      @_dayjs.extend relativeTime
//   toObject          = require 'dayjs/plugin/toObject';          @_dayjs.extend toObject
//   customParseFormat = require 'dayjs/plugin/customParseFormat'; @_dayjs.extend customParseFormat
//   duration          = require 'dayjs/plugin/duration';          @_dayjs.extend duration

  // #===========================================================================================================
// H.types.declare 'guy_dt_valid_dayjs', tests:
//   "( @type_of x ) is 'm'":  ( x ) -> ( @type_of x ) is 'm'
//   "@isa.float x.$y":        ( x ) -> @isa.float x.$y
//   "@isa.float x.$M":        ( x ) -> @isa.float x.$M
//   "@isa.float x.$D":        ( x ) -> @isa.float x.$D
//   "@isa.float x.$W":        ( x ) -> @isa.float x.$W
//   "@isa.float x.$H":        ( x ) -> @isa.float x.$H
//   "@isa.float x.$m":        ( x ) -> @isa.float x.$m
//   "@isa.float x.$s":        ( x ) -> @isa.float x.$s
//   "@isa.float x.$ms":       ( x ) -> @isa.float x.$ms

  // #-----------------------------------------------------------------------------------------------------------
// H.types.declare 'guy_dt_timestamp', tests:
//   "@isa.text x":                    ( x ) -> @isa.text x
//   "( /^\\d{8}-\\d{6}Z$/ ).test x":  ( x ) -> ( /^\d{8}-\d{6}Z$/ ).test x

  // #-----------------------------------------------------------------------------------------------------------
// H.types.declare 'guy_dt_now_cfg', tests:
//   "@isa.object x":                    ( x ) -> @isa.object x
// defaults.guy_dt_now_cfg =
//     subtract:       null
//     add:            null

  // #===========================================================================================================
// # DATETIME
// #-----------------------------------------------------------------------------------------------------------
// @from_now = ( srts ) ->
//   return ( @parse srts ).fromNow()

  // #-----------------------------------------------------------------------------------------------------------
// @now = ( cfg ) ->
//   H.types.validate.guy_dt_now_cfg ( cfg = { defaults.guy_dt_now_cfg..., cfg..., } )
//   R = @_dayjs().utc()
//   R = R.subtract cfg.subtract...  if cfg.subtract?
//   R = R.add      cfg.add...       if cfg.add?
//   return R.format @_timestamp_output_template

  // #-----------------------------------------------------------------------------------------------------------
// @srts_from_isots = ( isots ) -> ( @_dayjs isots ).utc().format @_timestamp_output_template

  // #-----------------------------------------------------------------------------------------------------------
// @parse = ( srts ) ->
//   H.types.validate.guy_dt_timestamp srts
//   R = ( @_dayjs srts, @_timestamp_input_template ).utc()
//   throw new Error "^guy.datetime.dt_parse@1^ #{rpr srts}" unless H.types.isa.guy_dt_valid_dayjs R
//   return R

  // #-----------------------------------------------------------------------------------------------------------
// @format = ( srts, P... ) ->
//   R = @parse srts
//   return R.format P...

  // #-----------------------------------------------------------------------------------------------------------
// @isots_from_srts = ( srts ) -> ( @parse srts ).format()


}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2RhdGV0aW1lLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUEyRXlEO0VBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJcbiMgJ3VzZSBzdHJpY3QnXG5cblxuIyAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiMgIyMjIGh0dHBzOi8vZGF5LmpzLm9yZyAjIyNcbiMgSCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPSByZXF1aXJlICcuL19oZWxwZXJzJ1xuIyBAX2RheWpzICAgICAgICAgICAgICAgICAgICAgICAgICAgICA9IHJlcXVpcmUgJ2RheWpzJ1xuIyBAX3RpbWVzdGFtcF9pbnB1dF90ZW1wbGF0ZSAgICAgICAgICA9ICdZWVlZTU1ERC1ISG1tc3NaJ1xuIyBAX3RpbWVzdGFtcF9vdXRwdXRfdGVtcGxhdGUgICAgICAgICA9ICdZWVlZTU1ERC1ISG1tc3NbWl0nXG4jIGRlZmF1bHRzICAgICAgICAgICAgICAgICAgICAgICAgICAgID0ge31cblxuIyAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiMgZG8gPT5cbiMgICB1dGMgICAgICAgICAgICAgICA9IHJlcXVpcmUgJ2RheWpzL3BsdWdpbi91dGMnOyAgICAgICAgICAgICAgIEBfZGF5anMuZXh0ZW5kIHV0Y1xuIyAgIHJlbGF0aXZlVGltZSAgICAgID0gcmVxdWlyZSAnZGF5anMvcGx1Z2luL3JlbGF0aXZlVGltZSc7ICAgICAgQF9kYXlqcy5leHRlbmQgcmVsYXRpdmVUaW1lXG4jICAgdG9PYmplY3QgICAgICAgICAgPSByZXF1aXJlICdkYXlqcy9wbHVnaW4vdG9PYmplY3QnOyAgICAgICAgICBAX2RheWpzLmV4dGVuZCB0b09iamVjdFxuIyAgIGN1c3RvbVBhcnNlRm9ybWF0ID0gcmVxdWlyZSAnZGF5anMvcGx1Z2luL2N1c3RvbVBhcnNlRm9ybWF0JzsgQF9kYXlqcy5leHRlbmQgY3VzdG9tUGFyc2VGb3JtYXRcbiMgICBkdXJhdGlvbiAgICAgICAgICA9IHJlcXVpcmUgJ2RheWpzL3BsdWdpbi9kdXJhdGlvbic7ICAgICAgICAgIEBfZGF5anMuZXh0ZW5kIGR1cmF0aW9uXG5cbiMgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4jIEgudHlwZXMuZGVjbGFyZSAnZ3V5X2R0X3ZhbGlkX2RheWpzJywgdGVzdHM6XG4jICAgXCIoIEB0eXBlX29mIHggKSBpcyAnbSdcIjogICggeCApIC0+ICggQHR5cGVfb2YgeCApIGlzICdtJ1xuIyAgIFwiQGlzYS5mbG9hdCB4LiR5XCI6ICAgICAgICAoIHggKSAtPiBAaXNhLmZsb2F0IHguJHlcbiMgICBcIkBpc2EuZmxvYXQgeC4kTVwiOiAgICAgICAgKCB4ICkgLT4gQGlzYS5mbG9hdCB4LiRNXG4jICAgXCJAaXNhLmZsb2F0IHguJERcIjogICAgICAgICggeCApIC0+IEBpc2EuZmxvYXQgeC4kRFxuIyAgIFwiQGlzYS5mbG9hdCB4LiRXXCI6ICAgICAgICAoIHggKSAtPiBAaXNhLmZsb2F0IHguJFdcbiMgICBcIkBpc2EuZmxvYXQgeC4kSFwiOiAgICAgICAgKCB4ICkgLT4gQGlzYS5mbG9hdCB4LiRIXG4jICAgXCJAaXNhLmZsb2F0IHguJG1cIjogICAgICAgICggeCApIC0+IEBpc2EuZmxvYXQgeC4kbVxuIyAgIFwiQGlzYS5mbG9hdCB4LiRzXCI6ICAgICAgICAoIHggKSAtPiBAaXNhLmZsb2F0IHguJHNcbiMgICBcIkBpc2EuZmxvYXQgeC4kbXNcIjogICAgICAgKCB4ICkgLT4gQGlzYS5mbG9hdCB4LiRtc1xuXG4jICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIyBILnR5cGVzLmRlY2xhcmUgJ2d1eV9kdF90aW1lc3RhbXAnLCB0ZXN0czpcbiMgICBcIkBpc2EudGV4dCB4XCI6ICAgICAgICAgICAgICAgICAgICAoIHggKSAtPiBAaXNhLnRleHQgeFxuIyAgIFwiKCAvXlxcXFxkezh9LVxcXFxkezZ9WiQvICkudGVzdCB4XCI6ICAoIHggKSAtPiAoIC9eXFxkezh9LVxcZHs2fVokLyApLnRlc3QgeFxuXG4jICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIyBILnR5cGVzLmRlY2xhcmUgJ2d1eV9kdF9ub3dfY2ZnJywgdGVzdHM6XG4jICAgXCJAaXNhLm9iamVjdCB4XCI6ICAgICAgICAgICAgICAgICAgICAoIHggKSAtPiBAaXNhLm9iamVjdCB4XG4jIGRlZmF1bHRzLmd1eV9kdF9ub3dfY2ZnID1cbiMgICAgIHN1YnRyYWN0OiAgICAgICBudWxsXG4jICAgICBhZGQ6ICAgICAgICAgICAgbnVsbFxuXG5cbiMgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4jICMgREFURVRJTUVcbiMgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4jIEBmcm9tX25vdyA9ICggc3J0cyApIC0+XG4jICAgcmV0dXJuICggQHBhcnNlIHNydHMgKS5mcm9tTm93KClcblxuIyAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiMgQG5vdyA9ICggY2ZnICkgLT5cbiMgICBILnR5cGVzLnZhbGlkYXRlLmd1eV9kdF9ub3dfY2ZnICggY2ZnID0geyBkZWZhdWx0cy5ndXlfZHRfbm93X2NmZy4uLiwgY2ZnLi4uLCB9IClcbiMgICBSID0gQF9kYXlqcygpLnV0YygpXG4jICAgUiA9IFIuc3VidHJhY3QgY2ZnLnN1YnRyYWN0Li4uICBpZiBjZmcuc3VidHJhY3Q/XG4jICAgUiA9IFIuYWRkICAgICAgY2ZnLmFkZC4uLiAgICAgICBpZiBjZmcuYWRkP1xuIyAgIHJldHVybiBSLmZvcm1hdCBAX3RpbWVzdGFtcF9vdXRwdXRfdGVtcGxhdGVcblxuIyAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiMgQHNydHNfZnJvbV9pc290cyA9ICggaXNvdHMgKSAtPiAoIEBfZGF5anMgaXNvdHMgKS51dGMoKS5mb3JtYXQgQF90aW1lc3RhbXBfb3V0cHV0X3RlbXBsYXRlXG5cbiMgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4jIEBwYXJzZSA9ICggc3J0cyApIC0+XG4jICAgSC50eXBlcy52YWxpZGF0ZS5ndXlfZHRfdGltZXN0YW1wIHNydHNcbiMgICBSID0gKCBAX2RheWpzIHNydHMsIEBfdGltZXN0YW1wX2lucHV0X3RlbXBsYXRlICkudXRjKClcbiMgICB0aHJvdyBuZXcgRXJyb3IgXCJeZ3V5LmRhdGV0aW1lLmR0X3BhcnNlQDFeICN7cnByIHNydHN9XCIgdW5sZXNzIEgudHlwZXMuaXNhLmd1eV9kdF92YWxpZF9kYXlqcyBSXG4jICAgcmV0dXJuIFJcblxuIyAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiMgQGZvcm1hdCA9ICggc3J0cywgUC4uLiApIC0+XG4jICAgUiA9IEBwYXJzZSBzcnRzXG4jICAgcmV0dXJuIFIuZm9ybWF0IFAuLi5cblxuIyAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiMgQGlzb3RzX2Zyb21fc3J0cyA9ICggc3J0cyApIC0+ICggQHBhcnNlIHNydHMgKS5mb3JtYXQoKVxuXG5cblxuIl19
//# sourceURL=../src/datetime.coffee