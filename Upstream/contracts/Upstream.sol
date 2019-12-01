pragma solidity 0.5.8;
pragma experimental ABIEncoderV2;

contract Upstream {

    event createdEvent (
        uint indexed _code
    );

    struct Amount {
        uint value;
        address last_investment_owner;
    }

    struct Exploration {
        uint code;
        uint geology;
        uint drilling;
    }

    struct Development {
        uint code;
        uint evaluation;
        uint engineering;
    }

    struct Production {
        uint code;
        uint mobilization;
        uint production;
        uint monitoring;
    }
    // Read/write Upstream
    Amount public amount;
    mapping(uint => Exploration) public explorations;
    mapping(uint => Development) public developments;
    mapping(uint => Production) public productions;
    mapping(uint => uint) public codePosition;
    uint public spendCount;
    uint public investmentCount;

    constructor () public {
		addAmount(20000000000);
	}

	function addAmount (uint _amount) private {
		investmentCount ++;
		amount = Amount(_amount, address(0));
	}

    function spendInExploration ( uint _geology,
                                uint _drilling) public {
        spendCount ++;
        validateSpendInExploration(_geology, _drilling);
        explorations[spendCount] = Exploration(spendCount, _geology, _drilling);
        amount.value = amount.value - _geology - _drilling;
        emit createdEvent(spendCount);
    }

    function spendInDevelopment ( uint _evaluation,
                                uint _engineering) public {
        spendCount ++;
        validateSpendInDevelopment(_evaluation, _engineering);
        developments[spendCount] = Development(spendCount, _evaluation, _engineering);
        amount.value = amount.value - _evaluation - _engineering;
        emit createdEvent(spendCount);
    }

    function validateSpendInExploration(uint _geology, uint _drilling) private {
        require(_geology >= 0 && _drilling >= 0 && _geology + _drilling <= amount.value, 'value grater than amount');
    }

    function validateSpendInDevelopment(uint _evaluation, uint _engineering) private {
        require(_evaluation >= 0 && _engineering >= 0 && _evaluation + _engineering <= amount.value, 'value grater than amount');
    }

    // function getPersonKey(uint _code) public view returns(uint) {
    //     uint position = codePosition[_code];
    //     return position;
    // }

    // function validatePerson(Person memory person) private {
    //     require(people[person.code].code == 0, 'code must be unique');
    //     require(bytes(person.name).length > 0, 'name must not be empty');
    //     require(bytes(person.city).length > 0, 'city must not be empty');
    //     require(person.day > 0 && person.day < 31, 'wrong day');
    //     require(person.month > 0 && person.month < 13, 'wrong month');
    //     require(person.year > 0, 'year must not be empty');
    //     bytes memory gender = bytes(person.gender);
    //     require(keccak256(gender) == keccak256('M') || keccak256(gender) == keccak256('F'), 'gender must not be M or F');
    //     require(bytes(person.hour).length > 0, 'hour must not be empty');
    // }

    // function validateRelatives(Relatives memory relative) private {
    //     require(relativeList[relative.code].code == 0, 'code must be unique');
    //     require(bytes(relative.father).length > 0, 'father must not be empty');
    //     require(bytes(relative.mother).length > 0, 'mother must not be empty');
    //     require(bytes(relative.paternalGrandfather).length > 0, 'paternalGrandfather must not be empty');
    //     require(bytes(relative.paternalGrandmother).length > 0, 'paternalGrandmother must not be empty');
    //     require(bytes(relative.maternalGrandfather).length > 0, 'maternalGrandfather must not be empty');
    //     require(bytes(relative.maternalGrandmother).length > 0, 'maternalGrandmother must not be empty');
    //     // require(bytes(person.witness).length > 0, 'witness must not be empty');
    // }
}