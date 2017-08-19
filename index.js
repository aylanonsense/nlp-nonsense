var test = require('tap').test;
// var test = require('tape');
var DependencyParser = require('./node_modules/dependency-parser/index');
var flipTreeHeadToChild = require('./node_modules/dependency-parser/flip-tree-head-to-child');
var runIteratorUntilDone = require('./node_modules/dependency-parser/tests/fixtures/run-until-done');
var disambiguatePOS = require('./node_modules/dependency-parser/disambiguate-pos');

var nlp = require('nlp_compromise');

var pos = require('node-pos').partsOfSpeech;

var testCases = [
  'I wonder if they like me.'
];

testCases.forEach(runTest);

function runTest(s) {
  pos(s, function(data) {
    console.log('\n\nSentence:');
    console.log('  ' + s);
    var parts = data[0];
    for(var i = 0; i < parts.length; i++) {
      // parts[i].word = parts[i].word.toLowerCase();
      for(var j = 0; j < parts[i].pos.length; j++) {
        parts[i].pos[j] = parts[i].pos[j].toLowerCase().replace(/\s/g, '-');
      }
      if(parts[i].pos.length === 0) {
        parts[i].pos = [ 'noun' ];
      }
      else if(parts[i].pos.length > 1 && parts[i].pos[0] === 'noun' && parts[i].pos[1] === 'verb') {
        parts[i].pos = [ 'verb', 'noun' ];
      }
    }
    var sentence1 = data[0];
    // var sentence2 = testCase.sentence;
    console.log('\nSENTENCE POS\n  ', sentence1);
    // console.log('\nSENTENCE 2', sentence2);
    console.log('');
    var disambiguatedSentence = disambiguatePOS(sentence1, 'pos');
    var parseGenerator = DependencyParser({});
    var parseIterator = parseGenerator(disambiguatedSentence);
    var parsed = runIteratorUntilDone(parseIterator);
    var childBasedTree = flipTreeHeadToChild(parsed.sentence);
    console.log('Tree');
    drawSentenceNode(childBasedTree[0], "    ");
    console.log('\n\n');
  });

  // var disambiguatedSentence = disambiguatePOS(testCase.sentence, 'pos');
  // var parseGenerator = DependencyParser(testCase.createOpts);
  // var parseIterator = parseGenerator(disambiguatedSentence);
  // var parsed = runIteratorUntilDone(parseIterator);
  // var childBasedTree = flipTreeHeadToChild(parsed.sentence);
  // console.log(s);
  // // console.log(JSON.stringify(childBasedTree[0]));
  // drawSentenceNode(childBasedTree[0], "    ");
}

function drawSentenceNode(node, spacing) {
  console.log(spacing + node.word + ' (' + node.pos[0] + ')');
  if(node.children) {
    for(var i = 0; i < node.children.length; i++) {
      drawSentenceNode(node.children[i], spacing + "  ");
    }
  }
}
