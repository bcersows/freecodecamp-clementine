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

	this.add = function (req, res) {
		console.log(req.body);
		//console.log(req.user.github);
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
}

module.exports = PollsHandler;
