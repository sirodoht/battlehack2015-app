/**
 * RequestController
 *
 * @description :: Server-side logic for managing requests
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var Paypal = require('paypal-adaptive');

var paypalSdk = new Paypal({
  userId: 'random2309_api1.gmail.com',
  password: '4MC3BXMGG8AAGQYH',
  signature: 'AOj63B.t.bPLJd4KaomIXlYxGQkyAoWZooZ1k8kGH1dHKinEmntcPcjB',
  sandbox: true //defaults to false
});

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
	},
	pay: function(req, res) {
		Request.findOne(req.param("id")).exec(function(err, theRequest) {
			if (!theRequest) return res.send(false);
			if (!theRequest.responder_id) return res.send(false);
			if ((theRequest.paymentSuggested || 0) === 0) return res.send(false);

			// find user.id == theRequest.responder_id if not null
			User.findOne(theRequest.responder_id).exec(function(err, theUser) {
				var payload = {
			    requestEnvelope: {
		        errorLanguage:  'en_US'
			    },
			    actionType:     'PAY',
			    currencyCode:   'EUR',
			    feesPayer:      'EACHRECEIVER',
			    memo:           'LOCALHERO: '+theRequest.title,
			    cancelUrl:      'file:///android_asset/www/index.html#/login',
			    returnUrl:      'file:///android_asset/www/index.html#/login',
			    receiverList: {
		        receiver: [
	            // {
	            //     email:  'primary@test.com',
	            //     amount: '100.00',
	            //     primary:'true'
	            // },
	            {
                email:  theUser.email,
                amount: theRequest.paymentSuggested,
                primary:'false'
	            }
		        ]
			    }
				};

				paypalSdk.pay(payload, function (err, response) {
			    if (err) {
		        console.log(err);
			    } else {
		        // Response will have the original Paypal API response
		        console.log(response);
		        // But also a paymentApprovalUrl, so you can redirect the sender to checkout easily
		        console.log('Redirect to %s', response.paymentApprovalUrl);
						res.send(response.paymentApprovalUrl);
			    }
				});
			});
    });
	}
};
