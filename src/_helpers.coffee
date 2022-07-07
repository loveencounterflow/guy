
'use strict'


############################################################################################################
# CND                       = require 'cnd'
# rpr                       = CND.rpr
# badge                     = 'GUY'
# log                       = CND.get_logger 'plain',     badge
# info                      = CND.get_logger 'info',      badge
# whisper                   = CND.get_logger 'whisper',   badge
# alert                     = CND.get_logger 'alert',     badge
# debug                     = CND.get_logger 'debug',     badge
# warn                      = CND.get_logger 'warn',      badge
# help                      = CND.get_logger 'help',      badge
# urge                      = CND.get_logger 'urge',      badge
# echo                      = CND.echo.bind CND
@types                    = new ( require 'intertype-legacy' ).Intertype()
@types.defaults           = {}


