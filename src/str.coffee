
'use strict'

############################################################################################################
# types                     = new ( require 'intertype' ).Intertype()
# { isa
#   validate
#   type_of }               = types.export()



#-----------------------------------------------------------------------------------------------------------
@SQL = ( parts, expressions... ) ->
  R = parts[ 0 ]
  for expression, idx in expressions
    R += expression.toString() + parts[ idx + 1 ]
  return R






