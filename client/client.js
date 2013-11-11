Meteor.subscribe('questions');

//////////////////////////////////////////////////////////////////////////////
// Page Template
Template.page.helpers({

});

Template.page.questions = function(){
  return Questions.find();
}

Template.page.tags = function(){
  var allTags = [];
  Questions.find().forEach(function(q){
    if (q.tags){
      allTags = allTags.concat(q.tags);
    }
  });
  return allTags;
}

Template.page.getNumberOfUnders = function(){
	return numberOfUnders(this);
}

Template.page.getNumberOfOvers = function(){
	return numberOfOvers(this);
}

Template.page.getPercentUnders = function(){
  return percentUnders(this);
}

Template.page.getPercentOvers = function(){
  return percentOvers(this);
}

Template.page.events({
  'click .overBtn': function (e) {
    e.preventDefault();
    Meteor.call("answer", this._id, "over");
    return false;
  },
  'click .underBtn': function (e) {
    e.preventDefault();
    Meteor.call("answer", this._id, "under");
    return false;
  },
  'click .remove': function () {
    Questions.remove(this._id);
    return false;
  },
  'click .add': function () {
  	openCreateDialog()
  	return false;
  }
});

///////////////////////////////////////////////////////////////////////////////
// Create Over Under dialog

Template.addOverUnder.rendered = function(){
  $('.expires').datepicker();
  $('.addStatement').on('activate', function(){
    $(this).empty();
  })
};

Template.addOverUnder.events({
  'click .save': function (event, template) {
    var number = template.find(".number").value;
    var text = template.find(".text").innerText;
    //var expires = template.find(".expires").value;
    var expires = '24 hours';
    var tagslistarr = text.match(/#\S+/g);

    if (text.length && expires.length && number.length) {
      var id = createQuestion({
        number: number,
        text: text,
        expires: expires,
        tags: tagslistarr
      });
    } 
    else {
      Session.set("createError", "It needs a number, text, and an expiration date, or why bother?");
    }
    return false;
  }
});

Template.addOverUnder.error = function () {
  return Session.get("createError");
};
