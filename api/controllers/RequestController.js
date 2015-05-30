/**
 * RequestController
 *
 * @description :: Server-side logic for managing requests
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	ping: function(req, res) {
		// console.info(req.params);

		Request.findOne(req.param("id")).exec(function(err, theRequest) {

			// console.info(theRequest);

			var userIds = [];

			// Get all users
			// Loop users
			//  and find the ones that match
			//  loop ( abil as theRequest.abilities )
			//    loop ( users )
			//      if abil in users.abilities userIds.push(user.id)
			User.find().exec(function(err, allUsers) {
				// console.info(allUsers);
				// console.log(theRequest.abilities);
				for (var i = 0; i < theRequest.abilities.length; i++) {
					for (var j = 0; j < allUsers.length; j++) {
						var curUser = allUsers[j];
						for (var k = 0; k < curUser.abilities.length; k++) {
							var curAbility = curUser.abilities[k];
							if (theRequest.abilities[i] === curAbility) {
								console.info('Found common abilities!', theRequest.abilities[i], curAbility);
								userIds.push(curUser.id);
							}
						}
					}
				}

			});
    });
	}
};
