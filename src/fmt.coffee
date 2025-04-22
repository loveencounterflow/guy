
'use strict'

#===========================================================================================================
# H                         = require './_helpers'
FSTR                      = require '../dependencies/LiuQixuan-FString'
TRM                       = require './trm'


#===========================================================================================================
format = ( fmt, x ) ->
  if fmt.startsWith ':'
    throw new SyntaxError "format spec can not start with colon, got #{TRM.rpr fmt}"
  fmt = ':' + fmt
  x   = TRM.rpr x unless ( typeof x ) is 'string'
  return FSTR.formatByParam x, fmt

#-----------------------------------------------------------------------------------------------------------
new_formatter = ( fmt ) -> ( x ) -> format fmt, x

#===========================================================================================================
module.exports = { format, new_formatter, }
