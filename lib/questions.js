//Question Helpers
numberOfOvers = function (question) {
  return (_.groupBy(question.answers, 'answer').over || []).length;
};

numberOfUnders = function (question) {
  return (_.groupBy(question.answers, 'answer').under || []).length;
};

percentOvers = function(question){
  return (numberOfOvers(question) / question.answers.length) * 100;
};

percentUnders = function(question){
  return (numberOfUnders(question) / question.answers.length) * 100;
};