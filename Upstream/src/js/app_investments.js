App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("Upstream.json", function(upstream) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Upstream = TruffleContract(upstream);
      // Connect provider to interact with contract
      App.contracts.Upstream.setProvider(App.web3Provider);

      return App.render();
    });
  },

  render: function() {
    var loader = $("#loader");
    var content = $("#content");
  
    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Account Address: " + account);
        App.showAmount();
      }
    });
  },

  showAmount: function() {
    App.contracts.Upstream.deployed().then(function(instance) {
      return instance.amount();
    }).then(function (amount) {
      console.log(amount);
      $("#investedMoney").html("R$ " + amount.toString() + ",00");
    });
  },

  addAmount: function() {
    const investment = $('#investment').val();

    var upstreamInstance;

    App.contracts.Upstream.deployed().then(function(instance) {
      upstreamInstance = instance;
      const investmentInt = parseInt(investment);
      return upstreamInstance.addAmount(investmentInt, { from: App.account });
    }).then(function () {
      console.log('saved');
      window.location.reload();
    }).catch(function(err) {
      console.error(err);
    });
  },
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
