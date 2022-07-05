(function() {
  'use strict';
  var misfit, types;

  // @PARSER                   = require 'acorn-loose'
  this.STRICT_PARSER = require('acorn');

  this.LOOSE_PARSER = require('acorn-loose');

  this.AST_walk = require('acorn-walk');

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
    var R, ast, collector;
    collector = {
      rtn: [],
      blk: []
    };
    ast = this.parse(cfg);
    this.AST_walk.simple(ast, {
      ReturnStatement: function(node) {
        return collector.rtn.push(node);
      },
      BlockStatement: function(node) {
        return collector.blk.push(node);
      }
    });
    R = null;
    if (collector.rtn.length === 1) {
      return collector.rtn.at(0);
    }
    if (collector.blk.length > 0) {
      return collector.blk.at(-1);
    }
    debug('^24243^', cfg);
    if (cfg.fallback !== misfit) {
      return cfg.fallback;
    }
    throw new Error("^guy.props.src@1^ unable to parse input");
  };

  //-----------------------------------------------------------------------------------------------------------
  this.slug_from_simple_function = (cfg) => {
    var R, ast;
    ast = this.slug_node_from_simple_function(cfg);
    switch (ast.type) {
      case 'ReturnStatement':
        R = GUY.src._generate(ast);
        R = R.trim().replace(/\s*\n\s*/g, ' ');
        R = R.replace(/^return\s*/, '');
        R = R.replace(/;$/, '');
        break;
      case 'BlockStatement':
        R = GUY.src._generate(ast);
        R = R.trim().replace(/\s*\n\s*/g, ' ');
        R = R.replace(/^\{\s*(.*?)\s*\}$/, '$1');
        break;
      default:
        throw new Error("^guy.props.src@1^ unable to parse input");
    }
    return R;
  };

}).call(this);

//# sourceMappingURL=src.js.map