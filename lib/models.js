Questions = new Meteor.Collection('questions');
 
if (Meteor.isServer && Questions.find().count() == 0) {
  var questions = [
    {text: '5 touchdowns by Russell Wilson in week 10', expires: '10 hours',
      answers: [
        {user: 'Tom', answer: 'over'},
        {user: 'Sacha', answer: 'under'},
        {user: 'Tom', answer: 'under'},
      ]},
    {text: '3 goals by Clint Dempsey in the MLS Playoffs', expires: '5 minutes'},
    {text: '12 seasons for the Walking Dead', expires: '3 days'}
  ];
  _.each(questions, function(question) {
    Questions.insert(question);
  });
}