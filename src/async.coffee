
'use strict'

@every  = ( dts, f  ) =>                         setInterval f,    dts * 1000
@after  = ( dts, f  ) =>                         setTimeout  f,    dts * 1000
@sleep  = ( dts     ) => new Promise ( done ) => setTimeout  done, dts * 1000
@defer  = ( f = ->  ) => await @sleep 0; return await f()
