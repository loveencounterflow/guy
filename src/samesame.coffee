
'use strict'

############################################################################################################
{ rpr, }                  = require './trm'


#-----------------------------------------------------------------------------------------------------------
@equals     = ( require 'util' ).isDeepStrictEqual
@deep_copy  = ( require '../dependencies/rfdc-patched.js' )()
@copy_regex = ( require '../dependencies/sindresorhus-clone-regexp.js' ).cloneRegExp


