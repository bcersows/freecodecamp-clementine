'use strict';

var Polls = require('../models/polls.js');

function PollsHandler () {
	
	this.get = function (req, res) {
		Polls
			.find({})
			.exec(function (err, result) {
				if (err) { throw err; }
				res.json(result);
			});
	};
	
	this.getFromUser = function(username, callback) {
		Polls
			.find({"creator": ""+username})
			.exec(function (err, result) {
				if (err) { throw err; }

				callback(result);
			});
	}

	this.add = function (req, res) {
		var poll = new Polls({
			name: req.body.name,
			creator: req.user.github.username,
			options: []
		});
		for ( var i = 0; i<req.body.options.length||0; i++ ) {
			poll.options.push({name: req.body.options[i], votes: 0});
		}
		poll.save(function(err, data) {
			if (err) throw err;
			res.json({msg: "success", data: data});
		});
	};

	this.remove = function (req, res) {
		var id = req.body.id;
		var user = req.user.github.username;
		Polls
			.find({"_id": id, "creator":user})
			.remove()
			.exec(function (err, result) {
				if (err) { throw err; }
				res.json(result);
			});
	};
	
	this.single = function(req, res) {
		var id = req.params.id;
		Polls
			.find({"_id": id})
			.exec(function (err, poll) {
				if (err) { throw err; }
				console.log(poll[0]);
				res.render('poll', {poll: poll[0], url: process.env.APP_URL});
			});
	}
	
	this.voteForOption = function(req, res) {
		var pollId = req.body.pollId;
		var optionId = req.body.optionId;
		if ( !pollId && !optionId ) { res.json({err: "Did not send necessary data!"}); return; }
		Polls
			.findOneAndUpdate({ '_id': pollId, 'options._id': optionId }, { $inc: { 'options.$.votes': 1 } })
			.exec(function (err, result) {
					if (err) { throw err; }

					res.json({msg: "Success"});
				}
			);
	}
}

module.exports = PollsHandler;
