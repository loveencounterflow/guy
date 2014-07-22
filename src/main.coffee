
############################################################################################################
# njs_util                  = require 'util'
njs_path                  = require 'path'
njs_url = require 'url'
#...........................................................................................................
# BAP                       = require 'coffeenode-bitsnpieces'
TEXT                      = require 'coffeenode-text'
TRM                       = require 'coffeenode-trm'
rpr                       = TRM.rpr.bind TRM
badge                     = 'guy'
log                       = TRM.get_logger 'plain',     badge
info                      = TRM.get_logger 'info',      badge
whisper                   = TRM.get_logger 'whisper',   badge
alert                     = TRM.get_logger 'alert',     badge
debug                     = TRM.get_logger 'debug',     badge
warn                      = TRM.get_logger 'warn',      badge
help                      = TRM.get_logger 'help',      badge
urge                      = TRM.get_logger 'urge',      badge
echo                      = TRM.echo.bind TRM
rainbow                   = TRM.rainbow.bind TRM
#...........................................................................................................
glob                      = require 'glob'
#...........................................................................................................
### https://github.com/mikeal/request ###
request                   = require 'request'
#...........................................................................................................
### https://github.com/caolan/async ###
ASYNC                     = require 'async'
#...........................................................................................................
### https://github.com/libgit2/node-gitteh ###
gitteh                    = require 'gitteh'
#...........................................................................................................
### http://docopt.org
    https://github.com/docopt/docopt ###
docopt                    = ( require 'docopt' ).docopt
@raw_options              = null
@options                  = {}
@commands                 = {}


#-----------------------------------------------------------------------------------------------------------
@commands[ 'watch' ] = ->
  throw new Error "not implemented"

#-----------------------------------------------------------------------------------------------------------
@commands[ 'repl' ] = ->
  #---------------------------------------------------------------------------------------------------------
  get_repl_completer = ( completions ) ->
    return ( line ) =>
      hits = completions.filter ( completion ) =>
        return ( completion.indexOf line ) is 0
      return [ ( if hits.length then hits else completions ), line, ]
  #---------------------------------------------------------------------------------------------------------
  project_names = @_get_project_names()
  #.........................................................................................................
  options =
    input:      process.stdin
    output:     process.stdout
    ### TAINT synchronize usage message and tab completion ###
    completer:  get_repl_completer "help build pub github npm watch".split /\s+/
  readline = ( require 'readline' ).createInterface options
  #.........................................................................................................
  readline.question "Enter a command:", ( answer ) =>
    info "Thank you for your valuable feedback: ", rpr answer
    readline.close()
    #.........................................................................................................
    ### YUCK ###
    options[ 'completer' ] = get_repl_completer project_names
    readline = ( require 'readline' ).createInterface options
    readline.question "Enter an optional project name:", ( answer ) =>
      info "Thank you for your valuable feedback: ", rpr answer
      readline.close()
  #.........................................................................................................
  return null

#-----------------------------------------------------------------------------------------------------------
@get_project_candidate_routes = ->
  ### Returns a list of all locators of all subfolders of the current working directory (`process.cwd()`).
  This may include locators to directories that are not `require`able NodeJS / npm packages. ###
  home    = process.cwd()
  routes  = ( route.replace /.$/, '' for route in glob.sync './*/' )
  return ( njs_path.join home, route for route in routes )

#-----------------------------------------------------------------------------------------------------------
@is_requirable = ( route ) ->
  try
    require.resolve route
    return yes
  catch error
    throw error unless error.code is 'MODULE_NOT_FOUND'
    return no

#-----------------------------------------------------------------------------------------------------------
@get_package_json = ( route ) ->
  route = njs_path.join route, 'package.json'
  try
    return require route
  catch error
    throw error unless error.code is 'MODULE_NOT_FOUND'
    return null

#-----------------------------------------------------------------------------------------------------------
@read_npm_info = ( name, handler ) ->
  options =
    'url':      njs_url.resolve 'https://registry.npmjs.org', name
    'json':     yes
  #---------------------------------------------------------------------------------------------------------
  request options, ( error, response, npm_info ) =>
    return handler error if error?
    if ( message = npm_info[ 'error' ] )?
      return handler null, null if message is 'not_found'
      return handler new Error message
    return handler null, npm_info
  #---------------------------------------------------------------------------------------------------------
  return null

#-----------------------------------------------------------------------------------------------------------
@read_git_infos = ( route, handler ) ->
  Z =
    'route':        route
    'is-git':       null
    'remote-url':   null
  #---------------------------------------------------------------------------------------------------------
  open_repo = ( handler ) =>
    #.......................................................................................................
    gitteh.openRepository route, ( error, repo ) =>
      if error?
        accept = no
        accept = accept or /The `\.git` file at .+ is malformed/   .test error[ 'message' ]
        accept = accept or /Could not find repository/             .test error[ 'message' ]
        return handler error unless accept
        Z[ 'is-git' ] = no
        return handler null, null
      Z[ 'is-git' ] = yes
      handler null, repo
    #.......................................................................................................
    return null
  #---------------------------------------------------------------------------------------------------------
  read_remote = ( repo, handler ) =>
    return handler null, null unless repo?
    #.......................................................................................................
    repo.remote 'origin', ( error, remote ) =>
      if error?
        accept = no
        accept = accept or /Config variable 'remote\.origin\.url' not found/.test error[ 'message' ]
        return handler error unless accept
        return handler null, null
      Z[ 'remote-url' ] = remote[ 'url' ]
      handler null, remote
    #.......................................................................................................
    return null
  #---------------------------------------------------------------------------------------------------------
  ASYNC.waterfall [ open_repo, read_remote ], ( error ) =>
    return handler error if error?
    return handler null, Z
  #.........................................................................................................
  return null

#-----------------------------------------------------------------------------------------------------------
@read_project_infos = ( handler ) ->
  routes  = @get_project_candidate_routes()
  tasks   = []
  #.........................................................................................................
  for route in routes
    do ( route ) =>
      package_info  = @get_package_json route
      project_info  =
        'route':                      route
        'fs-name':                    njs_path.basename route
        'has-package-json':           package_info?
        'npm-name':                   package_info?[ 'name'     ] ? null
        'local-version':              package_info?[ 'version'  ] ? null
        'is-requirable':              @is_requirable route
        'is-git':                     null
        'remote-url':                 null
        'has-changes':                null
        'is-on-npm':                  null
        'npm-version':                null
      tasks.push ( handler ) =>
        @read_git_infos route, ( error, git_info ) =>
          return handler error if error?
          project_info[ 'is-git'      ] = git_info[ 'is-git'      ]
          project_info[ 'remote-url'  ] = git_info[ 'remote-url'  ]
          handler null, project_info
  #.........................................................................................................
  ASYNC.parallelLimit tasks, 10, handler
  return null

# #-----------------------------------------------------------------------------------------------------------
# @_get_project_routes = ->
#   R = @get_project_candidate_routes()
#   #.........................................................................................................
#   for idx in [ R.length - 1 .. 0 ] by -1
#     try
#       require.resolve R[ idx ]
#     catch error
#       throw error unless error.code is 'MODULE_NOT_FOUND'
#       R.splice idx, 1
#       continue
#   #.........................................................................................................
#   return R

# @read_project_infos ( error, project_infos ) ->
#   throw error if error?
#   # whisper project_infos
#   for project_info in project_infos
#     log TRM.rainbow project_info
#   whisper 'ok'

# https://registry.npmjs.org/arabika

# npm = require 'npm'
# # info name for name of npm.commands
# config = require '/Volumes/Storage/cnd/node_modules/coffeenode-text/package.json'
# npm.load config, ( error, response ) ->
#   throw error if error?
#   debug response
#   npm.commands.view ( error, response ) ->
#     throw error if error?
#     debug response

@read_npm_info 'coffeenode-text', ( error, npm_info ) ->
  throw error if error?
  if npm_info is null
    whisper 'not found'
  else
    urge 'npm version:', npm_info[ 'dist-tags' ]?[ 'latest' ] ? null

############################################################################################################
->
  unless module.parent?
    usage = """

    Usage:
      guy                           Start interactive session.
      guy [<command>] [<name>]
      guy foo [<name>]
      guy help [<command>]          Show help.
      guy build [<name>]            Build project.
      guy pub [<name>]              Same as `guy build && guy github && guy npm`.
      guy github [<name>]           Build and publish changes to github.com.
      guy npm [<name>]              Build and publish changes to npmjs.org.
      guy watch [<name>]
      guy ls [<name>]               List one or all projects with build and publishing status.

    Options:
      -h, --help                    Show help.
      -v, --version                 Show version.
    """
    @raw_options = docopt usage, version: ( require '../package.json' )[ 'version' ]
    @options[ 'command-name'  ] = command = @raw_options[ '<command>'  ] ? 'repl'
    @options[ 'project-name'  ] = name    = @raw_options[ '<name>'     ]
    debug @raw_options
    info @options
    command = @commands[ command ]
    throw new Error "unknown command #{rpr command}" unless command?
    ( command.bind @ )()
    # @main()


