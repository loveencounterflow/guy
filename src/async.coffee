
'use strict'

@every  = ( dts, f  ) =>                            setInterval f,                  dts * 1000
@after  = ( dts, f  ) => new Promise ( resolve ) => setTimeout  ( -> resolve f() ), dts * 1000
@sleep  = ( dts     ) => new Promise ( resolve ) => setTimeout  resolve,            dts * 1000
@defer  = ( f = ->  ) => await @sleep 0; return await f()
