Template.passwordRecovery.helpers({
  resetPassword : function(t) {
    return Session.get('resetPassword');
  }
});

Template.passwordRecovery.events({
    'submit #recovery-form' : function(e, t) {
      e.preventDefault()
      var email = trimInput(t.find('#recovery-email').value)

      Session.set('loading', true);
      Accounts.forgotPassword({email: email}, function(err){
        if (err)
          alert('Password Reset Error, Doh');
        else {
          alert('Email Sent. Please check your email.');
        }
        Session.set('loading', false);
      });

      return false; 
    },

    'submit #new-password' : function(e, t) {
      e.preventDefault();
      var pw = t.find('#new-password-password').value;
      if (isValidPassword(pw)) {
        Session.set('loading', true);
        Accounts.resetPassword(Session.get('resetPassword'), pw, function(err){
          if (err)
            alert('Password Reset Error, Sorry');
          else {
            Session.set('resetPassword', null);
          }
          Session.set('loading', false);
        });
      }
    return false; 
    }
});