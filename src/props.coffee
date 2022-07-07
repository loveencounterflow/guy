
'use strict'

############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
props                     = @
no_such_value             = Symbol 'no_such_value'
H                         = require './_helpers'
builtins                  = require './_builtins'


#-----------------------------------------------------------------------------------------------------------
H.types.declare 'guy_props_keys_cfg', tests:
  "@isa.object x":                                                    ( x ) -> @isa.object x
  "@isa.boolean x.symbols":                                           ( x ) -> @isa.boolean x.symbols
  "@isa.boolean x.builtins":                                          ( x ) -> @isa.boolean x.builtins
#...........................................................................................................
H.types.defaults.guy_props_keys_cfg =
  symbols:  true
  builtins: true

#-----------------------------------------------------------------------------------------------------------
@_misfit = misfit = Symbol 'misfit'

#-----------------------------------------------------------------------------------------------------------
@def  = def   = Object.defineProperty
@hide = hide  = ( object, name, value ) => Object.defineProperty object, name, { enumerable: false, value, }

#-----------------------------------------------------------------------------------------------------------
@def_oneoff = def_oneoff = ( object, name, cfg, method ) =>
  get = ->
    R = method.apply object
    delete cfg.get
    def object, name,
      configurable: ( cfg.configurable  ? true )
      enumerable:   ( cfg.enumerable    ? true )
      value:        R
    return R
  def object, name, { enumerable: true, configurable: true, get, }
  return null

#-----------------------------------------------------------------------------------------------------------
@_pick_with_fallback = ( d, fallback, keys... ) ->
  R     = {}
  keys  = keys.flat Infinity
  for key in keys
    R[ key ] = if ( value = d[ key ] ) is undefined then fallback else value
  return [ R, keys, ]

#-----------------------------------------------------------------------------------------------------------
@pick_with_fallback = ( d, fallback, keys... ) -> ( @_pick_with_fallback d, fallback, keys )[ 0 ]

#-----------------------------------------------------------------------------------------------------------
@pluck_with_fallback = ( d, fallback, keys... ) ->
  [ R, keys, ] = @_pick_with_fallback d, fallback, keys...
  delete d[ key ] for key in keys
  return R

#-----------------------------------------------------------------------------------------------------------
@nullify_undefined = ( d ) ->
  R       = {}
  R[ k ]  = ( v ? null ) for k, v of d
  return R

#-----------------------------------------------------------------------------------------------------------
@omit_nullish = ( d ) ->
  R       = {}
  R[ k ]  = v for k, v of d when v?
  return R


#===========================================================================================================
class @Strict_owner

  #---------------------------------------------------------------------------------------------------------
  constructor: ( cfg ) ->
    ### thx to https://stackoverflow.com/a/40714458/7568091 ###
    cfg   = { target: @, cfg..., }
    #.......................................................................................................
    R = new Proxy cfg.target,
      #.....................................................................................................
      get: ( target, key ) =>
        return undefined if key is Symbol.toStringTag
        if ( value = props.get target, key, no_such_value ) is no_such_value
          throw new Error "^guy.props.Strict_owner@1^ #{@constructor.name} instance does not have property #{rpr key}"
        return value
    #.......................................................................................................
    return R


#===========================================================================================================
# KEY TESTING, RETRIEVAL, CATALOGUING
#-----------------------------------------------------------------------------------------------------------
@has = ( target, key ) =>
  ### safe version of `Reflect.has()` that never throws an error ###
  try return Reflect.has target, key catch error then return false

#-----------------------------------------------------------------------------------------------------------
@get = ( target, key, fallback = misfit ) =>
  return target[ key ] if @has target, key
  return fallback unless fallback is misfit
  throw new Error "^guy.props.get@1^ no such property #{rpr key}"

#-----------------------------------------------------------------------------------------------------------
@keys = ( owner, cfg ) ->
  H.types.validate.guy_props_keys_cfg ( cfg = { H.types.defaults.guy_props_keys_cfg..., cfg..., } )
  return [ ( @_walk_keys owner, cfg)..., ]

#-----------------------------------------------------------------------------------------------------------
@walk_keys = ( owner, cfg ) ->
  H.types.validate.guy_props_keys_cfg ( cfg = { H.types.defaults.guy_props_keys_cfg..., cfg..., } )
  return @_walk_keys owner, cfg

#-----------------------------------------------------------------------------------------------------------
@_walk_keys = ( owner, cfg ) ->
  seen = new Set()
  for { key, } from @_walk_keyowners owner, cfg
    continue if seen.has key
    seen.add key
    yield key
  return null

#-----------------------------------------------------------------------------------------------------------
@_walk_keyowners = ( owner, cfg ) ->
  # urge '^3354^', owner
  return null if ( not cfg.builtins ) and builtins.has owner
  for key in Reflect.ownKeys owner
    if H.types.isa.symbol key
      yield { key, owner, } if cfg.symbols
    else
      yield { key, owner, }
  #.........................................................................................................
  if ( proto_owner = Object.getPrototypeOf owner )?
    yield from @_walk_keyowners proto_owner, cfg
  return null

