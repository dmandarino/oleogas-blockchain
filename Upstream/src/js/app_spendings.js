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
        $("#accountAddress").html("Endereço: " + account);
        App.getInfos();
      }
    });
  },

  getInfos: function() {
    var totalAmount;
    App.contracts.Upstream.deployed().then(function (instance) {
      return instance.totalAmount();
    }).then(function (total) {
      totalAmount = total;
      App.contracts.Upstream.deployed().then(function (instance) {
        return instance.getExplorationSpent();
      }).then(function (total) {
        var geologyPercentage = parseInt(total[0])/parseInt(totalAmount)*100;
        $('#geologyPercentage').html(geologyPercentage + "%");
        $('#progressGeology').css('width', geologyPercentage+'%').attr('aria-valuenow', geologyPercentage);
        var drillingPercentage = parseInt(total[1])/parseInt(totalAmount)*100;
        $('#drillingPercentage').html(drillingPercentage + "%");
        $('#progressDrilling').css('width', drillingPercentage+'%').attr('aria-valuenow', drillingPercentage);

        App.contracts.Upstream.deployed().then(function (instance) {
          return instance.getDevelopmentSpent();
        }).then(function (total) {
          var evaluationyPercentage = parseInt(total[0])/parseInt(totalAmount)*100;
          $('#evaluationPercentage').html(evaluationyPercentage + "%");
          $('#progressEvaluation').css('width', evaluationyPercentage+'%').attr('aria-valuenow', evaluationyPercentage);
          var engineeringPercentage = parseInt(total[1])/parseInt(totalAmount)*100;
          $('#engineeringPercentage').html(engineeringPercentage + "%");
          $('#progressEngineering').css('width', engineeringPercentage+'%').attr('aria-valuenow', engineeringPercentage);

           App.contracts.Upstream.deployed().then(function (instance) {
            return instance.getProductionSpent();
          }).then(function (total) {
            var mobilizationPercentage = parseInt(total[0])/parseInt(totalAmount)*100;
          $('#mobilizationPercentage').html(mobilizationPercentage + "%");
          $('#progressMobilization').css('width', mobilizationPercentage+'%').attr('aria-valuenow', mobilizationPercentage);
          var productionPercentage = parseInt(total[1])/parseInt(totalAmount)*100;
          $('#productionPercentage').html(productionPercentage + "%");
          $('#progressProduction').css('width', productionPercentage+'%').attr('aria-valuenow', productionPercentage);
          var monitoringPercentage = parseInt(total[2])/parseInt(totalAmount)*100;
          $('#monitoringPercentage').html(monitoringPercentage + "%");
          $('#progressMonitoring').css('width', monitoringPercentage+'%').attr('aria-valuenow', monitoringPercentage);
          });
        });
      });
    });

  },

  spendInExploration: function() {
    const value = $('#exploration').val();
    const selected = document.getElementById('explorationSelect');

    App.contracts.Upstream.deployed().then(function(instance) {
      const investmentInt = parseInt(value);
      const timeStamp = Date.now();

      if (selected.options[selected.selectedIndex].value == 'geology') {
        return instance.spendInExploration(investmentInt, 0, timeStamp, { from: App.account, gas:3000000 });
      } 
      return instance.spendInExploration(0, investmentInt, timeStamp, { from: App.account, gas:3000000 });
    }).then(function () {
      console.log('saved');
      window.location.reload();
    }).catch(function(err) {
      console.error(err);
    });
  },

  spendInDevelopment: function() {
    const value = $('#development').val();
    const selected = document.getElementById('developmentSelect');

    App.contracts.Upstream.deployed().then(function(instance) {
      const investmentInt = parseInt(value);
      const timeStamp = Date.now();
      if (selected.options[selected.selectedIndex].value == 'evaluation') {
        return instance.spendInDevelopment(investmentInt, 0, timeStamp, { from: App.account, gas:3000000 });
      } 
      return instance.spendInDevelopment(0, investmentInt, timeStamp, { from: App.account, gas:3000000 });
    }).then(function () {
      console.log('saved');
      window.location.reload();
    }).catch(function(err) {
      console.error(err);
    });
  },

  spendInProduction: function() {
    const value = $('#production').val();
    const selected = document.getElementById('productionSelect');

    App.contracts.Upstream.deployed().then(function(instance) {
      const investmentInt = parseInt(value);
      const timeStamp = Date.now();
      if (selected.options[selected.selectedIndex].value == 'mobilization') {
        return instance.spendInProduction(investmentInt, 0, 0, timeStamp, { from: App.account, gas:3000000 });
      } else if (selected.options[selected.selectedIndex].value == 'monitoring') {
        return instance.spendInProduction(0, 0, investmentInt, timeStamp, { from: App.account, gas:3000000 });
      } 
      return instance.spendInProduction(0, investmentInt, 0, timeStamp, { from: App.account, gas:3000000 });
    }).then(function () {
      console.log('saved');
      window.location.reload();
    }).catch(function(err) {
      console.error(err);
    });
  },

  addAmount: function() {
    const investment = $('#investment').val();

    var upstreamInstance;

    App.contracts.Upstream.deployed().then(function(instance) {
      upstreamInstance = instance;
      const investmentInt = parseInt(investment);
      return upstreamInstance.addAmount(investmentInt, { from: App.account });
    }).then(function () {
      console.log('saved');
      window.location.reload();
    }).catch(function(err) {
      console.error(err);
    });
  },
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});