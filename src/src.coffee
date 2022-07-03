
'use strict'

@PARSER                   = require 'acorn-loose'
@ASTRING                  = require 'astring'
types                     = new ( require 'intertype' ).Intertype()
types.defaults            = {}

#-----------------------------------------------------------------------------------------------------------
types.declare 'guy_src_parse_cfg', tests:
  "@isa.object x":                          ( x ) -> @isa.object x
  "@isa_optional.text x.text":              ( x ) -> @isa_optional.text x.text
  "@isa_optional.callable x.function":      ( x ) -> @isa_optional.callable x.function
  "must have either x.text or x.function":  ( x ) ->
    return ( x.text? and not x.function? ) or ( x.function? and not x.text? )
types.defaults.guy_src_parse_cfg =
  text:         null
  function:     null
  ecmaVersion:  '2022'

#-----------------------------------------------------------------------------------------------------------
@parse = ( cfg ) =>
  cfg   = { types.defaults.guy_src_parse_cfg..., cfg..., }
  types.validate.guy_src_parse_cfg cfg
  text  = if cfg.function? then cfg.function.toString() else cfg.text
  delete cfg.function
  delete cfg.text
  return @PARSER.parse text, cfg

#-----------------------------------------------------------------------------------------------------------
@get_first_return_clause_node = ( callable ) =>
  types.validate.callable callable
  @_get_first_return_clause_node @parse function: callable

#-----------------------------------------------------------------------------------------------------------
@_get_first_return_clause_node = ( ast ) =>
  return @_get_first_return_clause_node ast.body if types.isa.object ast
  for node in ast
    if node.type is 'ReturnStatement'
      return node
    else
      return R if ( R = @_get_first_return_clause_node node )?
  return null

#-----------------------------------------------------------------------------------------------------------
@get_first_return_clause_text = ( callable ) =>
  @ASTRING.generate @get_first_return_clause_node callable

  # debug parser.parse ( ( x ) -> @isa.foo x ).toString(), { ecmaVersion: '2022', }
  # urge generate { type: 'Program', start: 0, end: 49, body: [ { type: 'FunctionDeclaration', start: 0, end: 49, id: { type: 'Identifier', start: 8, end: 8, name: '✖' }, params: [ { type: 'Identifier', start: 9, end: 10, name: 'x' } ], generator: false, expression: false, async: false, body: { type: 'BlockStatement', start: 12, end: 49, body: [ { type: 'ReturnStatement', start: 20, end: 43, argument: { type: 'CallExpression', start: 27, end: 42, callee: { type: 'MemberExpression', start: 27, end: 39, object: { type: 'MemberExpression', start: 27, end: 35, object: { type: 'ThisExpression', start: 27, end: 31 }, property: { type: 'Identifier', start: 32, end: 35, name: 'isa' }, computed: false, optional: false }, property: { type: 'Identifier', start: 36, end: 39, name: 'foo' }, computed: false, optional: false }, arguments: [ { type: 'Identifier', start: 40, end: 41, name: 'x' } ], optional: false } } ] } } ], sourceType: 'script' }
  # urge generate { type: 'BlockStatement', start: 12, end: 49, body: [ { type: 'ReturnStatement', start: 20, end: 43, argument: { type: 'CallExpression', start: 27, end: 42, callee: { type: 'MemberExpression', start: 27, end: 39, object: { type: 'MemberExpression', start: 27, end: 35, object: { type: 'ThisExpression', start: 27, end: 31 }, property: { type: 'Identifier', start: 32, end: 35, name: 'isa' }, computed: false, optional: false }, property: { type: 'Identifier', start: 36, end: 39, name: 'foo' }, computed: false, optional: false }, arguments: [ { type: 'Identifier', start: 40, end: 41, name: 'x' } ], optional: false } } ] }
  # urge generate { type: 'ReturnStatement', start: 20, end: 43, argument: { type: 'CallExpression', start: 27, end: 42, callee: { type: 'MemberExpression', start: 27, end: 39, object: { type: 'MemberExpression', start: 27, end: 35, object: { type: 'ThisExpression', start: 27, end: 31 }, property: { type: 'Identifier', start: 32, end: 35, name: 'isa' }, computed: false, optional: false }, property: { type: 'Identifier', start: 36, end: 39, name: 'foo' }, computed: false, optional: false }, arguments: [ { type: 'Identifier', start: 40, end: 41, name: 'x' } ], optional: false } }



