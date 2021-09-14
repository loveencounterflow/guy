
'use strict'



#-----------------------------------------------------------------------------------------------------------
@pick_with_fallback = ( d, fallback, keys... ) ->
  R = {}
  for key in keys.flat Infinity
    R[ key ] = if ( value = d[ key ] ) is undefined then fallback else value
  return R

#-----------------------------------------------------------------------------------------------------------
@nullify_undefined = ( d ) ->
  R       = {}
  R[ k ]  = ( v ? null ) for k, v of d
  return R

#-----------------------------------------------------------------------------------------------------------
@omit_nullish = ( d ) ->
  R       = {}
  R[ k ]  = v for k, v of d when v?
  return R

