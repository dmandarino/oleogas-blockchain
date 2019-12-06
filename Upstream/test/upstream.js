var Upstream = artifacts.require("./Upstream.sol");

contract("Upstream", function(accounts) {
    // var UpstreamInstance;
    it("initializes with Investment", function () {
      return Upstream.deployed().then(function (instance) {
        instance.addAmount(20000000000);
        return instance.amount();
      }).then(function (amount) {
        assert.equal(amount.value, 20000000000);
      });
    });

    it("Spend in Exploration Geology", function () {
      return Upstream.deployed().then(function (instance) {
        // UpstreamInstance = instance;
        instance.spendInExploration(10000000000, 0);
        return instance.amount();
      }).then(function (amount) {
        assert.equal(amount.value, 10000000000);
      });
    });

    it("Spend in Exploration Drilling", function () {
      return Upstream.deployed().then(function (instance) {
        // UpstreamInstance = instance;
        instance.spendInExploration(0, 5000000000);
        return instance.amount();
      }).then(function (amount) {
        assert.equal(amount.value, 5000000000);
      });
    });

    it("Spend in Exploration Gelology and Drilling", function () {
      return Upstream.deployed().then(function (instance) {
        // UpstreamInstance = instance;
        instance.spendInExploration(1000000000, 1000000000);
        return instance.amount();
      }).then(function (amount) {
        assert.equal(amount.value, 3000000000);
      });
    });

    it("Spend more then Amount in Exploration", function () {
      return Upstream.deployed().then(function (instance) {
        // UpstreamInstance = instance;
        return instance.spendInExploration(1000000000000, 0);
      }).then(assert.fail).catch(function(error) {
        assert(error.message.indexOf('value grater than amount') >= 0, 'value grater than amount');
      });
    });

    it("Spend in Development Evaluation", function () {
      return Upstream.deployed().then(function (instance) {
        // UpstreamInstance = instance;
        instance.spendInDevelopment(1000000000, 0);
        return instance.amount();
      }).then(function (amount) {
        assert.equal(amount.value, 2000000000);
      });
    });

    it("Spend in Development Engineering", function () {
      return Upstream.deployed().then(function (instance) {
        // UpstreamInstance = instance;
        instance.spendInDevelopment(0, 1000000000);
        return instance.amount();
      }).then(function (amount) {
        assert.equal(amount.value, 1000000000);
      });
    });

    it("Spend in Development Evaluation and Engineering", function () {
      return Upstream.deployed().then(function (instance) {
        // UpstreamInstance = instance;
        instance.spendInDevelopment(100000000, 100000000);
        return instance.amount();
      }).then(function (amount) {
        assert.equal(amount.value, 800000000);
      });
    });

    it("Spend more then Amount in Development", function () {
      return Upstream.deployed().then(function (instance) {
        // UpstreamInstance = instance;
        return instance.spendInDevelopment(1000000000000, 0);
      }).then(assert.fail).catch(function(error) {
        assert(error.message.indexOf('value grater than amount') >= 0, 'value grater than amount');
      });
    });

    it("Spend in Production", function () {
      return Upstream.deployed().then(function (instance) {
        // UpstreamInstance = instance;
        instance.spendInProduction(100000000, 50000000, 50000000);
        return instance.amount();
      }).then(function (amount) {
        assert.equal(amount.value, 600000000);
      });
    });

    it("Spend more then Amount in Production", function () {
      return Upstream.deployed().then(function (instance) {
        // UpstreamInstance = instance;
        instance.spendInProduction(1000000000000, 0, 0);
      }).then(assert.fail).catch(function(error) {
        assert(error.message.indexOf('value grater than amount') >= 0, 'value grater than amount');
      });
    });
});