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
        App.getTimeline();
      }
    });
  },

  getInvestment: function() {
    App.contracts.Upstream.deployed().then(function (instance) {
      return instance.totalAmount();
    }).then(function (total) {
      $("#totalInvestment").html("R$ " + total + ",00");
    });
  },

  getExpenses: function() {
    var arrayOfExpenses = [0, 0, 0];
    App.contracts.Upstream.deployed().then(function (instance) {
      return instance.getExplorationSpent();
    }).then(function (total) {
      arrayOfExpenses[0] = parseInt(total[0]) + parseInt(total[1]);
      App.contracts.Upstream.deployed().then(function (instance) {
        return instance.getDevelopmentSpent();
      }).then(function (total) {
        arrayOfExpenses[1] = parseInt(total[0]) + parseInt(total[1]);
         App.contracts.Upstream.deployed().then(function (instance) {
          return instance.getProductionSpent();
        }).then(function (total) {
          arrayOfExpenses[2] = parseInt(total[0]) + parseInt(total[1]) + parseInt(total[2]);
          var ctx = document.getElementById('chartContainer').getContext('2d');
          var myChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Exploration', 'Development', 'Production'],
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
          $("#totalExpenses").html("R$ " + parseInt(arrayOfExpenses[0] + arrayOfExpenses[1] + arrayOfExpenses[2]) + ",00");
        });
      });
    });
  },

  getEarnings: function() {
    App.contracts.Upstream.deployed().then(function (instance) {
      return instance.amount();
    }).then(function (total) {
      $("#totalEarning").html("R$ " + total + ",00");
    }); 
  },

  getExploration: async function(count) {
    var exploration = [];
    let promise = new Promise ((res, rej) => {
      for(var i = 1; i < count; i++) {
        upstreamInstance.explorations(i).then(function (data) {
          console.log('inside async');
          var timeStamp = data[3];
          var amount = parseInt(data[1].c[0]) + parseInt(data[2].c[0]);
          exploration.push({x: new Date(timeStamp.c[0]), y: amount});          
        });
        console.log('out async');
      }
      console.log('out for');
      console.log('out promise');
    });
    console.log('awaiting');
    let result = await promise;
    console.log(result + "aa");

    return exploration;
  },

  getDevelopment: async function(count) {
    var development = [];
    for(var i = 1; i < count; i++) {
      upstreamInstance.developments(i).then(function (data) {
        var timeStamp = data[3];
        var amount = parseInt(data[1].c[0]) + parseInt(data[2].c[0]);
        development.push({x: new Date(timeStamp.c[0]), y: amount});          
      });
    }
    return development;
  },

  getProduction: async function(count) {
    var production = [];
    for(var i = 1; i < count; i++) {
      upstreamInstance.productions(i).then(function (data) {
        var timeStamp = data[4];
        var amount = parseInt(data[1].c[0]) + parseInt(data[2].c[0]) + parseInt(data[3].c[0]);
        production.push({x: new Date(timeStamp.c[0]), y: amount});          
      });
    }
    return production;
  },

  getTimeline: function() {
    var arrayCount = [];

    var exploration = [];
    var development = [];
    var production = [];
    var dates = [];

    App.contracts.Upstream.deployed().then(function (instance) {
      upstreamInstance = instance;
      return upstreamInstance.explorationsCount();
    }).then(function (count) {
      arrayCount.push(count.c[0]);
      return upstreamInstance.developmentsCount();
    }).then(function (count) {
      arrayCount.push(count.c[0]);
      return upstreamInstance.productionsCount();
    }).then(function (count) {
      arrayCount.push(count.c[0]);
      console.log(arrayCount);

      App.getExploration(arrayCount[0]).then(function (result) {
        exploration = result;
        console.log(result.length);
        for (i = 0; i < exploration.length; i++) {
          console.log(exploration[i].x);
        }

        App.getDevelopment(arrayCount[1]).then(function (result) {
          development = result;

          App.getProduction(arrayCount[2]).then(function (result) {
            production = result;

            console.log(dates);

            var ctx = document.getElementById('chartTimelineContainer').getContext('2d');
            var myChart = new Chart(ctx, {
              type: 'line',
              data: {
                labels: dates,
                datasets: [
                {
                  label: 'Exploration',
                  borderColor: '#FF6384',
                  backgroundColor: '#FF6384',
                  spanGaps: true,
                  fill: false,
                  data: exploration
                },
                {
                  label: 'Development',
                  borderColor: '#36A2EB',
                  backgroundColor: '#36A2EB',
                  spanGaps: true,
                  fill: false,
                  data: development
                },
                {
                  label: 'Production',
                  borderColor: '#FFCE56',
                  backgroundColor: '#FFCE56',
                  spanGaps: true,
                  fill: false,
                  data: production
                }
                ],
              },
              options: {
                responsive: true,
                title: {
                  display: false,
                },
                scales: {
                  xAxes: [{
                    type: 'time',
                    display: true,
                    scaleLabel: {
                      display: true,
                      labelString: 'Date'
                    },
                    ticks: {
                      major: {
                        fontStyle: 'bold',
                        fontColor: '#FF0000'
                      }
                    }
                  }],
                  yAxes: [{
                    display: true,
                    scaleLabel: {
                      display: true,
                      labelString: 'value'
                    }
                  }]
                }
              }
            });
          });
        });
      });
    });
  }
}
$(function() {
  $(window).load(function() {
    App.init();
  });
});
