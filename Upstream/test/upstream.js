var Upstream = artifacts.require("./Upstream.sol");

contract("Upstream", function(accounts) {
    // var UpstreamInstance;

    it("Invest value", function () {
      return Upstream.deployed().then(function (instance) {
        // UpstreamInstance = instance;
        instance.addAmount(20000000000);
        return instance.amount();
      }).then(function (amount) {
        assert.equal(amount, 20000000000);
      });
    });

    it("Spend in Exploration Geology", function () {
      return Upstream.deployed().then(function (instance) {
        // UpstreamInstance = instance;
        instance.spendInExploration(10000000000, 0, Date.now());
        return instance.amount();
      }).then(function (amount) {
        assert.equal(amount, 10000000000);
      });
    });

    it("Spend in Exploration Drilling", function () {
      return Upstream.deployed().then(function (instance) {
        // UpstreamInstance = instance;
        instance.spendInExploration(0, 5000000000, Date.now());
        return instance.amount();
      }).then(function (amount) {
        assert.equal(amount, 5000000000);
      });
    });

    it("Spend in Exploration Gelology and Drilling", function () {
      return Upstream.deployed().then(function (instance) {
        // UpstreamInstance = instance;
        instance.spendInExploration(1000000000, 1000000000, Date.now());
        return instance.amount();
      }).then(function (amount) {
        assert.equal(amount, 3000000000);
      });
    });

    it("Spend more then Amount in Exploration", function () {
      return Upstream.deployed().then(function (instance) {
        // UpstreamInstance = instance;
        return instance.spendInExploration(1000000000000, 0, Date.now());
      }).then(assert.fail).catch(function(error) {
        assert(error.message.indexOf('value grater than amount') >= 0, 'value grater than amount');
      });
    });

    it("Check Exploration values", function () {
      return Upstream.deployed().then(function (instance) {
        // UpstreamInstance = instance;
        return instance.getExplorationSpent();
      }).then(function (exploration) {
        assert.equal(exploration[0], 11000000000);
        assert.equal(exploration[1], 6000000000);
      });
    });

    it("Spend in Development Evaluation", function () {
      return Upstream.deployed().then(function (instance) {
        // UpstreamInstance = instance;
        instance.spendInDevelopment(1000000000, 0, Date.now());
        return instance.amount();
      }).then(function (amount) {
        assert.equal(amount, 2000000000);
      });
    });

    it("Spend in Development Engineering", function () {
      return Upstream.deployed().then(function (instance) {
        // UpstreamInstance = instance;
        instance.spendInDevelopment(0, 1000000000, Date.now());
        return instance.amount();
      }).then(function (amount) {
        assert.equal(amount, 1000000000);
      });
    });

    it("Spend in Development Evaluation and Engineering", function () {
      return Upstream.deployed().then(function (instance) {
        // UpstreamInstance = instance;
        instance.spendInDevelopment(100000000, 100000000, Date.now());
        return instance.amount();
      }).then(function (amount) {
        assert.equal(amount, 800000000);
      });
    });

    it("Spend more then Amount in Development", function () {
      return Upstream.deployed().then(function (instance) {
        // UpstreamInstance = instance;
        return instance.spendInDevelopment(1000000000000, 0, Date.now());
      }).then(assert.fail).catch(function(error) {
        assert(error.message.indexOf('value grater than amount') >= 0, 'value grater than amount');
      });
    });

    it("Check Development values", function () {
      return Upstream.deployed().then(function (instance) {
        // UpstreamInstance = instance;
        return instance.getDevelopmentSpent();
      }).then(function (development) {
        assert.equal(development[0], 1100000000);
        assert.equal(development[1], 600000000);
      });
    });

    it("Spend in Production", function () {
      return Upstream.deployed().then(function (instance) {
        // UpstreamInstance = instance;
        instance.spendInProduction(100000000, 50000000, 50000000, Date.now());
        return instance.amount();
      }).then(function (amount) {
        assert.equal(amount, 600000000);
      });
    });

    it("Check Production values", function () {
      return Upstream.deployed().then(function (instance) {
        // UpstreamInstance = instance;
        return instance.getProductionSpent();
      }).then(function (production) {
        assert.equal(production[0], 100000000);
        assert.equal(production[1], 50000000);
        assert.equal(production[2], 50000000);
      });
    });

    it("Spend more then Amount in Production", function () {
      return Upstream.deployed().then(function (instance) {
        // UpstreamInstance = instance;
        instance.spendInProduction(1000000000000, 0, 0, Date.now());
      }).then(assert.fail).catch(function(error) {
        assert(error.message.indexOf('value grater than amount') >= 0, 'value grater than amount');
      });
    });
});