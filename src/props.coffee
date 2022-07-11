
'use strict'

############################################################################################################
props                     = @
no_such_value             = Symbol 'no_such_value'
H                         = require './_helpers'
builtins                  = require './_builtins'


#-----------------------------------------------------------------------------------------------------------
H.types.declare 'guy_props_keys_cfg', tests:
  "@isa.object x":                                                    ( x ) -> @isa.object x
  "@isa_optional.cardinal x.depth":                                   ( x ) -> @isa_optional.cardinal x.depth
  "@isa.boolean x.allow_any":                                         ( x ) -> @isa.boolean x.allow_any
  "@isa.boolean x.symbols":                                           ( x ) -> @isa.boolean x.symbols
  "@isa.boolean x.hidden":                                            ( x ) -> @isa.boolean x.hidden
  "@isa.boolean x.builtins":                                          ( x ) -> @isa.boolean x.builtins
  "@isa.boolean x.builtins implies x.hidden":                         ( x ) ->
    return ( not x.builtins ) or ( x.hidden )
#...........................................................................................................
H.types.defaults.guy_props_keys_cfg =
  allow_any:  false
  symbols:    false
  builtins:   false
  hidden:     false
  depth:      null

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
          throw new Error "^guy.props.Strict_owner@1^ #{@constructor.name} instance does not have property #{H.rpr key}"
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
  throw new Error "^guy.props.get@1^ no such property #{H.rpr key}"

#-----------------------------------------------------------------------------------------------------------
@keys = ( owner, cfg ) ->
  has_hidden  = ( cfg ? {} ).hidden?
  cfg         = { H.types.defaults.guy_props_keys_cfg..., cfg..., }
  cfg.hidden  = true if not has_hidden and cfg.builtins
  H.types.validate.guy_props_keys_cfg cfg
  return [ ( @_walk_keys owner, cfg )..., ]

#-----------------------------------------------------------------------------------------------------------
@walk_keys = ( owner, cfg ) ->
  has_hidden  = ( cfg ? {} ).hidden?
  cfg         = { H.types.defaults.guy_props_keys_cfg..., cfg..., }
  cfg.hidden  = true if not has_hidden and cfg.builtins
  H.types.validate.guy_props_keys_cfg cfg
  return @_walk_keys owner, cfg

#-----------------------------------------------------------------------------------------------------------
@_walk_keys = ( owner, cfg ) ->
  seen = new Set()
  for { key, } from @_walk_keyowners owner, cfg, 0
    continue if seen.has key
    seen.add key
    yield key
  return null

#-----------------------------------------------------------------------------------------------------------
@_walk_keyowners = ( owner, cfg, depth ) ->
  # urge '^3354^', owner
  return null if cfg.depth? and depth > cfg.depth
  return null if ( not cfg.builtins ) and builtins.has owner
  try
    for key in Reflect.ownKeys owner
      continue if ( not cfg.symbols ) and ( H.types.isa.symbol key )
      d = Object.getOwnPropertyDescriptor owner, key
      continue if ( not cfg.hidden ) and ( not d.enumerable )
      yield { key, owner, }
  catch error
    return null if cfg.allow_any and ( error.message is 'Reflect.ownKeys called on non-object' )
    throw error
  #.........................................................................................................
  if ( proto_owner = Object.getPrototypeOf owner )?
    yield from @_walk_keyowners proto_owner, cfg, depth + 1
  return null

