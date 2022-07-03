(function() {
  'use strict';
  var types;

  this.PARSER = require('acorn-loose');

  this.ASTRING = require('astring');

  types = new (require('intertype')).Intertype();

  types.defaults = {};

  //-----------------------------------------------------------------------------------------------------------
  types.declare('guy_src_parse_cfg', {
    tests: {
      "@isa.object x": function(x) {
        return this.isa.object(x);
      },
      "@isa_optional.text x.text": function(x) {
        return this.isa_optional.text(x.text);
      },
      "@isa_optional.callable x.function": function(x) {
        return this.isa_optional.callable(x.function);
      },
      "must have either x.text or x.function": function(x) {
        return ((x.text != null) && (x.function == null)) || ((x.function != null) && (x.text == null));
      }
    }
  });

  types.defaults.guy_src_parse_cfg = {
    text: null,
    function: null,
    ecmaVersion: '2022'
  };

  //-----------------------------------------------------------------------------------------------------------
  this.parse = (cfg) => {
    var text;
    cfg = {...types.defaults.guy_src_parse_cfg, ...cfg};
    types.validate.guy_src_parse_cfg(cfg);
    text = cfg.function != null ? cfg.function.toString() : cfg.text;
    delete cfg.function;
    delete cfg.text;
    return this.PARSER.parse(text, cfg);
  };

  //-----------------------------------------------------------------------------------------------------------
  this.get_first_return_clause_node = (callable) => {
    types.validate.callable(callable);
    return this._get_first_return_clause_node(this.parse({
      function: callable
    }));
  };

  //-----------------------------------------------------------------------------------------------------------
  this._get_first_return_clause_node = (ast) => {
    var R, i, len, node;
    if (types.isa.object(ast)) {
      return this._get_first_return_clause_node(ast.body);
    }
    for (i = 0, len = ast.length; i < len; i++) {
      node = ast[i];
      if (node.type === 'ReturnStatement') {
        return node;
      } else {
        if ((R = this._get_first_return_clause_node(node)) != null) {
          return R;
        }
      }
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.get_first_return_clause_text = (callable) => {
    return this.ASTRING.generate(this.get_first_return_clause_node(callable));
  };

  // debug parser.parse ( ( x ) -> @isa.foo x ).toString(), { ecmaVersion: '2022', }
// urge generate { type: 'Program', start: 0, end: 49, body: [ { type: 'FunctionDeclaration', start: 0, end: 49, id: { type: 'Identifier', start: 8, end: 8, name: '✖' }, params: [ { type: 'Identifier', start: 9, end: 10, name: 'x' } ], generator: false, expression: false, async: false, body: { type: 'BlockStatement', start: 12, end: 49, body: [ { type: 'ReturnStatement', start: 20, end: 43, argument: { type: 'CallExpression', start: 27, end: 42, callee: { type: 'MemberExpression', start: 27, end: 39, object: { type: 'MemberExpression', start: 27, end: 35, object: { type: 'ThisExpression', start: 27, end: 31 }, property: { type: 'Identifier', start: 32, end: 35, name: 'isa' }, computed: false, optional: false }, property: { type: 'Identifier', start: 36, end: 39, name: 'foo' }, computed: false, optional: false }, arguments: [ { type: 'Identifier', start: 40, end: 41, name: 'x' } ], optional: false } } ] } } ], sourceType: 'script' }
// urge generate { type: 'BlockStatement', start: 12, end: 49, body: [ { type: 'ReturnStatement', start: 20, end: 43, argument: { type: 'CallExpression', start: 27, end: 42, callee: { type: 'MemberExpression', start: 27, end: 39, object: { type: 'MemberExpression', start: 27, end: 35, object: { type: 'ThisExpression', start: 27, end: 31 }, property: { type: 'Identifier', start: 32, end: 35, name: 'isa' }, computed: false, optional: false }, property: { type: 'Identifier', start: 36, end: 39, name: 'foo' }, computed: false, optional: false }, arguments: [ { type: 'Identifier', start: 40, end: 41, name: 'x' } ], optional: false } } ] }
// urge generate { type: 'ReturnStatement', start: 20, end: 43, argument: { type: 'CallExpression', start: 27, end: 42, callee: { type: 'MemberExpression', start: 27, end: 39, object: { type: 'MemberExpression', start: 27, end: 35, object: { type: 'ThisExpression', start: 27, end: 31 }, property: { type: 'Identifier', start: 32, end: 35, name: 'isa' }, computed: false, optional: false }, property: { type: 'Identifier', start: 36, end: 39, name: 'foo' }, computed: false, optional: false }, arguments: [ { type: 'Identifier', start: 40, end: 41, name: 'x' } ], optional: false } }

}).call(this);

//# sourceMappingURL=src.js.map