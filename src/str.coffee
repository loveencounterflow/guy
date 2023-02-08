
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

#---------------------------------------------------------------------------------------------------------
### thx to https://www.designcise.com/web/tutorial/which-characters-need-to-be-escaped-in-a-regular-expression-class ###
@escape_for_regex_class = ( text ) -> text.replace /([\^\-\]\/])/g, '\\$1'

#-----------------------------------------------------------------------------------------------------------
@walk_lines = ( text, cfg ) -> yield line for { line, } from @walk_lines_with_positions text, cfg
    yield text
  return null

#-----------------------------------------------------------------------------------------------------------
@walk_lines_with_positions = ( text, cfg ) ->
  H.types.validate.guy_str_walk_lines_cfg ( cfg = { defaults.guy_str_walk_lines_cfg..., cfg..., } )
  { trim }  = cfg
  #.........................................................................................................
  if text is ''
    yield { idx: -1, lnr: 1, text: '', nl: '', }
    return null
  #.........................................................................................................
  lnr           = 0
  pattern       = /(.*?)(\r\n|\r|\n|$)/suy
  last_position = text.length - 1
  #.........................................................................................................
  loop
    idx = pattern.lastIndex
    break if pattern.lastIndex > last_position
    break unless ( match = text.match pattern )?
    [ linenl, line, nl, ] = match
    lnr++
    if trim
      line  = match[ 1 ].trimEnd()
      yield { idx, lnr, line, nl, }
    else
      line  = match[ 1 ]
      yield { idx, lnr, line, nl, }
  #.........................................................................................................
  if ( text.match /\n$/ )?
    lnr++
    yield { idx: pattern.lastIndex + 1, lnr, text: '', nl: '\n', }
  #.........................................................................................................
  return null

#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
@SQL = ( parts, expressions... ) ->
  R = parts[ 0 ]
  for expression, idx in expressions
    R += expression.toString() + parts[ idx + 1 ]
  return R








