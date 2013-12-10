Router.configure({
	layoutTemplate: 'layout',
	loadingTemplate: 'loading',
	notFoundTemplate: 'notFound'
});

Router.map(function(){

	this.route('home', {
		before: function (){
			if (!Meteor.user()){
				this.render('login');
				this.stop();
			}
			Session.set('tagFilter', null);
		},
		template: 'page',
		path: '/'
	});

	this.route('tag', {
		before: function (){
			if (!Meteor.user()){
				Router.go('home');
			}
			Session.set('tagFilter', this.params.tag);
		},
		template: 'page',
		path: '/t/:tag'
	});

	this.route('login', {
		template: 'login',
		path: '/login'
	});

	this.route('resetPassword', {
		template: 'passwordRecovery',
		path: '/resetPassword'
	});
});