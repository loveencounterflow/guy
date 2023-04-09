
'use strict'

############################################################################################################
H                         = require './_helpers'


#-----------------------------------------------------------------------------------------------------------
H.types.declare 'guy_str_walk_lines_cfg', tests:
  "@isa.object x":          ( x ) -> @isa.object x
  "@isa.boolean x.trim":    ( x ) -> @isa.boolean x.trim
  "@isa.text x.prepend":    ( x ) -> @isa.text x.prepend
  "@isa.text x.append":     ( x ) -> @isa.text x.append

#-----------------------------------------------------------------------------------------------------------
defaults =
  guy_str_walk_lines_cfg:
    trim:           true
    prepend:        ''
    append:         ''


#-----------------------------------------------------------------------------------------------------------
### thx to https://stackoverflow.com/a/6969486/7568091 and
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#escaping ###
@escape_for_regex = ( text ) -> text.replace /[.*+?^${}()|[\]\\]/g, '\\$&'

#---------------------------------------------------------------------------------------------------------
### thx to https://www.designcise.com/web/tutorial/which-characters-need-to-be-escaped-in-a-regular-expression-class ###
@escape_for_regex_class = ( text ) -> text.replace /([\^\-\]\/])/g, '\\$1'

#-----------------------------------------------------------------------------------------------------------
@walk_lines = ( text, cfg ) ->
  for { line, } from @walk_lines_with_positions text, cfg
    yield line
  return null

#-----------------------------------------------------------------------------------------------------------
@walk_lines_with_positions = ( text, cfg ) ->
  H.types.validate.guy_str_walk_lines_cfg ( cfg = { defaults.guy_str_walk_lines_cfg..., cfg..., } )
  { trim
    prepend
    append  }  = cfg
  #.........................................................................................................
  if text is ''
    yield { lnr: 1, line: '', eol: '', }
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
    [ linenl, line, eol, ] = match
    lnr++
    line  = match[ 1 ]
    line  = line.trimEnd() if trim
    line  = prepend + line  unless prepend  is ''
    line  = line  + append  unless append   is ''
    yield { lnr, line, eol, }
  #.........................................................................................................
  if ( text.match /(\r|\n)$/ )?
    lnr++
    yield { lnr, line: '', eol: '', }
  #.........................................................................................................
  return null

#-----------------------------------------------------------------------------------------------------------
@pluralize = ( word ) ->
  ### thx to https://github.com/sindresorhus/plur/blob/main/index.js ###
  H.types.validate.text word
  return '' if word is ''
  R         = word
  R         = R.replace /(?:s|x|z|ch|sh)$/i, '$&e'
  R         = R.replace /([^aeiou])y$/i,     '$1ie'
  R        += 's'
  if ( to_upper = ( /\p{Lu}$/u ).test word )
    R = R.replace /i?e?s$/i, ( match ) => match.toUpperCase()
  return R


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
@SQL = ( parts, expressions... ) ->
  R = parts[ 0 ]
  for expression, idx in expressions
    R += expression.toString() + parts[ idx + 1 ]
  return R








