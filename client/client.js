Template.page.greeting = function () {
  return "Welcome to overunder.";
};

Template.page.helpers({

});

Template.page.questions = function(){
  return Questions.find();
}

Template.page.events({
  'click input' : function () {
    // template data, if any, is available in 'this'
    if (typeof console !== 'undefined')
      console.log("You pressed the button");
  }
});
