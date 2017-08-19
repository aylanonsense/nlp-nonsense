var StanfordSimpleNLP = require('stanford-simple-nlp');

var stanfordSimpleNLP = new StanfordSimpleNLP.StanfordSimpleNLP();
stanfordSimpleNLP.loadPipelineSync({ annotators: [ 'tokenize', 'ssplit', 'parse' ] });
for(var k in stanfordSimpleNLP) {
	console.log(k);
}
console.log(stanfordSimpleNLP.defaultOptions);

setTimeout(function() {
	var n = Date.now();
	stanfordSimpleNLP.process('I like her but she doesn\'t like me.', function(err, result) {
		console.log("\n\n\nPART ONE", Date.now() - n);
		//console.log(JSON.stringify(result));
		printTreeNode("  ", result.document.sentences.sentence.parsedTree);
	});
}, 200);

setTimeout(function() {
	var n = Date.now();
	stanfordSimpleNLP.process('I pick up my sword and throw it at the skeleton.', function(err, result) {
		console.log("\n\n\nPART TWO", Date.now() - n);
		//console.log(JSON.stringify(result));
		printTreeNode("  ", result.document.sentences.sentence.parsedTree);
	});
}, 400);

setTimeout(function() {
	var n = Date.now();
	stanfordSimpleNLP.process('I wonder if she walks to the mall.', function(err, result) {
		console.log("\n\n\nPART THREE", Date.now() - n);
		//console.log(JSON.stringify(result));
		printTreeNode("  ", result.document.sentences.sentence.parsedTree);
	});
}, 600);

setTimeout(function() {
	var n = Date.now();
	stanfordSimpleNLP.process('She wonders if I walk to the mall.', function(err, result) {
		console.log("\n\n\nPART FOUR", Date.now() - n);
		//console.log(JSON.stringify(result));
		printTreeNode("|-", result.document.sentences.sentence.parsedTree);
	});
}, 800);

function printTreeNode(spacing, node) {
	if(node.word) {
		console.log(spacing + node.type + ' "' + node.word + '"', node);
	}
	else {
		console.log(spacing + node.type, node);
	}
	if(node.children) {
		for(var i = 0; i < node.children.length; i++) {
			printTreeNode(spacing + "|-", node.children[i]);
		}
	}
}