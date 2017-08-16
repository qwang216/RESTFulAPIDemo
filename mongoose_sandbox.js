'use strict';

var mongoose = require('mongoose');

// connect mongodb server
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/sandbox')

// we can monitor the status of the request through mongoose's connection object 
// and store it in an object call db
var db = mongoose.connection;

// handle err event with on method
db.on('error', function(err){
	console.error('connection error :', err);
});

// listen to the open event... this method will excute once the connection is open
db.once('open', function() {
	console.log('db connection is successful');
	// logic for all database communication goes here!!!!!

	// we need to create an schema
	var Schema = mongoose.Schema;
	var animalSchema = new Schema({
		type: 	{type: String, default: 'goldfish' },
		color: 	{type: String, default: 'golden' },
		size: 	{type: String, default: 'small' },
		mass: 	{type: Number, default: 0.007 },
		name: 	{type: String, default: 'Angela' }
	});

	var Animal = mongoose.model('Animal', animalSchema);

	var elephant = new Animal({
		type: 'elephant',
		size: 'big',
		color: 'gray',
		mass: 6000,
		name: 'Lawrence'
	});


	var animal = new Animal({}); //Goldfish

	var whale = new Animal({
		type: 'whale',
		size: 'big',
		mass: 190500,
		name: 'Fig'
	});

	Animal.remove({}, function(err){
		if (err) console.error('remove failed :', err);
		elephant.save(function(err) {
			if (err) console.error('save failed :', err);
		// once we're done communicating with db we can close the connection
			animal.save(function(err){
				if (err) console.error('save failed :', err);
				whale.save(function(err){
					if (err) console.error('save failed :', err);
					Animal.find({ size: 'big'}, function(err, animals) {
						animals.forEach(function(animal){
							console.log(animal.name + ' the ' + animal.color + ' ' + animal.type);
						})
						db.close(function() {
							console.log('db is closing');
						});
					});
				});
			});
		});
	});
});