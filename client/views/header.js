Template.header.events = ({
	'click #logoutButton': function(e, tmpl){
		Meteor.logout();
		Router.go('/login');
	},
	'click #popularSortButton': function(e, tmpl){
		Session.set('sort', 'popular');
	},
	'click #newestSortButton': function(e, tmpl){
		Session.set('sort', 'newest');
	}
});