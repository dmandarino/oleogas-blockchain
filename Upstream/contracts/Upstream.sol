pragma solidity ^0.5.0;

contract Upstream {

    event createdEvent (
        uint indexed _code
    );

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
    uint public amount;
    mapping(uint => Exploration) public explorations;
    mapping(uint => Development) public developments;
    mapping(uint => Production) public productions;
    uint public explorationsCount;
    uint public developmentsCount;
    uint public productionsCount;

    constructor () public {
        addAmount(0);
    }

	function addAmount (uint _amount) public {
		amount = amount + _amount;
	}

    function spendInExploration ( uint _geology,
                                uint _drilling) public {
        explorationsCount ++;
        validateSpendInExploration(_geology, _drilling);
        explorations[explorationsCount] = Exploration(explorationsCount, _geology, _drilling, address(0));
        amount = amount - _geology - _drilling;
        emit createdEvent(explorationsCount);
    }

    function spendInDevelopment ( uint _evaluation,
                                uint _engineering) public {
        developmentsCount ++;
        validateSpendInDevelopment(_evaluation, _engineering);
        developments[developmentsCount] = Development(developmentsCount, _evaluation, _engineering, address(0));
        amount = amount - _evaluation - _engineering;
        emit createdEvent(developmentsCount);
    }

    function spendInProduction ( uint _mobilization,
                                uint _production,
                                uint _monitoring) public {
        productionsCount ++;
        validateSpendInProduction(_mobilization, _production, _monitoring);
        productions[productionsCount] = Production(productionsCount, _mobilization, _production, _monitoring, address(0));
        amount = amount - _mobilization - _production - _monitoring;
        emit createdEvent(productionsCount);
    }

    function getDevelopmentSpent() public view returns(uint, uint) {
        uint evaluation = 0;
        uint engineering = 0;
        for (uint i = 1; i <= developmentsCount; i++) {
            evaluation = evaluation + developments[i].evaluation;
            engineering = engineering + developments[i].engineering;
        }
        return (evaluation, engineering);
    }

    function getProductionSpent() public view returns(uint, uint, uint) {
        uint mobilization = 0;
        uint production = 0;
        uint monitoring = 0;
        for (uint i = 1; i <= productionsCount; i++) {
            mobilization = mobilization + productions[i].mobilization;
            production = production + productions[i].production;
            monitoring = monitoring + productions[i].monitoring;
        }
        return (mobilization, production, monitoring);
    }

    function getExplorationSpent() public view returns(uint, uint) {
        uint geology = 0;
        uint drilling = 0;
        for (uint i = 1; i <= explorationsCount; i++) {
            geology = geology + explorations[i].geology;
            drilling = drilling + explorations[i].drilling;
        }
        return (geology, drilling);
    }

    function validateSpendInExploration(uint _geology, uint _drilling) private {
        require(_geology >= 0 && _drilling >= 0 && _geology + _drilling <= amount, 'value grater than amount');
    }

    function validateSpendInDevelopment(uint _evaluation, uint _engineering) private {
        require(_evaluation >= 0 && _engineering >= 0 && _evaluation + _engineering <= amount, 'value grater than amount');
    }

    function validateSpendInProduction(uint _mobilization, uint _production, uint _monitoring) private {
        require(_mobilization >= 0 && _production >= 0 && _monitoring >= 0, 'negative values');
        require(_mobilization + _production + _monitoring <= amount, 'value grater than amount');
    }
}