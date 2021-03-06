'use strict';

var path = process.cwd();
var ClickHandler = require(path + '/app/controllers_backend/clickHandler.server.js');
var PollsHandler = require(path + '/app/controllers_backend/pollsHandler.server.js');

module.exports = function (app, passport) {

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/login');
		}
	}

	var clickHandler = new ClickHandler();
	var pollsHandler = new PollsHandler();

	app.route('/')
		.get(function (req, res) {
			res.sendFile(path + '/public/index.html');
		});

	app.route('/login')
		.get(function (req, res) {
			res.sendFile(path + '/public/login.html');
		});

	app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/login');
		});

	app.route('/profile')
		.get(isLoggedIn, function (req, res) {
			res.sendFile(path + '/public/profile.html');
		});
		
	app.route('/mypolls')
		.get(isLoggedIn, function (req, res) {
			var user = req.user.github.username;
			pollsHandler.getFromUser(user, function(result) {
				var total = 0;
				result.forEach(function(poll) {
					var cnt = 0;
					poll.options.forEach(function(option) {
						cnt += option.votes;
					});
					poll.total = cnt;
					total += cnt;
				});
				res.render('mypolls', {polls: result, votes: total});
			});
		});
		
	app.route('/polls/:id')
		.get(pollsHandler.single);
	
	app.route('/api/polls')
		.get(pollsHandler.get)
		.post(isLoggedIn, pollsHandler.add)
		.delete(isLoggedIn, pollsHandler.remove);
		
	app.route('/api/polls/options')
		.post(pollsHandler.voteForOption);
		
	app.route('/api/:id')
		.get(function (req, res) {
			if ( req.isAuthenticated() ) {
				res.json(req.user.github);
			} else {
				res.json({err: "Not authenticated."});
			}
		});

	app.route('/auth/github')
		.get(passport.authenticate('github'));

	app.route('/auth/github/callback')
		.get(passport.authenticate('github', {
			successRedirect: '/',
			failureRedirect: '/login'
		}));
	
	app.route('/api/:id/clicks')
		.get(isLoggedIn, clickHandler.getClicks)
		.post(isLoggedIn, clickHandler.addClick)
		.delete(isLoggedIn, clickHandler.resetClicks);
};
