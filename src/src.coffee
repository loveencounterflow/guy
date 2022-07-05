
'use strict'

# @PARSER                   = require 'acorn-loose'
@STRICT_PARSER            = require 'acorn'
@LOOSE_PARSER             = require 'acorn-loose'
@AST_walk                 = require 'acorn-walk'
@ASTRING                  = require 'astring'
types                     = new ( require 'intertype' ).Intertype()
types.defaults            = {}
misfit                    = Symbol 'misfit'


#-----------------------------------------------------------------------------------------------------------
types.declare 'guy_src_parse_use', tests:
  "x in [ 'strict', 'loose', 'strict,loose', ]": ( x ) -> x in [ 'strict', 'loose', 'strict,loose', ]

#-----------------------------------------------------------------------------------------------------------
types.declare 'guy_src_parse_cfg', tests:
  "@isa.object x":                          ( x ) -> @isa.object x
  "@isa_optional.text x.text":              ( x ) -> @isa_optional.text x.text
  "@isa.guy_src_parse_use x.use":           ( x ) -> @isa.guy_src_parse_use x.use
  "@isa_optional.callable x.function":      ( x ) -> @isa_optional.callable x.function
  "must have either x.text or x.function":  ( x ) ->
    return ( x.text? and not x.function? ) or ( x.function? and not x.text? )
types.defaults.guy_src_parse_cfg =
  text:         null
  function:     null
  fallback:     misfit
  use:          'strict,loose'
  ecmaVersion:  'latest'

#-----------------------------------------------------------------------------------------------------------
types.defaults.guy_src_acorn_cfg =
  ecmaVersion:                  'latest'
  sourceType:                   undefined
  onInsertedSemicolon:          undefined
  onTrailingComma:              undefined
  allowReserved:                undefined
  allowReturnOutsideFunction:   undefined
  allowImportExportEverywhere:  undefined
  allowAwaitOutsideFunction:    undefined
  allowSuperOutsideMethod:      undefined
  allowHashBang:                undefined
  locations:                    undefined
  onToken:                      undefined
  onComment:                    undefined
  ranges:                       undefined
  program:                      undefined
  sourceFile:                   undefined
  directSourceFile:             undefined
  preserveParens:               undefined

#-----------------------------------------------------------------------------------------------------------
@parse = ( cfg ) =>
  types.validate.guy_src_parse_cfg cfg = { types.defaults.guy_src_parse_cfg..., cfg..., }
  return @_parse cfg

#-----------------------------------------------------------------------------------------------------------
@_parse = ( cfg ) =>
  text            = if cfg.function? then cfg.function.toString() else cfg.text
  { use
    fallback  }   = cfg
  acorn_cfg       = { types.defaults.guy_src_acorn_cfg..., }
  acorn_cfg[ k ]  = cfg[ k ] for k of types.defaults.guy_src_acorn_cfg when cfg[ k ] isnt undefined
  try
    switch use
      when 'strict'       then return @STRICT_PARSER.parse  text, acorn_cfg
      when 'loose'        then return @LOOSE_PARSER.parse   text, acorn_cfg
      when 'strict,loose'
        try return @STRICT_PARSER.parse text, acorn_cfg catch _
        return @LOOSE_PARSER.parse text, acorn_cfg
  catch error
    throw error if fallback is misfit
  return fallback

#-----------------------------------------------------------------------------------------------------------
@_generate = ( P... ) => @ASTRING.generate P...

#-----------------------------------------------------------------------------------------------------------
@slug_node_from_simple_function = ( cfg ) =>
  types.validate.guy_src_parse_cfg cfg = { types.defaults.guy_src_parse_cfg..., cfg..., }
  return @_slug_node_from_simple_function cfg

#-----------------------------------------------------------------------------------------------------------
@_slug_node_from_simple_function = ( cfg ) =>
  collector =
    rtn:    []
    blk:    []
  ast       = @_parse cfg
  return cfg.fallback if ( ast isnt misfit ) and ( ast is cfg.fallback )
  @AST_walk.simple ast,
    ReturnStatement:      ( node ) -> collector.rtn.push node
    BlockStatement:       ( node ) -> collector.blk.push node
  R = null
  return collector.rtn.at 0   if collector.rtn.length is 1
  return collector.blk.at -1  if collector.blk.length >  0
  return ast

#-----------------------------------------------------------------------------------------------------------
@slug_from_simple_function = ( cfg ) =>
  types.validate.guy_src_parse_cfg cfg = { types.defaults.guy_src_parse_cfg..., cfg..., }
  ast = @_slug_node_from_simple_function cfg
  return cfg.fallback if ( ast isnt misfit ) and ( ast is cfg.fallback )
  R = @_generate ast
  R = R.trim().replace /\s*\n\s*/g, ' '
  switch ast.type
    when 'ReturnStatement'
      R = R.replace /^return\s*/, ''
      R = R.replace /;$/, ''
    when 'BlockStatement'
      R = R.replace /^\{\s*(.*?)\s*\}$/, '$1'
  return R



