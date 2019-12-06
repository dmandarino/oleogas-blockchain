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
        address last_investment_owner;
    }

    struct Development {
        uint code;
        uint evaluation;
        uint engineering;
        address last_investment_owner;
    }

    struct Production {
        uint code;
        uint mobilization;
        uint production;
        uint monitoring;
        address last_investment_owner;
    }
    // Read/write Upstream
    Amount public amount;
    mapping(uint => Exploration) public explorations;
    mapping(uint => Development) public developments;
    mapping(uint => Production) public productions;
    mapping(uint => uint) public codePosition;
    uint public spendCount;
    uint public investmentCount;

    constructor () public {}

	function addAmount (uint _amount) public {
		investmentCount ++;
		amount = Amount(_amount, address(0));
	}

    function spendInExploration ( uint _geology,
                                uint _drilling) public {
        spendCount ++;
        validateSpendInExploration(_geology, _drilling);
        explorations[spendCount] = Exploration(spendCount, _geology, _drilling, address(0));
        amount.value = amount.value - _geology - _drilling;
        emit createdEvent(spendCount);
    }

    function spendInDevelopment ( uint _evaluation,
                                uint _engineering) public {
        spendCount ++;
        validateSpendInDevelopment(_evaluation, _engineering);
        developments[spendCount] = Development(spendCount, _evaluation, _engineering, address(0));
        amount.value = amount.value - _evaluation - _engineering;
        emit createdEvent(spendCount);
    }

    function spendInProduction ( uint _mobilization,
                                uint _production,
                                uint _monitoring) public {
        spendCount ++;
        validateSpendInProduction(_mobilization, _production, _monitoring);
        productions[spendCount] = Production(spendCount, _mobilization, _production, _monitoring, address(0));
        amount.value = amount.value - _mobilization - _production - _monitoring;
        emit createdEvent(spendCount);
    }

    function validateSpendInExploration(uint _geology, uint _drilling) private {
        require(_geology >= 0 && _drilling >= 0 && _geology + _drilling <= amount.value, 'value grater than amount');
    }

    function validateSpendInDevelopment(uint _evaluation, uint _engineering) private {
        require(_evaluation >= 0 && _engineering >= 0 && _evaluation + _engineering <= amount.value, 'value grater than amount');
    }

    function validateSpendInProduction(uint _mobilization, uint _production, uint _monitoring) private {
        require(_mobilization >= 0 && _production >= 0 && _monitoring >= 0, 'negative values');
        require(_mobilization + _production + _monitoring <= amount.value, 'value grater than amount');
    }
}