(function() {
  'use strict';
  var misfit, types;

  // @PARSER                   = require 'acorn-loose'
  this.STRICT_PARSER = require('acorn');

  this.LOOSE_PARSER = require('acorn-loose');

  this.AST_WALKER = require('acorn-walk');

  this.ASTRING = require('astring');

  types = new (require('intertype')).Intertype();

  types.defaults = {};

  misfit = Symbol('misfit');

  //-----------------------------------------------------------------------------------------------------------
  types.declare('guy_src_parse_use', {
    tests: {
      "x in [ 'strict', 'loose', 'strict,loose', ]": function(x) {
        return x === 'strict' || x === 'loose' || x === 'strict,loose';
      }
    }
  });

  //-----------------------------------------------------------------------------------------------------------
  types.declare('guy_src_parse_cfg', {
    tests: {
      "@isa.object x": function(x) {
        return this.isa.object(x);
      },
      "@isa_optional.text x.text": function(x) {
        return this.isa_optional.text(x.text);
      },
      "@isa.guy_src_parse_use x.use": function(x) {
        return this.isa.guy_src_parse_use(x.use);
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
    fallback: misfit,
    use: 'strict,loose',
    ecmaVersion: 'latest'
  };

  //-----------------------------------------------------------------------------------------------------------
  this.parse = (cfg) => {
    var _, error, fallback, text, use;
    types.validate.guy_src_parse_cfg(cfg = {...types.defaults.guy_src_parse_cfg, ...cfg});
    text = cfg.function != null ? cfg.function.toString() : cfg.text;
    ({use, fallback} = cfg);
    delete cfg.fallback;
    delete cfg.function;
    delete cfg.text;
    delete cfg.use;
    try {
      switch (use) {
        case 'strict':
          return this.STRICT_PARSER.parse(text, cfg);
        case 'loose':
          return this.LOOSE_PARSER.parse(text, cfg);
        case 'strict,loose':
          try {
            return this.STRICT_PARSER.parse(text, cfg);
          } catch (error1) {
            _ = error1;
          }
          return this.LOOSE_PARSER.parse(text, cfg);
      }
    } catch (error1) {
      error = error1;
      if (fallback === misfit) {
        throw error;
      }
    }
    return fallback;
  };

  //-----------------------------------------------------------------------------------------------------------
  this._generate = (...P) => {
    return this.ASTRING.generate(...P);
  };

  //-----------------------------------------------------------------------------------------------------------
  this.slug_node_from_simple_function = (cfg) => {
    var ast;
    return ast = this.parse(cfg);
  };

  //-----------------------------------------------------------------------------------------------------------
  this.slug_from_simple_function = (cfg) => {
    return this._generate(this.slug_node_from_simple_function(cfg));
  };

  // debug parser.parse ( ( x ) -> @isa.foo x ).toString(), { ecmaVersion: '2022', }
// urge generate { type: 'Program', start: 0, end: 49, body: [ { type: 'FunctionDeclaration', start: 0, end: 49, id: { type: 'Identifier', start: 8, end: 8, name: '✖' }, params: [ { type: 'Identifier', start: 9, end: 10, name: 'x' } ], generator: false, expression: false, async: false, body: { type: 'BlockStatement', start: 12, end: 49, body: [ { type: 'ReturnStatement', start: 20, end: 43, argument: { type: 'CallExpression', start: 27, end: 42, callee: { type: 'MemberExpression', start: 27, end: 39, object: { type: 'MemberExpression', start: 27, end: 35, object: { type: 'ThisExpression', start: 27, end: 31 }, property: { type: 'Identifier', start: 32, end: 35, name: 'isa' }, computed: false, optional: false }, property: { type: 'Identifier', start: 36, end: 39, name: 'foo' }, computed: false, optional: false }, arguments: [ { type: 'Identifier', start: 40, end: 41, name: 'x' } ], optional: false } } ] } } ], sourceType: 'script' }
// urge generate { type: 'BlockStatement', start: 12, end: 49, body: [ { type: 'ReturnStatement', start: 20, end: 43, argument: { type: 'CallExpression', start: 27, end: 42, callee: { type: 'MemberExpression', start: 27, end: 39, object: { type: 'MemberExpression', start: 27, end: 35, object: { type: 'ThisExpression', start: 27, end: 31 }, property: { type: 'Identifier', start: 32, end: 35, name: 'isa' }, computed: false, optional: false }, property: { type: 'Identifier', start: 36, end: 39, name: 'foo' }, computed: false, optional: false }, arguments: [ { type: 'Identifier', start: 40, end: 41, name: 'x' } ], optional: false } } ] }
// urge generate { type: 'ReturnStatement', start: 20, end: 43, argument: { type: 'CallExpression', start: 27, end: 42, callee: { type: 'MemberExpression', start: 27, end: 39, object: { type: 'MemberExpression', start: 27, end: 35, object: { type: 'ThisExpression', start: 27, end: 31 }, property: { type: 'Identifier', start: 32, end: 35, name: 'isa' }, computed: false, optional: false }, property: { type: 'Identifier', start: 36, end: 39, name: 'foo' }, computed: false, optional: false }, arguments: [ { type: 'Identifier', start: 40, end: 41, name: 'x' } ], optional: false } }

}).call(this);

//# sourceMappingURL=src.js.map