
'use strict'

############################################################################################################
H                         = require './_helpers'


#-----------------------------------------------------------------------------------------------------------
H.types.declare 'guy_str_walk_lines_cfg', tests:
  "@isa.object x":          ( x ) -> @isa.object x
  "@isa.boolean x.trim":    ( x ) -> @isa.boolean x.trim

#-----------------------------------------------------------------------------------------------------------
defaults =
  guy_str_walk_lines_cfg:
    trim: true


#-----------------------------------------------------------------------------------------------------------
### thx to https://stackoverflow.com/a/6969486/7568091 and
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#escaping ###
@escape_for_regex = ( text ) -> text.replace /[.*+?^${}()|[\]\\]/g, '\\$&'

#-----------------------------------------------------------------------------------------------------------
@walk_lines = ( text, cfg ) ->
  H.types.validate.guy_str_walk_lines_cfg ( cfg = { defaults.guy_str_walk_lines_cfg..., cfg..., } )
  { trim } = cfg
  #.........................................................................................................
  # pattern       = /.*?(\n|$)/suy
  if text is ''
    yield ''
    return null
  pattern       = /(.*?)(?:\r\n|\r|\n|$)/suy
  last_position = text.length - 1
  loop
    break if pattern.lastIndex > last_position
    break unless ( match = text.match pattern )?
    yield if trim then match[ 1 ].trimEnd() else match[ 1 ]
  yield '' if ( text.match /\n$/ )?
  R = @walk_lines()
  R.reset = -> pattern.lastIndex = 0
  return R

#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
@SQL = ( parts, expressions... ) ->
  R = parts[ 0 ]
  for expression, idx in expressions
    R += expression.toString() + parts[ idx + 1 ]
  return R








