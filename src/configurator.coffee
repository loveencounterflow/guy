
'use strict'

{ lets
  freeze }                = require 'letsfreezethat'

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


