
'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'GUY'
log                       = CND.get_logger 'plain',     badge
info                      = CND.get_logger 'info',      badge
whisper                   = CND.get_logger 'whisper',   badge
alert                     = CND.get_logger 'alert',     badge
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
help                      = CND.get_logger 'help',      badge
urge                      = CND.get_logger 'urge',      badge
echo                      = CND.echo.bind CND
types                     = new ( require 'intertype' ).Intertype()
{ isa
  validate
  type_of }               = types.export()
{ lets
  freeze }                = require 'letsfreezethat'

#-----------------------------------------------------------------------------------------------------------
def = Object.defineProperty

#-----------------------------------------------------------------------------------------------------------
def_oneoff = ( object, name, cfg, method ) ->
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


#===========================================================================================================
class Guy

  #---------------------------------------------------------------------------------------------------------
  # constructor: ( target = null ) ->
  constructor: ( @settings = null ) ->
    @props = { def, def_oneoff, }
    @async =
      defer:  setImmediate
      after:  ( dts, f ) -> setTimeout  f, dts * 1000
      sleep:  ( dts ) -> new Promise ( done ) => setTimeout done, dts * 1000
    #.......................................................................................................
    # def_oneoff @, 'foo', { enumerable: true, }, -> require 'intertype'
    def_oneoff @, 'nowait',   { enumerable: true, }, -> require './nowait'
    def_oneoff @, 'cfg',      { enumerable: true, }, -> require './cfg'
    def_oneoff @, 'lft',      { enumerable: true, }, -> require 'letsfreezethat'
    def_oneoff @, 'obj',      { enumerable: true, }, -> require './obj'
    def_oneoff @, 'process',  { enumerable: true, }, -> require './process'
    def_oneoff @, 'fs',       { enumerable: true, }, -> require './fs'
    return undefined


############################################################################################################
# if require.main is module then do =>
module.exports = new Guy()




