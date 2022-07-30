
'use strict'

############################################################################################################
H                         = require './_helpers'


### thx to https://exploringjs.com/impatient-js/ch_sets.html#missing-set-operations ###

#-----------------------------------------------------------------------------------------------------------
@unite      = ( P... ) -> new Set ( [ p..., ] for p in P ).flat()
@_intersect = ( a, b ) -> new Set ( Array.from a ).filter ( x ) => b.has x

#-----------------------------------------------------------------------------------------------------------
@intersect = ( P... ) ->
  unless ( arity = P.length ) >= 2
    throw new Error "^guy.sets.intersect@1^ expected at least 2 arguments, got #{arity}"
  R = P[ 0 ]
  H.types.validate.set R
  for idx in [ 1 ... arity ]
    p = P[ idx ]
    H.types.validate.set p
    R = @_intersect R, p
    return R if R.size is 0
  return R

#-----------------------------------------------------------------------------------------------------------
@subtract = ( a, b ) -> new Set ( Array.from a ).filter ( x ) => not b.has x
