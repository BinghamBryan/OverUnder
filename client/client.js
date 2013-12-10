Meteor.subscribe('questions');

//////////////////////////////////////////////////////////////////////////////
// Page Template
Template.page.helpers({

});

Template.page.questions = function(){
  var tagFilter = Session.get('tagFilter');
  var sort = Session.get("sort");
  var options = {};
  if (tagFilter){
    options.tags = '#' + tagFilter;
  }


  var sortParam = {sort: {numberOfAnswers: -1}}; //popular
  if (sort){
    if (sort === "newest"){
      sortParam = {sort: {expires: 1}}; //newest
    }
    else{
      sortParam = {sort: {numberOfAnswers: -1}}; //popular
    }
  }
  
  return Questions.find(options, sortParam);
}

Template.page.tags = function(){
  var allTags = [];
  Questions.find().forEach(function(q){
    if (q.tags){
      allTags = allTags.concat(q.tags);
    }
  });
  var countArr = _.countBy(allTags);
  var keysSorted = Object.keys(countArr).sort(function(a,b){return countArr[b]-countArr[a]})
  return keysSorted;
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

Template.page.getExpirationDate = function(){
  return moment(this.expires).calendar();
}

Template.page.removeHash = function(){
  return this.replace('#', '');
}

Template.page.getCategoryName = function(){
  var name = "Most Popular";
  if (Session.get('tagFilter')){
    name = Session.get('tagFilter');
  }
  return name;
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
  	openCreateDialog();
  	return false;
  },
  'click .tagSearch': function () {
    var tag = $('#txtTagSearch').val();
    if (Session.equals('tagFilter', tag)){
      Session.set('tagFilter', null);
    }
    else{
      Router.go('tag', {tag: tag.toLowerCase()});
    }
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
    var expires = moment().add('days', 7).toDate();
    var tagslistarr = text.match(/#\S+/g);

    if (tagslistarr == null){
      tagslistarr = [];
    }
    else{
      for(var i = 0; i < tagslistarr.length; i++) {
        tagslistarr[i] = tagslistarr[i].toLowerCase();
      }
    }

    if (text.length && number.length) {
      var id = Meteor.call('createQuestion', {
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
