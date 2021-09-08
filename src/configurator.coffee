
'use strict'

{ lets
  freeze }                = require 'letsfreezethat'

# #===========================================================================================================
# #
# #-----------------------------------------------------------------------------------------------------------
# class Configurator

#   #---------------------------------------------------------------------------------------------------------
#   ### Constants are a class property so we can access them without having an instance: ###
#   @C: freeze { defaults: {}, }
#     # u32_sign_delta:   0x80000000
#     # u32_width:        4
#     # u32_nr_min:       -0x80000000
#     # u32_nr_max:       +0x7fffffff
#     # #.......................................................................................................
#     # defaults:
#     #   constructor_cfg:
#     #     vnr_width:    5           ### maximum elements in VNR vector ###
#     #     validate:     false
#     #     # autoextend: false
#     #     format:       'u32'

#   #---------------------------------------------------------------------------------------------------------
#   @get_types_instance: -> new ( require 'intertype' ).Intertype()

#   #---------------------------------------------------------------------------------------------------------
#   @create_types: ( instance, cfg, types = null ) ->
#     types ?= @get_types_instance()
#     #.......................................................................................................
#     ### declare the `cfg` type for the constructor configuration and immediately put it to use: ###
#     types.declare 'constructor_cfg', tests:
#       "x is a object":                    ( x ) -> @isa.object x
#       # "@isa.cardinal x.vnr_width":        ( x ) -> @isa.cardinal x.vnr_width
#       # "@isa.boolean x.validate":          ( x ) -> @isa.boolean x.validate
#       # "x.format in [ 'u32', 'bcd', ]":    ( x ) -> x.format in [ 'u32', 'bcd', ]
#     types.validate.constructor_cfg instance.cfg
#     #.......................................................................................................
#     ### declare other types as needed: ###
#     # types.declare 'hlr_vnr', ...
#     #.......................................................................................................
#     ### return the `Intertype` instance which will become an instance property: ###
#     return types

#   #---------------------------------------------------------------------------------------------------------
#   constructor: ( cfg ) ->
#     ### derive effective `cfg` from defaults and argument, make it an instance property, then instantiate
#     `types` and make it an instance property as well. This will fail if `cfg` should not validate. We
#     are free to declare types in `create_types()` that are parametrized from consumer-provided or default
#     configuration properties. Freeze `cfg` b/c we won't support live `cfg` changes (can still use `lets`
#     tho where called for) ###
#     { props, }  = require '..'
#     @cfg        = freeze { @constructor.C.defaults.constructor_cfg..., cfg..., }
#     props.def @, 'types', { enumerable: false, value: ( @constructor.create_types @ ), }
#     return undefined

# Sample usage
#
# #-----------------------------------------------------------------------------------------------------------
# class @Hollerith extends _Hollerith_proto
#
#   #---------------------------------------------------------------------------------------------------------
#   constructor: ( cfg ) ->
#     super cfg
#     ### 'compile' (i.e. choose) method into instance to eschew run-time switches: ###
#     @encode = switch @cfg.format
#       when 'u32' then @_encode_u32
#       when 'bcd' then @_encode_bcd
#     return undefined
#
# ### make constants a module-global for faster, easier access: ###
# C           = _Hollerith_proto.C
# ### Export class, this allows consumers to instantiate with custom properties: ###
# @Hollerith  = freeze @Hollerith
# ### Export all-uppercase (== stateless) instance with default `cfg` for wash-n-go usage: ###
# @HOLLERITH  = new @Hollerith()

#-----------------------------------------------------------------------------------------------------------
@configure_with_types = ( self, cfg = null, types = null ) =>
  ### derive effective `cfg` from defaults and argument, make it an instance property, then instantiate
  `types` and make it an instance property as well. This will fail if `cfg` should not validate. We
  are free to declare types in `create_types()` that are parametrized from consumer-provided or default
  configuration properties. Freeze `cfg` b/c we won't support live `cfg` changes (can still use `lets`
  tho where called for) ###
  { props, }    = require '..'
  clasz         = self.constructor
  #.........................................................................................................
  ### assign defaults object where to be found to obtain viable `cfg` object: ###
  defaults      = clasz.C?.defaults?.constructor_cfg ? null
  self.cfg      = freeze { defaults..., cfg..., }
  #.........................................................................................................
  ### procure `types` where not given; make it a non-enumerable to avoid rpr of object: ###
  types        ?= new ( require 'intertype' ).Intertype()
  props.def self, 'types', { enumerable: false, value: types, }
  #.........................................................................................................
  ### call class method `declare_types()`; this method may perform `self.types.validate.constructor_cfg self.cfg`: ###
  clasz.declare_types self if clasz.declare_types?
  return undefined


#===========================================================================================================
# module.exports = Configurator

