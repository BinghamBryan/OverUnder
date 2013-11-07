Meteor.subscribe('questions');

//////////////////////////////////////////////////////////////////////////////
// Page Template
Template.page.helpers({

});

Template.page.questions = function(){
  return Questions.find();
}

Template.page.getNumberOfUnders = function(){
	return numberOfUnders(this);
}

Template.page.getNumberOfOvers = function(){
	return numberOfOvers(this);
}

Template.page.events({
  'click .answer_over': function () {
    Meteor.call("answer", this._id, "over");
    return false;
  },
  'click .answer_under': function () {
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
// Create Party dialog

var openCreateDialog = function () {
  Session.set("createError", null);
  Session.set("showCreateDialog", true);
};

Template.page.showCreateDialog = function () {
  return Session.get("showCreateDialog");
};

Template.createDialog.events({
  'click .save': function (event, template) {
    var text = template.find(".text").value;
    var expires = template.find(".expires").value;

    if (text.length && expires.length) {
      var id = createQuestion({
        text: text,
        expires: expires
      });

      Session.set("showCreateDialog", false);
    } 
    else {
      Session.set("createError", "It needs a title and a description, or why bother?");
    }
  },

  'click .cancel': function () {
    Session.set("showCreateDialog", false);
  }
});

Template.createDialog.error = function () {
  return Session.get("createError");
};
