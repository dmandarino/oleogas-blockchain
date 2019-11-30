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
    $.getJSON("Notary.json", function(notary) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Notary2 = TruffleContract(notary);
      // Connect provider to interact with contract
      App.contracts.Notary2.setProvider(App.web3Provider);

      return App.render();
    });
  },

  render: function() {
    var loader = $("#loader");
    var content = $("#content");
  
    loader.show();
    content.hide();
  
    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Endereço do Cartório: " + account);
      }
    });
  },

  castVote: function() {
    var candidateId = $('#candidatesSelect').val();
    App.contracts.Election.deployed().then(function(instance) {
      return instance.vote(candidateId, { from: App.account });
    }).then(function(result) {
      // Wait for votes to update
      $("#content").hide();
      $("#loader").show();
    }).catch(function(err) {
      console.error(err);
    });
  },
  
  listenForEvents: function() {
    App.contracts.Notary.deployed().then(function(instance) {
      instance.votedEvent({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        console.log("event triggered", event)
        // Reload when a new vote is recorded
        App.render();
      });
    });
  },

  initContract: function() {
    $.getJSON("Notary.json", function(notary) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Notary = TruffleContract(notary);
      // Connect provider to interact with contract
      App.contracts.Notary.setProvider(App.web3Provider);

      return App.render();
    });
  },

  createCertificate: function() {
    const name = $('#name').val();
    const date = $('#date').val().split('/');
    const day = parseInt(date[0]);
    const month = parseInt(date[1]);
    const year = parseInt(date[2]);
    const city = $('#city').val();
    const uf = $('#uf').val();
    const hour = $('#hour').val();
    const gender = $('input[name="gender"]:checked').val();


    var notaryInstance;
    var newCertificateCode;

    App.contracts.Notary.deployed().then(function(instance) {
      notaryInstance = instance;
      return notaryInstance.certificateCount();
    }).then(function(count) {
      const codePosition = count.toString();
      return notaryInstance.people(codePosition);
    }).then(function(certificate) {
      const lastCode = certificate[0].toString();
      return parseInt(lastCode) + 1;
    }).then(function(newCode) {
      newCertificateCode = newCode;
        return notaryInstance.createPerson(newCertificateCode,
                                       name,
                                       city,
                                       uf,
                                       gender,
                                       day,
                                       month,
                                       year,
                                       hour,
                                       { from: App.account, gas:3000000 });
    }).then(function() {
      return App.createRelatives(newCertificateCode);
    }).then(function() {
      console.log('saved')
      alert('Salvo com sucesso! Matrícula:'+ newCertificateCode);
      window.location.reload();
    }).catch(function(err) {
      console.error(err);
    });
  },

  createRelatives: function(newCertificateCode) {
    const father = $('#father').val();
    const mother = $('#mother').val();
    const paternalGrandfather = $('#paternalGrandfather').val();
    const paternalGrandmother = $('#paternalGrandmother').val();
    const maternalGrandfather = $('#maternalGrandfather').val();
    const maternalGrandmother = $('#maternalGrandmother').val();

    var notaryInstance;

    App.contracts.Notary.deployed().then(function(instance) {
      notaryInstance = instance;
      return notaryInstance.createRelatives(newCertificateCode,
                                            father,
                                            mother,
                                            paternalGrandfather,
                                            paternalGrandmother,
                                            maternalGrandfather,
                                            maternalGrandmother,
                                           { from: App.account, gas:3000000 });
    }).then(function() {
      console.log('saved')
      alert('Salvo com sucesso! Matrícula:'+ newCertificateCode);
      window.location.reload();
    }).catch(function(err) {
      console.error(err);
    });
  },

  searchCertificate: function() {
    const search = $('#searchID').val();
    
    var notaryInstance;
    var codePosition;
    
    App.contracts.Notary.deployed().then(function(instance) {
      notaryInstance = instance;
      return notaryInstance.getPersonKey(search);
    }).then(function(codeKey) {
      codePosition = codeKey.toString();
      return notaryInstance.people(codePosition);
    }).then(function(person) {
      return App.showPersonValues(person[0], person[1], person[2], person[3], person[4], person[5], person[6], person[7]);
    }).then(function() {
      return notaryInstance.relativeList(codePosition);
    }).then(function(relatives) {
      return App.showRelativesValues(relatives[1], relatives[2], relatives[3], relatives[4], relatives[5], relatives[6], relatives[7]);
    }).catch(function(err) {
      console.error(err);
    });
  },

  showPersonValues: function(code, name, city, uf, gender, day, month, year) {
    if (code == 0) {
      $("#certificateCode").html("Nenhuma Certidão encontrada para matrícula: " + code);
    } else {
      $('input[type="text"], textarea').attr('readonly','readonly');
      $('#searchID').prop('readonly', false);
      $(':radio,:checkbox').click(function() {
        return false;
      });
      $("#certificateCode").html("Matrícula: " + code);
      $("#name").val(name);
      $("#city").val(city);
      $("#uf").val(uf);
      $("#date").val(day+'/'+month+'/'+year+'');
      var $radios = $('input:radio[name=gender]');
      if (gender === 'M') {
        $radios.filter('[value=M]').prop('checked', true);
      } else {
        $radios.filter('[value=F]').prop('checked', true);
      }
    }
  },

  showRelativesValues: function(father, mother, paternalGrandfather, 
                                paternalGrandmother, maternalGrandfather, maternalGrandmother) {
    $("#father").val(father);
    $("#mother").val(mother);
    $("#paternalGrandfather").val(paternalGrandfather);
    $("#paternalGrandmother").val(paternalGrandmother);
    $("#maternalGrandfather").val(maternalGrandfather);
    $("#maternalGrandmother").val(maternalGrandmother);
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
