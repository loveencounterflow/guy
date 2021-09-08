
'use strict'

{ lets
  freeze }                = require 'letsfreezethat'

#-----------------------------------------------------------------------------------------------------------
@configure_with_types = ( self, cfg = null, types = null ) =>
  { props, }    = require '..'
  clasz         = self.constructor
  #.........................................................................................................
  ### assign defaults object where to be found to obtain viable `cfg` object: ###
  defaults      = clasz.C?.defaults?.constructor_cfg ? null
  self.cfg      = { defaults..., cfg..., }
  #.........................................................................................................
  ### procure `types` where not given; make it a non-enumerable to avoid rpr of object: ###
  types        ?= new ( require 'intertype' ).Intertype()
  props.def self, 'types', { enumerable: false, value: types, }
  #.........................................................................................................
  ### call class method `declare_types()`; this method may perform `self.types.validate.constructor_cfg self.cfg`: ###
  clasz.declare_types self if clasz.declare_types?
  self.cfg      = freeze self.cfg
  return undefined


