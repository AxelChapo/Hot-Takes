const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
	try {
		const token = req.headers.authorization.split(' ')[1];
		const decodedToken = jwt.verify(token, 'uANJ8j8Vzmz3wuWA7QqYLu1t-aN7qvM3sU7C39SlDIk');
		const userId = decodedToken.userId;
		if (req.body.userId && req.body.userId !== userId) {
			throw 'User ID non valable !';
		} else {
			next();
		}
	} catch (error) {
		res.status(401).json({error: error | 'Requête non authentifiée !'});
	}
};