App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',

  init: function () {
    return App.initWeb3();
  } ,

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
    $.getJSON("Property.json", function (property) {
      App.contracts.Property = TruffleContract(property);
      App.contracts.Property.setProvider(App.web3Provider);
      return App.render();
    });
  },

  render: function() {
    var propertyInstance;
    var loader = $("#loader");
    var content = $("#content");

    loader.show();
    content.hide();

    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });

    // Load contract data
    App.contracts.Property.deployed().then(function(instance) {
      propertyInstance = instance;
      return propertyInstance.propertiesCount();
    }).then(function(propertiesCount) {
      var property_last_payment = $("#propertiesPayments");
      property_last_payment.empty();

      var propertySelect = $('#propertySelect');
      propertySelect.empty();

      for (var i = 1; i <= propertiesCount; i++) {
        propertyInstance.properties(i).then(function(property) {
          var id = property[0];
          var name = property[1];
          var value = property[2];
          var month = property[3];
          var year = property[4];
          var address = property[5];

          var propertyTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + value + "</td><td>" + month + "/" + year + "</td><td>" + address +"</td></tr>";
          property_last_payment.append(propertyTemplate);

          var propertyOption = "<option value='" + id + "'> " + name + "</option>";
          propertySelect.append(propertyOption);
        });
      }
      loader.hide();
      content.show();
    }).catch(function(error) {
      console.warn(error);
    });
  },

  sendValue: function () {
    var property_id = $('#propertySelect').val();
    var payment_amout = $('#propertyValue').val();
    var date = new Date();
    var payment_month = date.getMonth() + 1;
    var payment_year = date.getFullYear();
        App.contracts.Property.deployed().then(function (instance) {
      return instance.payment(property_id, payment_amout, payment_month, payment_year, { from: App.account });
    }).then(function(result) {
      $("#loader").text("Pagamento computado");
      $("#content").hide();
      $("#loader").show();
    }).catch(function (err) {
      console.log(err);
    });
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
