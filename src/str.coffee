
'use strict'



#-----------------------------------------------------------------------------------------------------------
### thx to https://stackoverflow.com/a/6969486/7568091 and
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#escaping ###
@escape_for_regex = ( text ) -> text.replace /[.*+?^${}()|[\]\\]/g, '\\$&'


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
@SQL = ( parts, expressions... ) ->
  R = parts[ 0 ]
  for expression, idx in expressions
    R += expression.toString() + parts[ idx + 1 ]
  return R








