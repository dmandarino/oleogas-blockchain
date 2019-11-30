pragma solidity ^0.5.0;

contract Property {
	
	//Model
	struct PropertyStruct {
		uint id;
		string name;
		uint value_paid;
		uint last_payment_month;
		uint last_payment_year;
		address last_payment_owner;
	}
	mapping(uint => PropertyStruct) public properties;

	uint public propertiesCount;

	constructor () public {
		addProperty("Imóvel 1");
		addProperty("Imóvel 2");
	}

	function addProperty (string memory _name) private {
		propertiesCount ++;
		properties[propertiesCount] = PropertyStruct(propertiesCount, _name, 0, 0, 0, address(0));
	}

	function payment (uint _propertyId, uint _amount, uint _month, uint _year) public {
		require(properties[_propertyId].last_payment_year <= _year);
		require(properties[_propertyId].last_payment_month < _month);

		require(_propertyId > 0 && _propertyId <= propertiesCount);

		properties[_propertyId].value_paid = _amount;
		properties[_propertyId].last_payment_owner = msg.sender;
		properties[_propertyId].last_payment_year = _year;
		properties[_propertyId].last_payment_month = _month;
	}
}