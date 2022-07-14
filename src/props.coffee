
'use strict'

############################################################################################################
props                     = @
no_such_value             = Symbol 'no_such_value'
H                         = require './_helpers'
builtins                  = require './_builtins'
GUY_props                 = @
@_misfit                  = Symbol 'misfit'
@_misfit2                 = Symbol 'misfit2'


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
  allow_any:  true
  symbols:    false
  builtins:   false
  hidden:     false
  depth:      null

#-----------------------------------------------------------------------------------------------------------
H.types.declare 'guy_props_crossmerge_cfg', tests:
  "@isa.guy_props_keys_cfg x":                                        ( x ) -> @isa.guy_props_keys_cfg x
  "x.keys?":                                                          ( x ) -> x.keys?
  "x.values?":                                                        ( x ) -> x.values?
  "x.fallback can be anything":                                       ( x ) -> true
#...........................................................................................................
### TAINT code duplication ###
H.types.defaults.guy_props_crossmerge_cfg =
  allow_any:  true
  symbols:    false
  builtins:   false
  hidden:     false
  depth:      null
  keys:       null
  values:     null
  fallback:   @_misfit

#-----------------------------------------------------------------------------------------------------------
H.types.declare 'guy_props_tree_cfg', tests:
  "@isa.guy_props_keys_cfg x":                  ( x ) -> @isa.guy_props_keys_cfg x
  "@isa_optional.function x.evaluate":          ( x ) -> @isa_optional.function x.evaluate
  "@isa_optional.text x.joiner":                ( x ) -> @isa_optional.text x.joiner
#...........................................................................................................
### TAINT code duplication ###
H.types.defaults.guy_props_tree_cfg =
  allow_any:    true
  symbols:      false
  builtins:     false
  hidden:       false
  depth:        null
  evaluate:     null
  joiner:       null

#-----------------------------------------------------------------------------------------------------------
H.types.declare 'guy_props_strict_owner_cfg', tests:
  "@isa.object x":                                                    ( x ) -> @isa.object x
  "x.target?":                                                        ( x ) -> x.target?
  "@isa.boolean x.reset":                                             ( x ) -> @isa.boolean x.reset
#...........................................................................................................
H.types.defaults.guy_props_strict_owner_cfg =
  target:     null
  reset:      true


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

#-----------------------------------------------------------------------------------------------------------
@crossmerge = ( cfg ) ->
  H.types.validate.guy_props_crossmerge_cfg ( cfg = { H.types.defaults.guy_props_crossmerge_cfg..., cfg..., } )
  R       = {}
  for key from @_walk_keys cfg.keys, cfg
    if ( value = @get cfg.values, key, @_misfit2 ) isnt @_misfit2
      R[ key ] = value
      continue
    if cfg.fallback is @_misfit
      throw new Error "^guy.props.crossmerge@1^ missing key #{H.rpr key} in values"
    R[ key ] = cfg.fallback
  return R

#-----------------------------------------------------------------------------------------------------------
class @Strict_owner

  #---------------------------------------------------------------------------------------------------------
  @_get_strict_owner_handlers: ( instance ) ->
    classname = instance.constructor.name
    #.........................................................................................................
    get = ( target, key ) =>
      return undefined if key is Symbol.toStringTag
      if ( value = props.get target, key, no_such_value ) is no_such_value
        throw new Error "^guy.props.Strict_owner@1^ #{classname} instance does not have property #{H.rpr key}"
      return value
    #.........................................................................................................
    set = ( target, key, value ) =>
      if GUY_props.has target, key
        throw new Error "^guy.props.Strict_owner@1^ #{classname} instance already has property #{H.rpr key}"
      return Reflect.set target, key, value
    #.........................................................................................................
    return { get, set, }

  #---------------------------------------------------------------------------------------------------------
  constructor: ( cfg ) ->
    ### thx to https://stackoverflow.com/a/40714458/7568091 ###
    cfg = { target: @, cfg..., }
    H.types.validate.guy_props_strict_owner_cfg cfg = { H.types.defaults.guy_props_strict_owner_cfg..., cfg..., }
    { get, set, } = @constructor._get_strict_owner_handlers @
    #.......................................................................................................
    if cfg.reset  then  R = new Proxy cfg.target, { get,      }
    else                R = new Proxy cfg.target, { get, set, }
    #.......................................................................................................
    return R


#===========================================================================================================
# KEY TESTING, RETRIEVAL, CATALOGUING
#-----------------------------------------------------------------------------------------------------------
@has = ( target, key ) =>
  ### safe version of `Reflect.has()` that never throws an error ###
  try return Reflect.has target, key catch error then return false

#-----------------------------------------------------------------------------------------------------------
@get = ( target, key, fallback = @_misfit ) =>
  return target[ key ] if @has target, key
  return fallback unless fallback is @_misfit
  throw new Error "^guy.props.get@1^ no such property #{H.rpr key}"

#-----------------------------------------------------------------------------------------------------------
@_get_keys_cfg = ( cfg ) ->
  has_hidden  = ( cfg ? {} ).hidden?
  cfg         = { H.types.defaults.guy_props_keys_cfg..., cfg..., }
  cfg.hidden  = true if not has_hidden and cfg.builtins
  H.types.validate.guy_props_keys_cfg cfg
  return cfg

#-----------------------------------------------------------------------------------------------------------
@keys = ( owner, cfg ) -> [ ( @_walk_keys owner, ( @_get_keys_cfg cfg ) )..., ]

#-----------------------------------------------------------------------------------------------------------
@has_keys = ( owner, cfg ) ->
  return true for key from @_walk_keys owner, ( @_get_keys_cfg cfg )
  return false

#-----------------------------------------------------------------------------------------------------------
@walk_keys = ( owner, cfg ) ->
  return @_walk_keys owner, ( @_get_keys_cfg cfg )

#-----------------------------------------------------------------------------------------------------------
@_walk_keys = ( owner, cfg ) ->
  seen = new Set()
  for { key, } from @_walk_keyowners owner, cfg
    continue if seen.has key
    seen.add key
    yield key
  return null

#-----------------------------------------------------------------------------------------------------------
@_walk_keyowners = ( owner, cfg, current_depth = 0 ) ->
  # urge '^3354^', owner
  return null if cfg.depth? and current_depth > cfg.depth
  return null if ( not cfg.builtins ) and builtins.has owner
  try
    for key in Reflect.ownKeys owner
      continue if ( not cfg.symbols ) and ( H.types.isa.symbol key )
      d = Object.getOwnPropertyDescriptor owner, key
      continue if ( not cfg.hidden ) and ( not d.enumerable )
      yield { key, owner, }
  catch error
    return null if cfg.allow_any and ( error.message is 'Reflect.ownKeys called on non-object' )
    throw new Error "^guy.props._walk_keyowners@1^ Reflect.ownKeys called on non-object #{rpr owner}"
  #.........................................................................................................
  if ( proto_owner = Object.getPrototypeOf owner )?
    yield from @_walk_keyowners proto_owner, cfg, current_depth + 1
  return null


#===========================================================================================================
# TREE
#-----------------------------------------------------------------------------------------------------------
@tree = ( owner, cfg ) ->
  H.types.validate.guy_props_tree_cfg ( cfg = { H.types.defaults.guy_props_tree_cfg..., cfg..., } )
  return [ ( @_walk_tree owner, cfg )..., ] unless cfg.joiner?
  return [ ( p.join cfg.joiner for p from @_walk_tree owner, cfg )..., ]

#-----------------------------------------------------------------------------------------------------------
@_walk_tree = ( owner, cfg ) ->
  for { key, owner: subowner, } from @_walk_keyowners owner, cfg
    value = subowner[ key ]
    verdict = if cfg.evaluate? then ( cfg.evaluate { owner: subowner, key, value, } ) else 'take,descend'
    ### TAINT use property descriptor? might have to use descriptor.get() anyway so no advantage ###
    # if ( Object.getOwnPropertyDescriptor subowner, key ).value
    yield [ key ] if /\btake\b/.test verdict
    continue unless /\bdescend\b/.test verdict
    # console.log '^345^', rpr { key, value, has_keys: ( @has_keys value, cfg ), }
    for subkey from @_walk_tree value, cfg
      yield [ key, subkey, ].flat()
  return null




