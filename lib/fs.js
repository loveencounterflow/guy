(function() {
  'use strict';
  var isa, type_of, types, validate;

  //###########################################################################################################
  types = new (require('intertype')).Intertype();

  ({isa, validate, type_of} = types.export());

  //-----------------------------------------------------------------------------------------------------------
  this.walk_lines = function*(path) {
    var cfg, line, readlines;
    /* TAINT make newline, buffersize configurable */
    /* thx to https://github.com/nacholibre/node-readlines */
    validate.nonempty_text(path);
    cfg = {
      readChunk: 4 * 1024, // chunk_size, byte_count
      newLineCharacter: '\n' // nl
    };
    readlines = new (require('../dependencies/n-readlines-patched'))(path, cfg);
    while ((line = readlines.next()) !== false) {
      yield line.toString('utf-8');
    }
    return null;
  };

}).call(this);

//# sourceMappingURL=fs.js.map