
'use strict'

############################################################################################################
GUY_props                 = @
no_such_value             = Symbol 'no_such_value'
H                         = require './_helpers'
builtins                  = require './_builtins'
@_misfit                  = Symbol 'misfit'
@_misfit2                 = Symbol 'misfit2'
{ rpr, }                  = require './trm'
### see https://nodejs.org/dist/latest-v18.x/docs/api/util.html#utilinspectcustom ###
node_inspect              = Symbol.for 'nodejs.util.inspect.custom'



#-----------------------------------------------------------------------------------------------------------
H.types.declare 'guy_props_keys_cfg', tests:
  "@isa.object x":                                                    ( x ) -> @isa.object x
  "@isa_optional.cardinal x.depth":                                   ( x ) -> @isa_optional.cardinal x.depth
  "@isa.boolean x.allow_any":                                         ( x ) -> @isa.boolean x.allow_any
  "@isa.boolean x.symbols":                                           ( x ) -> @isa.boolean x.symbols
  "@isa.boolean x.hidden":                                            ( x ) -> @isa.boolean x.hidden
  "@isa.boolean x.depth_first":                                       ( x ) -> @isa.boolean x.depth_first
  "@isa.boolean x.builtins":                                          ( x ) -> @isa.boolean x.builtins
  "@isa.boolean x.builtins implies x.hidden":                         ( x ) ->
    return ( not x.builtins ) or ( x.hidden )
#...........................................................................................................
H.types.defaults.guy_props_keys_cfg =
  allow_any:    true
  symbols:      false
  builtins:     false
  hidden:       false
  depth:        null
  depth_first:  false

#-----------------------------------------------------------------------------------------------------------
H.types.declare 'guy_props_crossmerge_cfg', tests:
  "@isa.guy_props_keys_cfg x":                                        ( x ) -> @isa.guy_props_keys_cfg x
  "x.keys?":                                                          ( x ) -> x.keys?
  "x.values?":                                                        ( x ) -> x.values?
  "x.fallback can be anything":                                       ( x ) -> true
#...........................................................................................................
### TAINT code duplication ###
H.types.defaults.guy_props_crossmerge_cfg =
  allow_any:    true
  symbols:      false
  builtins:     false
  hidden:       false
  depth:        null
  depth_first:  false
  keys:         null
  values:       null
  fallback:     @_misfit

#-----------------------------------------------------------------------------------------------------------
H.types.declare 'guy_props_tree_cfg', tests:
  "@isa.guy_props_keys_cfg x":                  ( x ) -> @isa.guy_props_keys_cfg x
  "@isa_optional.function x.evaluate":          ( x ) -> @isa_optional.function x.evaluate
  "@isa_optional.text x.sep":                   ( x ) -> @isa_optional.text x.sep
#...........................................................................................................
### TAINT code duplication ###
H.types.defaults.guy_props_tree_cfg =
  allow_any:    true
  symbols:      false
  builtins:     false
  hidden:       false
  depth:        null
  depth_first:  null
  evaluate:     null
  sep:          null

#-----------------------------------------------------------------------------------------------------------
H.types.declare 'guy_props_tree_verdict', ( x ) ->
  return true if @isa.boolean x
  return false unless @isa.text x
  return true

#-----------------------------------------------------------------------------------------------------------
H.types.declare 'guy_props_strict_owner', ( x ) -> x instanceof Strict_owner

#-----------------------------------------------------------------------------------------------------------
H.types.declare 'guy_props_strict_owner_cfg', tests:
  "@isa.object x":                                                    ( x ) -> @isa.object x
  "x.target?":                                                        ( x ) -> x.target?
  "@isa.boolean x.locked":                                            ( x ) -> @isa.boolean x.locked
  "@isa.boolean x.seal":                                              ( x ) -> @isa.boolean x.seal
  "@isa.boolean x.freeze":                                            ( x ) -> @isa.boolean x.freeze
  "@isa.boolean x.oneshot":                                           ( x ) -> @isa.boolean x.oneshot
  "@isa_optional.boolean x.reset":                                    ( x ) -> @isa_optional.boolean x.reset
  # "reassignable object cannot be frozen": ( x ) ->
  #   return false if x.oneshot and x.freeze
  #   return true
  "x.reset is deprecated": ( x ) ->
    return true if x.reset?
    return true if x.reset is true
    throw new Error "^guy.props.Strict_owner@1^ `cfg.reset: false` is deprecated; use `cfg.seal: true` instead"
#...........................................................................................................
H.types.defaults.guy_props_strict_owner_cfg =
  target:     null
  reset:      true
  locked:     true
  seal:       false
  freeze:     false
  oneshot:    false

#-----------------------------------------------------------------------------------------------------------
@def  = def   = Object.defineProperty
@hide = hide  = ( object, name, value ) => Object.defineProperty object, name,
    enumerable:   false
    writable:     true
    configurable: true
    value:        value

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
@nonull_assign = ( first, others... ) ->
  return Object.assign {}, first, ( @omit_nullish other for other in others )...

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
@resolve_property_chain = ( owner, property_chain ) ->
  R = owner
  R = R[ term ] for term in property_chain
  return R

#-----------------------------------------------------------------------------------------------------------
class @Strict_owner

  #---------------------------------------------------------------------------------------------------------
  Strict_owner_cfg = Symbol 'Strict_owner_cfg'

  #---------------------------------------------------------------------------------------------------------
  @_get_proxy_cfg: ( instance, cfg ) ->
    R =
      #.....................................................................................................
      ownKeys: ( target ) -> Reflect.ownKeys target
      #.....................................................................................................
      get: ( target, key ) ->
        return "#{instance.constructor.name}" if key is Symbol.toStringTag
        return target.constructor             if key is 'constructor'
        return target.toString                if key is 'toString'
        return target.call                    if key is 'call'
        return target.apply                   if key is 'apply'
        return target.then                    if key is 'then'
        return target[ Symbol.iterator  ]     if key is Symbol.iterator
        return target[ node_inspect     ]     if key is node_inspect
        ### NOTE necessitated by behavior of `node:util.inspect()`: ###
        return target[ 0                ]     if key is '0'
        if ( value = GUY_props.get target, key, no_such_value ) is no_such_value
          return undefined unless cfg.locked
          throw new Error "^guy.props.Strict_owner@1^ #{instance.constructor.name} instance does not have property #{H.rpr key}"
        return value
      #.....................................................................................................
      set: ( target, key, value ) ->
        if GUY_props.has target, key
          throw new Error "^guy.props.Strict_owner@1^ #{instance.constructor.name} instance already has property #{H.rpr key}"
        return Reflect.set target, key, value
    #.......................................................................................................
    return R

  #---------------------------------------------------------------------------------------------------------
  @get_locked: ( self ) ->
    return self[ Strict_owner_cfg ].locked

  #---------------------------------------------------------------------------------------------------------
  @set_locked: ( self, flag ) ->
    H.types.validate.boolean flag
    self[ Strict_owner_cfg ].locked = flag
    return flag

  #---------------------------------------------------------------------------------------------------------
  constructor: ( cfg ) ->
    ### thx to https://stackoverflow.com/a/40714458/7568091 ###
    cfg = { target: @, cfg..., }
    H.types.validate.guy_props_strict_owner_cfg cfg = { H.types.defaults.guy_props_strict_owner_cfg..., cfg..., }
    proxy_cfg                 = @constructor._get_proxy_cfg @, cfg
    delete proxy_cfg.set unless cfg.oneshot
    R                         = new Proxy cfg.target, proxy_cfg
    GUY_props.hide R, Strict_owner_cfg, cfg
    Object.freeze R if cfg.freeze
    Object.seal   R if cfg.seal
    return R

  #---------------------------------------------------------------------------------------------------------
  @create: ( cfg ) ->
    cfg = { target: {}, cfg..., }
    H.types.validate.guy_props_strict_owner_cfg cfg = { H.types.defaults.guy_props_strict_owner_cfg..., cfg..., }
    proxy_cfg = @_get_proxy_cfg cfg.target, cfg
    delete proxy_cfg.set unless cfg.oneshot
    R         = new Proxy cfg.target, proxy_cfg
    GUY_props.hide R, Strict_owner_cfg, cfg
    ### TAINT consider to freeze, seal target instread of proxy ###
    Object.freeze R if cfg.freeze
    Object.seal   R if cfg.seal
    return R

#-----------------------------------------------------------------------------------------------------------
Strict_owner = @Strict_owner


#===========================================================================================================
# KEY TESTING, RETRIEVAL, CATALOGUING
#-----------------------------------------------------------------------------------------------------------
@has = ( target, key ) =>
  ### safe version of `Reflect.has()` that never throws an error ###
  ### try to use `Reflect.has()` on given target; will fail for `null`, `undefined`, primitive values: ###
  try return Reflect.has target, key catch error then null
  ### try to retrieve prototype of target; will fail for `null`, `undefined`: ###
  try return false unless ( prototype = Object.getPrototypeOf target )? catch error then null
  ### give up if no prototye has been returned (may happen e.g. with `target = Object.create null`): ###
  return false unless prototype?
  ### apply `Reflect.has()` to prototype of target; this should be the definitive answer: ###
  return Reflect.has prototype, key

#-----------------------------------------------------------------------------------------------------------
get = ( target, key, fallback ) ->
  switch arity = arguments.length
    when 2 then fallback = @_misfit
    when 3 then null
    else throw new Error "^guy.props.get@1^ expected 2 or 3 arguments, got #{arity}"
  return target[ key ] if @has target, key
  return fallback unless fallback is @_misfit
  throw new Error "^guy.props.get@1^ no such property #{H.rpr key}"
@get = get.bind @ ### avoiding fat-arrow function so we can use `arguments` ###

#-----------------------------------------------------------------------------------------------------------
@_get_keys_cfg = ( cfg ) ->
  has_hidden  = ( cfg ? {} ).hidden?
  cfg         = { H.types.defaults.guy_props_keys_cfg..., cfg..., }
  cfg.hidden  = true if not has_hidden and cfg.builtins
  H.types.validate.guy_props_keys_cfg cfg
  return cfg

#-----------------------------------------------------------------------------------------------------------
@keys = ( owner, cfg ) => [ ( @_walk_keys owner, ( @_get_keys_cfg cfg ) )..., ]

#-----------------------------------------------------------------------------------------------------------
@has_any_keys = ( owner, cfg ) =>
  return true for key from @_walk_keys owner, ( @_get_keys_cfg cfg )
  return false

#-----------------------------------------------------------------------------------------------------------
@walk_keys = ( owner, cfg ) =>
  return @_walk_keys owner, ( @_get_keys_cfg cfg )

#-----------------------------------------------------------------------------------------------------------
@_walk_keys = ( owner, cfg ) ->
  seen = new Set()
  if cfg.depth_first
    cache = new Map()
    for { key, owner, } from @_walk_keyowners owner, cfg
      unless ( collector = cache.get owner )?
        cache.set owner, collector = []
      collector.push key
    for owner in [ cache.keys()..., ].reverse()
      for key in cache.get owner
        continue if seen.has key
        seen.add key
        yield key
  else
    for { key, } from @_walk_keyowners owner, cfg
      continue if seen.has key
      seen.add key
      yield key
  return null

#-----------------------------------------------------------------------------------------------------------
@get_prototype_chain = ( owner ) ->
  R = new Set()
  R.add owner for { owner, } from @_walk_keyowners owner,
    allow_any:    true
    symbols:      true
    builtins:     true
    hidden:       true
    depth:        null
    depth_first:  false
  return [ R..., ]

#-----------------------------------------------------------------------------------------------------------
@_walk_keyowners = ( owner, cfg, current_depth = 0 ) ->
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

#-----------------------------------------------------------------------------------------------------------
@xray = ( owner, base = {} ) =>
  base[ k ] = owner[ k ] for k from @_walk_keys owner, { hidden: true, symbols: true, builtins: false, }
  return base

#-----------------------------------------------------------------------------------------------------------
### thx to https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptors#creating_a_shallow_copy ###
@_shallow_copy = ( d ) -> Object.create ( Object.getPrototypeOf d ), ( Object.getOwnPropertyDescriptors d )


#===========================================================================================================
# TREE
#-----------------------------------------------------------------------------------------------------------
@tree = ( owner, cfg ) -> [ ( @walk_tree owner, cfg )..., ]

#-----------------------------------------------------------------------------------------------------------
@walk_tree = ( owner, cfg ) ->
  H.types.validate.guy_props_tree_cfg ( cfg = { H.types.defaults.guy_props_tree_cfg..., cfg..., } )
  unless cfg.sep? then return yield from @_walk_tree owner, cfg
  yield ( x.toString() for x in p ).join cfg.sep for p from @_walk_tree owner, cfg
  return null

#-----------------------------------------------------------------------------------------------------------
@_walk_tree = ( owner, cfg, seen ) ->
  seen ?= new Map()
  for { key, owner: subowner, } from @_walk_keyowners owner, cfg
    seen.set subowner, new Set() unless seen.has subowner
    continue if ( seen_keys = seen.get subowner ).has key
    seen_keys.add key
    try
      value = subowner[ key ]
    catch error
      continue if cfg.allow_any and (
        /'caller', 'callee', and 'arguments' properties may not be accessed/.test error.message)
    verdict = if cfg.evaluate? then ( cfg.evaluate { owner: subowner, key, value, } ) else 'take,descend'
    H.types.validate.guy_props_tree_verdict verdict
    continue if verdict is false
    verdict = 'take,descend' if verdict is true
    yield [ key ] if /\btake\b/.test verdict
    continue unless /\bdescend\b/.test verdict
    for subkey from @_walk_tree value, cfg, seen
      yield [ key, subkey, ].flat()
  return null




