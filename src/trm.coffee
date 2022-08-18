
'use strict'

############################################################################################################
H                         = require './_helpers'
C                         = require './_temporary_colors'
C._temoprary_compile_colors @
σ_guy                     = Symbol 'GUY'
globalThis[ σ_guy ]      ?= {}
globalThis[ σ_guy ].t0   ?= Date.now()
### thx to https://github.com/chalk/ansi-regex/blob/main/index.js ###
@_ansi_pattern              = ///
  [\u001B\u009B]
  [[\]()\#;?]*
  (?:(?:(?:(?:;[-a-zA-Z\d\/\#&.:=?%@~_]+)*
  |
  [a-zA-Z\d]+
  (?:;[-a-zA-Z\d\/\#&.:=?%@~_]*)*)?\u0007)
  |
  (?:(?:\d{1,4}(?:;\d{0,4})*)?
  [\dA-PR-TZcf-nq-uy=><~]))
  ///g

# @_ansi_pattern = do =>
#   ```
#   function ansiRegex({onlyFirst = false} = {}) {
#     const pattern = [
#       '[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)',
#       '(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))'
#     ].join('|');

#     return new RegExp(pattern, onlyFirst ? undefined : 'g');
#   }
#   ```
#   return ansiRegex()


#-----------------------------------------------------------------------------------------------------------
@truth = ( x ) ->
  return @green   @rpr x if x is true
  return @red     @rpr x if x is false
  return @yellow  @rpr x

#-----------------------------------------------------------------------------------------------------------
@rpr      = H.rpr
@inspect  = H.inspect

#-----------------------------------------------------------------------------------------------------------
@get_writer = ( target, front = '', back = '\n' ) -> ( P... ) =>
  target.write front + ( @pen P... ) + back
  return null

#-----------------------------------------------------------------------------------------------------------
@pen = ( P... ) =>
  ### Given any number of arguments, return a text representing the arguments as seen fit for output
  commands like `log` and `echo`. ###
  R = ( ( if H.types.isa.text p then p else @rpr p ) for p in P )
  return R.join H._trm_cfg.separator

#-----------------------------------------------------------------------------------------------------------
@get_loggers = ( badge = null ) =>
  prefix  = if badge? then ( ' ' + ( @grey badge ) +  ' ' ) else ''
  R       =
    alert:    ( P... ) => @log ( @grey get_timestamp() ) + ( @blink @RED ' ⚠ '  ) + prefix + ( @RED     P...  )
    debug:    ( P... ) => @log ( @grey get_timestamp() ) + ( @grey ' ⚙ '        ) + prefix + ( @pink    P...  )
    help:     ( P... ) => @log ( @grey get_timestamp() ) + ( @gold ' ☛ '        ) + prefix + ( @lime    P...  )
    info:     ( P... ) => @log ( @grey get_timestamp() ) + ( @grey ' ▶ '        ) + prefix + ( @BLUE    P...  )
    plain:    ( P... ) => @log ( @grey get_timestamp() ) + ( @grey ' ▶ '        ) + prefix + ( @pen P... )
    praise:   ( P... ) => @log ( @grey get_timestamp() ) + ( @GREEN ' ✔ '       ) + prefix + ( @GREEN   P...  )
    urge:     ( P... ) => @log ( @grey get_timestamp() ) + ( @bold @RED ' ? '   ) + prefix + ( @orange  P...  )
    warn:     ( P... ) => @log ( @grey get_timestamp() ) + ( @bold @RED ' ! '   ) + prefix + ( @RED     P...  )
    whisper:  ( P... ) => @log ( @grey get_timestamp() ) + ( @grey ' ▶ '        ) + prefix + ( @grey    P...  )
  #.........................................................................................................
  return R

#-----------------------------------------------------------------------------------------------------------
get_timestamp = =>
  t1  = Math.floor ( Date.now() - globalThis[ σ_guy ].t0 ) / 1000
  s   = t1 % 60
  s   = '' + s
  s   = '0' + s if s.length < 2
  m   = ( Math.floor t1 / 60 ) % 100
  m   = '' + m
  m   = '0' + m if m.length < 2
  return "#{m}:#{s}"


#-----------------------------------------------------------------------------------------------------------
@log                      = @get_writer process.stderr
@echo                     = @get_writer process.stdout
@strip_ansi               = ( text ) -> text.replace @_ansi_pattern, ''
