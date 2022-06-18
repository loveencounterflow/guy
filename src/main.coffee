
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
props                     = require './props'


#===========================================================================================================
class Guy

  #---------------------------------------------------------------------------------------------------------
  # constructor: ( target = null ) ->
  constructor: ( @settings = null ) ->
    #.......................................................................................................
    # props.def_oneoff @, 'foo', { enumerable: true, }, -> require 'intertype'
    # props.def_oneoff @, 'nowait',   { enumerable: true, }, -> require './nowait'
    props.def_oneoff @, 'async',    { enumerable: true, }, -> require './async'
    props.def_oneoff @, 'cfg',      { enumerable: true, }, -> require './cfg'
    props.def_oneoff @, 'lft',      { enumerable: true, }, -> require 'letsfreezethat'
    props.def_oneoff @, 'process',  { enumerable: true, }, -> require './process'
    props.def_oneoff @, 'fs',       { enumerable: true, }, -> require './fs'
    props.def_oneoff @, 'str',      { enumerable: true, }, -> require './str'
    return undefined

  #---------------------------------------------------------------------------------------------------------
  props: props


############################################################################################################
# if require.main is module then do =>
module.exports = new Guy()




