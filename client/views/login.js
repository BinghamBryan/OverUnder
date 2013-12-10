Template.login.events({
	'submit #login-form': function(e, tmpl){
		e.preventDefault();

		var email = trimInput(tmpl.find('#login-email').value);
		var password = trimInput(tmpl.find('#login-password').value);

		//TODO: Validate info

		Meteor.loginWithPassword(email, password, function (error) {
			if (error){
				alert("Error logging in");
			}
			else{
				Router.go('/');
			}
		});
		return false;
	},
	'submit #account-form': function(e, tmpl){
		e.preventDefault();

		var name = trimInput(tmpl.find('#account-name').value);
		var email = trimInput(tmpl.find('#account-email').value);
		var password = trimInput(tmpl.find("#account-password").value);

		//TODO: Validate info

		Accounts.createUser({
			username: name.replace(/\s/g, ''),
			password: password,
			email: email,
			profile: {
				name: name
			}
		}, function (err) {
			if (err){
				alert("Error creating your account");
			}
			else{
				//Success
				Router.go('/');
			}
		});
		return false;
	}
});