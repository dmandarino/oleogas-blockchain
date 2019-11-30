var Property = arfifacts.require("./Property.sol");

contract("Property", function(accounts) {
	it("initializes with two candidates", function () {
		return Property.deployed().then(function (instance) {
			return instance.candidatesCount();
		}).then(function (count) {
			assert.equal(count, 2);
		});
	});
}); 