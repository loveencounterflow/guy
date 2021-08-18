
'use strict'


############################################################################################################
@for_callbackable = require 'deasync'

#-----------------------------------------------------------------------------------------------------------
@for_awaitable = ( fn_with_promise ) -> @for_callbackable ( P..., handler ) =>
  try result = await fn_with_promise P... catch error then return handler error
  handler null, result
  return null
