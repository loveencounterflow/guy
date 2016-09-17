
############################################################################################################
PATH                      = require 'path'
FS                        = require 'fs'
#...........................................................................................................
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'GUY'
log                       = CND.get_logger 'plain',     badge
info                      = CND.get_logger 'info',      badge
whisper                   = CND.get_logger 'whisper',   badge
alert                     = CND.get_logger 'alert',     badge
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
help                      = CND.get_logger 'help',      badge
urge                      = CND.get_logger 'urge',      badge
echo                      = CND.echo.bind CND
#...........................................................................................................
{ step, }                 = require 'coffeenode-suspend'
test                      = require 'guy-test'
GUY                       = require './main'


#===========================================================================================================
# HELPERS
#-----------------------------------------------------------------------------------------------------------
@_prune = ->
  for name, value of @
    continue if name.startsWith '_'
    delete @[ name ] unless name in include
  return null

#-----------------------------------------------------------------------------------------------------------
@_main = ( handler = null ) ->
  test @, 'timeout': 30000


#===========================================================================================================
# TESTS
#-----------------------------------------------------------------------------------------------------------
@[ "demo" ] = ( T, done ) ->
  step ( resume ) =>
    yield GUY.f resume
    done()

#-----------------------------------------------------------------------------------------------------------
@[ "find maximum semvers" ] = ( T, done ) ->
  SEMVER = require 'semver'
  probes = CND.shuffle [
    'modified', 'created',
    '0.1.1', '0.1.2', '0.1.3', '0.1.9',
    '1.0.1', '1.0.2', '1.0.3', '1.0.8', '1.0.9',
    '2.0.2',
    '4.1.5', '4.1.6', ]
  #.........................................................................................................
  max_all_semver  = null
  max_v0_semver   = null
  # v0_matcher      = '^0.x' # OK but not so clear; see https://github.com/npm/node-semver#caret-ranges-123-025-004
  v0_matcher      = '>=0.0.0 <1.0.0'
  is_semver       = ( x ) -> ( SEMVER.valid x )?
  is_v0           = ( semver ) -> SEMVER.satisfies semver, v0_matcher
  for semver in probes
    continue unless is_semver semver
    if max_all_semver? then max_all_semver = semver if SEMVER.gt semver, max_all_semver
    else                    max_all_semver = semver
    if is_v0 semver
      if max_v0_semver? then  max_v0_semver = semver if SEMVER.gt semver, max_v0_semver
      else                    max_v0_semver = semver
    debug '34221', semver, max_v0_semver, max_all_semver, ( CND.truth SEMVER.satisfies semver, v0_matcher )
  debug '34221', max_v0_semver, max_all_semver
  T.eq max_v0_semver,   '0.1.9'
  T.eq max_all_semver,  '4.1.6'
  done()


############################################################################################################
unless module.parent?
  include = [
    "demo"
    # "find maximum semvers"
    ]
  @_prune()
  @_main()


