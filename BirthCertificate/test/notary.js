var Notary = artifacts.require("./Notary.sol");

contract("Notary", function(accounts) {
  var notaryInstance;

  it("create a Person", function() {
    return Notary.deployed().then(function(instance) {
      notaryInstance = instance;
      notaryInstance.createPerson(99,
                                  'Bruce Wayne',
                                  'Gotham City',
                                  'State',
                                  'M',
                                  14,
                                  09,
                                  1991,
                                  '12:30',
                                  { from: accounts[1] });
      return notaryInstance.people(1);
    }).then(function(certificate) {
      assert.equal(certificate.code, 99, "Create a Crtificate");
      assert.equal(certificate.name, 'Bruce Wayne', "Create a Crtificate");
      assert.equal(certificate.city, 'Gotham City', "Create a Crtificate");
      assert.equal(certificate.gender, 'M', "Create a Crtificate");
      assert.equal(certificate.day, 14, "Create a Crtificate");
      assert.equal(certificate.month, 09, "Create a Crtificate");
      assert.equal(certificate.year, 1991, "Create a Crtificate");
    });
  });

  it("throws an exception for empty field", function() {
    return Notary.deployed().then(function(instance) {
      notaryInstance = instance;
      return notaryInstance.createPerson(99,
                                        '',
                                        'Gotham City',
                                        'State',
                                        'M',
                                        14,
                                        09,
                                        1991,
                                        '12:30',
                                        { from: accounts[1] });
    }).then(assert.fail).catch(function(error) {
      assert(error.message.indexOf('name must not be empty') >= 0, 'name must not be empty');
    });
  });

  it("throws an exception for invalid gender", function() {
    return Notary.deployed().then(function(instance) {
      notaryInstance = instance;
      return notaryInstance.createPerson(99,
                                        'Bruce Wayne',
                                        'Gotham City',
                                        'State',
                                        'T',
                                        14,
                                        09,
                                        1991,
                                        '12:30',
                                        { from: accounts[1] });
    }).then(assert.fail).catch(function(error) {
      assert(error.message.indexOf('gender must not be M or F') >= 0, 'gender must not be M or F');
    });
  });

  it("throws an exception for invalid day", function() {
    return Notary.deployed().then(function(instance) {
      notaryInstance = instance;
      return notaryInstance.createPerson(99,
                                        'Bruce Wayne',
                                        'Gotham City',
                                        'State',
                                        'M',
                                        0,
                                        09,
                                        1991,
                                        '12:30',
                                        { from: accounts[1] });
    }).then(assert.fail).catch(function(error) {
      assert(error.message.indexOf('wrong day') >= 0, 'wrong day');
    });
  });

  it("throws an exception for invalid month", function() {
    return Notary.deployed().then(function(instance) {
      notaryInstance = instance;
      return notaryInstance.createPerson(99,
                                        'Bruce Wayne',
                                        'Gotham City',
                                        'State',
                                        'M',
                                        03,
                                        14,
                                        1991,
                                        '12:30',
                                        { from: accounts[1] });
    }).then(assert.fail).catch(function(error) {
      assert(error.message.indexOf('wrong month') >= 0, 'wrong month');
    });
  });

  it("throws an exception for invalid year", function() {
    return Notary.deployed().then(function(instance) {
      notaryInstance = instance;
      return notaryInstance.createPerson(99,
                                        'Bruce Wayne',
                                        'Gotham City',
                                        'State',
                                        'M',
                                        3,
                                        09,
                                        0,
                                        '12:30',
                                        { from: accounts[1] });
    }).then(assert.fail).catch(function(error) {
      assert(error.message.indexOf('year must not be empty') >= 0, 'year must not be empty');
    });
  });

  it("create a Relatives", function() {
    return Notary.deployed().then(function(instance) {
      notaryInstance = instance;
      notaryInstance.createRelatives(99,
                                    'Thomas Wayne',
                                    'Martha Wayne',
                                    'Grandfather Wayne',
                                    'Grandmother Wayne',
                                    'Grandfather Mother',
                                    'Grandmother Mother',
                                    { from: accounts[1] });
      return notaryInstance.relativeList(1);
    }).then(function(certificate) {
      assert.equal(certificate.code, 99, "Create a Crtificate");
      assert.equal(certificate.father, 'Thomas Wayne', "Create a Crtificate");
      assert.equal(certificate.mother, 'Martha Wayne', "Create a Crtificate");
      assert.equal(certificate.paternalGrandfather, 'Grandfather Wayne', "Create a Crtificate");
      assert.equal(certificate.paternalGrandmother, 'Grandmother Wayne', "Create a Crtificate");
      assert.equal(certificate.maternalGrandfather, 'Grandfather Mother', "Create a Crtificate");
      assert.equal(certificate.maternalGrandmother, 'Grandmother Mother', "Create a Crtificate");
    });
  });

  it("search for certificate", function() {
    return Notary.deployed().then(function(instance) {
      notaryInstance.createPerson(12,
                                  'Bruce Wayne',
                                  'Gotham City',
                                  'State',
                                  'M',
                                  14,
                                  09,
                                  1991,
                                  '12:30',
                                  { from: accounts[1] });
      return notaryInstance;
    }).then(function(instance) {
      instance.getPersonKey(12).then(function(codeKey) {
        return instance.people(codeKey);
      }).then(function(certificate) {
        assert.equal(certificate[0], 12, "Search for a certificate");
        assert.equal(certificate[1], 'Bruce Wayne', "Search for a certificate");
      });
    });
  });

  it("search for wrong certificate", function() {
    return Notary.deployed().then(function(instance) {
      notaryInstance.createPerson(12,
                                  'Bruce Wayne',
                                  'Gotham City',
                                  'State',
                                  'M',
                                  14,
                                  09,
                                  1991,
                                  '12:30',
                                  { from: accounts[1] });
      return notaryInstance;
    }).then(function(instance) {
      instance.getPersonKey(10).then(function(codeKey) {
        return instance.people(codeKey);
      }).then(function(certificate) {
        assert.notEqual(certificate[0], 10, "Search for a certificate");
        assert.notEqual(certificate[1], 'Bruce Wayne', "Search for a certificate");
      });
    });
  });

  it("throws an exception for duplicated certification number", function() {
    return Notary.deployed().then(function(instance) {
      notaryInstance = instance;
      notaryInstance.createPerson(99,
                                  'Bruce Wayne',
                                  'Gotham City',
                                  'State',
                                  'M',
                                  14,
                                  09,
                                  1991,
                                  '12:30',
                                  { from: accounts[1] });
      return notaryInstance.people(99);
    }).then(function(certificate) {
      assert.equal(certificate.code, 99, "Create a Crtificate");
      notaryInstance.createPerson(99,
                                  'Bruce Wayne',
                                  'Gotham City',
                                  'State',
                                  'M',
                                  14,
                                  09,
                                  1991,
                                  '12:30',
                                  { from: accounts[1] });
    }).then(assert.fail).catch(function(error) {
      // assert(error.message.indexOf('revert') >= 0, 'code must be unique');
    });
  });
});