module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _utils = __webpack_require__(2);
	
	Object.defineProperty(exports, 'combineChunks', {
	  enumerable: true,
	  get: function get() {
	    return _utils.combineChunks;
	  }
	});
	Object.defineProperty(exports, 'fillInChunks', {
	  enumerable: true,
	  get: function get() {
	    return _utils.fillInChunks;
	  }
	});
	Object.defineProperty(exports, 'findAll', {
	  enumerable: true,
	  get: function get() {
	    return _utils.findAll;
	  }
	});
	Object.defineProperty(exports, 'findChunks', {
	  enumerable: true,
	  get: function get() {
	    return _utils.findChunks;
	  }
	});

/***/ }),
/* 2 */
/***/ (function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	
	/**
	 * Creates an array of chunk objects representing both higlightable and non highlightable pieces of text that match each search word.
	 * @return Array of "chunks" (where a Chunk is { start:number, end:number, highlight:boolean })
	 */
	var findAll = exports.findAll = function findAll(_ref) {
	  var autoEscape = _ref.autoEscape,
	      _ref$caseSensitive = _ref.caseSensitive,
	      caseSensitive = _ref$caseSensitive === undefined ? false : _ref$caseSensitive,
	      _ref$findChunks = _ref.findChunks,
	      findChunks = _ref$findChunks === undefined ? defaultFindChunks : _ref$findChunks,
	      sanitize = _ref.sanitize,
	      searchWords = _ref.searchWords,
	      textToHighlight = _ref.textToHighlight;
	  return fillInChunks({
	    chunksToHighlight: combineChunks({
	      chunks: findChunks({
	        autoEscape: autoEscape,
	        caseSensitive: caseSensitive,
	        sanitize: sanitize,
	        searchWords: searchWords,
	        textToHighlight: textToHighlight
	      })
	    }),
	    totalLength: textToHighlight ? textToHighlight.length : 0
	  });
	};
	
	/**
	 * Takes an array of {start:number, end:number} objects and combines chunks that overlap into single chunks.
	 * @return {start:number, end:number}[]
	 */
	
	
	var combineChunks = exports.combineChunks = function combineChunks(_ref2) {
	  var chunks = _ref2.chunks;
	
	  chunks = chunks.sort(function (first, second) {
	    console.log("first", first);
	    console.log("second", second);
	
	    return first.start - second.start;
	  }).reduce(function (processedChunks, nextChunk) {
	    // First chunk just goes straight in the array...
	    if (processedChunks.length === 0) {
	      return [nextChunk];
	    } else {
	      // ... subsequent chunks get checked to see if they overlap...
	      var prevChunk = processedChunks.pop();
	      if (nextChunk.start <= prevChunk.end) {
	        // It may be the case that prevChunk completely surrounds nextChunk, so take the
	        // largest of the end indeces.
	        var endIndex = Math.max(prevChunk.end, nextChunk.end);
	        processedChunks.push({
	          highlight: false,
	          start: prevChunk.start,
	          end: endIndex
	        });
	      } else {
	        processedChunks.push(prevChunk, nextChunk);
	      }
	      return processedChunks;
	    }
	  }, []);
	
	  return chunks;
	};
	
	/**
	 * Examine text for any matches.
	 * If we find matches, add them to the returned array as a "chunk" object ({start:number, end:number}).
	 * @return {start:number, end:number}[]
	 */
	var defaultFindChunks = function defaultFindChunks(_ref3) {
	  var autoEscape = _ref3.autoEscape,
	      caseSensitive = _ref3.caseSensitive,
	      _ref3$sanitize = _ref3.sanitize,
	      sanitize = _ref3$sanitize === undefined ? defaultSanitize : _ref3$sanitize,
	      searchWords = _ref3.searchWords,
	      textToHighlight = _ref3.textToHighlight;
	
	  textToHighlight = sanitize(textToHighlight);
	
	  return searchWords.filter(function (searchWord) {
	    return searchWord;
	  }) // Remove empty words
	  .reduce(function (chunks, searchWord) {
	    searchWord = sanitize(searchWord);
	
	    if (autoEscape) {
	      searchWord = escapeRegExpFn(searchWord);
	    }
	
	    var regex = new RegExp(searchWord, caseSensitive ? "g" : "gi");
	
	    var match = void 0;
	    while (match = regex.exec(textToHighlight)) {
	      var _start = match.index;
	      var _end = regex.lastIndex;
	      // We do not return zero-length matches
	      if (_end > _start) {
	        chunks.push({ highlight: false, start: _start, end: _end });
	      }
	
	      // Prevent browsers like Firefox from getting stuck in an infinite loop
	      // See http://www.regexguru.com/2008/04/watch-out-for-zero-length-matches/
	      if (match.index === regex.lastIndex) {
	        regex.lastIndex++;
	      }
	    }
	
	    return chunks;
	  }, []);
	};
	// Allow the findChunks to be overridden in findAll,
	// but for backwards compatibility we export as the old name
	exports.findChunks = defaultFindChunks;
	
	/**
	 * Given a set of chunks to highlight, create an additional set of chunks
	 * to represent the bits of text between the highlighted text.
	 * @param chunksToHighlight {start:number, end:number}[]
	 * @param totalLength number
	 * @return {start:number, end:number, highlight:boolean}[]
	 */
	
	var fillInChunks = exports.fillInChunks = function fillInChunks(_ref4) {
	  var chunksToHighlight = _ref4.chunksToHighlight,
	      totalLength = _ref4.totalLength;
	
	  var allChunks = [];
	  var append = function append(start, end, highlight) {
	    if (end - start > 0) {
	      allChunks.push({
	        start: start,
	        end: end,
	        highlight: highlight
	      });
	    }
	  };
	
	  if (chunksToHighlight.length === 0) {
	    append(0, totalLength, false);
	  } else {
	    var lastIndex = 0;
	    chunksToHighlight.forEach(function (chunk) {
	      append(lastIndex, chunk.start, false);
	      append(chunk.start, chunk.end, true);
	      lastIndex = chunk.end;
	    });
	    append(lastIndex, totalLength, false);
	  }
	  return allChunks;
	};
	
	function defaultSanitize(string) {
	  return string;
	}
	
	function escapeRegExpFn(string) {
	  return string.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
	}

/***/ })
/******/ ]);
//# sourceMappingURL=index.js.map