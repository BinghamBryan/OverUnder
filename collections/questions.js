// All Over Under Questions -- data model
// Loaded on both the client and the server

///////////////////////////////////////////////////////////////////////////////
// Questions

/*
  Each party is represented by a document in the Parties collection:
    owner: user id
    text, description: String
    expires: date when the question expires
    created: date and time when created
    correctAnswer: String "over" or "under"
    answers: Array of objects like {user: userId, answer: "over"} (or "under")
    tags: Array of Strings
*/
Questions = new Meteor.Collection("questions");

Questions.allow({
  insert: function (userId, question) {
    return false; // no cowboy inserts -- use createQuestion method
  },
  update: function (userId, question, fields, modifier) {
    if (userId !== question.owner)
      return false; // not the owner

    var allowed = ["number", "text", "expires", "correctAnswer"];
    if (_.difference(fields, allowed).length)
      return false; // tried to write to forbidden field

    // A good improvement would be to validate the type of the new
    // value of the field (and if a string, the length.) In the
    // future Meteor will have a schema system to makes that easier.
    return true;
  },
  remove: function (userId, question) {
    // You can only remove parties that you created and nobody is going to.
    return question.owner === userId && question.answers.length === 0;
  }
});

Meteor.methods({
  // options should include: title, description, x, y, public
  createQuestion: function (options) {
    check(options, {
      number: NonEmptyString,
      text: NonEmptyString,
      expires: Date,
      tags: [NonEmptyString],
      _id: Match.Optional(NonEmptyString)
    });

    if (options.text.length > 100)
      throw new Meteor.Error(413, "Title too long");
    if (! this.userId)
      throw new Meteor.Error(403, "You must be logged in");

    var id = Questions.insert({
      owner: this.userId,
      number: options.number,
      text: options.text,
      expires: options.expires,
      created: moment().toDate(),
      correctAnswer: "",
      answers: [],
      numberOfAnswers: 0,
      tags: options.tags
    });
    return id;
  },

  answer: function (questionId, answer) {
    check(questionId, String);
    check(answer, String);
    if (! this.userId)
      throw new Meteor.Error(403, "You must be logged in to answer");
    if (! _.contains(['over', 'under'], answer))
      throw new Meteor.Error(400, "Invalid answer");
    var question = Questions.findOne(questionId);
    if (! question)
      throw new Meteor.Error(404, "No such question");

    var answerIndex = _.indexOf(_.pluck(question.answers, 'user'), this.userId);
    if (answerIndex !== -1) {
      // update existing answer entry

      if (Meteor.isServer) {
        // update the appropriate answer entry with $
        Questions.update(
          {_id: questionId, "answers.user": this.userId},
          {$set: {"answers.$.answer": answer}});
      } else {
        // minimongo doesn't yet support $ in modifier. as a temporary
        // workaround, make a modifier that uses an index. this is
        // safe on the client since there's only one thread.
        var modifier = {$set: {}};
        modifier.$set["answers." + answerIndex + ".answer"] = answer;
        Questions.update(questionId, modifier);

      }

      // Possible improvement: send email to the other people that are
      // coming to the party.
    } else {
      // add new rsvp entry
      Questions.update(questionId, {$push: {answers: {user: this.userId, answer: answer}}});
      Questions.update(questionId, {$inc: {numberOfAnswers: 1}});
    }
  }
});