App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',

  init: function() {
    return App.initWeb3();
  },

  initWeb3: async function() {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("Upstream.json", function(upstream) {
      App.contracts.Upstream = TruffleContract(upstream);
      App.contracts.Upstream.setProvider(App.web3Provider);
      return App.render();
    });
  },

  render: function() {
    var loader = $("#loader");
    var content = $("#content");
  
    loader.show();
    content.hide();

  web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Endereço: " + account);
      }
    });

    App.showAmount();
  },

  showAmount: function() {
    App.contracts.Upstream.deployed().then(function(instance) {
      return instance.amount();
    }).then(function (amount) {
      $("#amountValue").html("Montante disponível : R$ " + parseFloat(amount[0]).toLocaleString('pt-BR'));
    });
  },

  addAmount: function() {
    const investment = $('#investment').val();
    console.log(investment);
    App.contracts.Upstream.deployed().then(function(instance) {
      return instance.addAmount(investment, {from: App.account});
    }).then(function () {
      console.log('saved');
      window.location.reload();
    }).catch(function(err) {
      console.error(err);
    });
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
