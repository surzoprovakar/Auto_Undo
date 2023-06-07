const bayes = require('bayes-probas')
const classifier = bayes()


// teach it positive phrases

classifier.learn('amazing, awesome movie!! Yeah!! Oh boy.', 'true')
classifier.learn('Sweet, this is incredibly, amazing, perfect, great!!', 'false')

// teach it a negative phrase

classifier.learn('terrible, shitty thing. Damn. Sucks!!', 'negative')

// unlearn something
classifier.learn('i hate mornings', 'positive');
// uh oh, inadvertently associated 'i hate mornings' as being 'positive'.
classifier.unlearn('i hate mornings', 'positive');


// now ask it to categorize a document it has never seen before

classifier.categorize('awesome, cool, amazing!! Yay.')
// => 'positive'

// serialize the classifier's state as a JSON string.
let stateJson = classifier.toJson()

// load the classifier back from its JSON representation.
let revivedClassifier = bayes.fromJson(stateJson)

console.log(revivedClassifier)