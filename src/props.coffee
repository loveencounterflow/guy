
'use strict'

############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr


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
  constructor: ->
    ### thx to https://stackoverflow.com/a/40714458/7568091 ###
    self = @
    has_target = ( key ) =>
      return true if key is Symbol.toStringTag
      return self[ key ] isnt undefined
    #.......................................................................................................
    unless @has?
      hide @, 'has', new Proxy has_target, get: ( _, key ) => has_target key
    #.......................................................................................................
    unless @get?
      hide @, 'get', ( key, fallback = misfit ) =>
        try return self[ key ] catch error
          return fallback unless fallback is misfit
        throw error
    #.......................................................................................................
    return new Proxy @,
      #.....................................................................................................
      get: ( target, key ) =>
        return undefined if key is Symbol.toStringTag
        if ( R = target[ key ] ) is undefined
          throw new Error "^guy.props.Strict_owner@1^ #{@constructor.name} instance does not have property #{rpr key}"
        return R
      # set: ( target, key, value ) =>
      #   target[key] = value
      #   return true


