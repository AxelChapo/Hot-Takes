const Sauce = require('../models/sauce');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
	const sauceObject = JSON.parse(req.body.sauce);
	delete sauceObject._id;
	const sauce = new Sauce({
		...sauceObject,
		imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
	});
	sauce.save()
		.then(() => res.status(201).json({message: 'Nouvelle sauce créée !'}))
		.catch(error => res.status(401).json({error}));
};

exports.modifySauce = (req, res, next) => {
	const sauceObject = req.file ?
	{
		...JSON.parse(req.body.sauce),
		imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
	} : {...req.body};
	Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
		.then(() => res.status(200).json({message: 'Sauce mis à jour !'}))
		.catch(error => res.status(400).json({error}));
};

exports.getAllSauces = (req, res, next) => {
	Sauce.find()
		.then(sauces => res.status(200).json(sauces))
		.catch(error => res.status(400).json({error}));
};

exports.getOneSauce = (req, res, next) => {
	Sauce.findOne({_id: req.params.id})
		.then(sauce => res.status(200).json(sauce))
		.catch(error => res.status(404).json({error}));
};

exports.deleteSauce = (req, res, next) => {
	Sauce.findOne({_id: req.params.id})
		.then(sauce => {
			const filename = sauce.imageUrl.split('/images')[1];
			fs.unlink(`images/${filename}`, () => {
				Sauce.deleteOne({_id: req.params.id})
					.then(() => res.status(200).json({message: 'Sauce supprimée !'}))
					.catch(error => res.status(400).json({error}));
			});
		})
		.catch(error => res.status(500).json({error}));
};

exports.likeSauce = (req, res, next) => {
	Sauce.findOne({_id: req.params.id})
		.then(sauce => {
			if(req.body.like == 1) {
				if(usersLiked.includes(req.body.userId, start)){
					sauce.likes = sauce.likes;
				}
				else {
					sauce.likes++;
					sauce.usersLiked.push(req.body.userId);
				}
				console.log(usersLiked)
			}
			if(req.body.like == 0) {
				sauce.likes--;
				const found = usersLiked.find(req.body.userId);

				if(usersLiked.includes(req.body.userId, start)){
					sauce.usersLiked.remove(req.body.userId);
				}
				else {
					sauce.usersDisliked.remove(req.body.userId);
				}
			}
			if(req.body.like == -1) {
				if(usersDisliked.includes(req.body.userId, start)){
					sauce.dislikes = sauce.dislikes;
				}
				else {
					sauce.dislikes++;
					sauce.usersDisliked.push(req.body.userId);
				}
			}
			Sauce.updateOne({_id: req.params.id}, sauce)
			.then(sauce => res.status(200).json({message: 'Sauce mis à jour'}))
		})
		.catch(error => res.status(500).json({error}));
};