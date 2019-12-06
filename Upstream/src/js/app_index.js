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
      App.contracts.Upstream = TruffleContract(upstream);
      App.contracts.Upstream.setProvider(App.web3Provider);

      return App.render();
    });
  },

  render: function() {  
    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        App.getInvestment();
        App.getExpenses();
        App.getEarnings();
      }
    });
  },

  getInvestment: function() {
    App.contracts.Upstream.deployed().then(function (instance) {
      return instance.totalAmount();
    }).then(function (total) {
      console.log(total + " investment");
      $("#totalInvestment").html("R$ " + total + ",00");
    });
  },

  getExpenses: function() {
    var arrayOfExpenses = [0, 0, 0];
    App.contracts.Upstream.deployed().then(function (instance) {
      return instance.getProductionSpent();
    }).then(function (total) {
      console.log(total + " production");
      arrayOfExpenses[0] = parseInt(total[0]) + parseInt(total[1]) + parseInt(total[2]);
      App.contracts.Upstream.deployed().then(function (instance) {
        return instance.getExplorationSpent();
      }).then(function (total) {
        console.log(total + " exploration");
        arrayOfExpenses[1] = parseInt(total[0]) + parseInt(total[1]);
         App.contracts.Upstream.deployed().then(function (instance) {
          return instance.getDevelopmentSpent();
        }).then(function (total) {
          console.log(total + " development");
          arrayOfExpenses[2] = parseInt(total[0]) + parseInt(total[1]);
          var ctx = document.getElementById('chartContainer').getContext('2d');
          var myChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Production', 'Exploration', 'Development'],
                datasets: [{
                    label: 'spent',
                    data: arrayOfExpenses,
                    backgroundColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {}
          });
          console.log(arrayOfExpenses);
          $("#totalExpenses").html("R$ " + parseInt(arrayOfExpenses[0] + arrayOfExpenses[1] + arrayOfExpenses[2]) + ",00");
        });
      });
    });
  },

  getEarnings: function() {
    App.contracts.Upstream.deployed().then(function (instance) {
      return instance.amount();
    }).then(function (total) {
      console.log(total);
      $("#totalEarning").html("R$ " + total + ",00");
    }); 
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
