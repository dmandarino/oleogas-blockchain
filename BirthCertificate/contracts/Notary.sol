pragma solidity 0.5.8;
pragma experimental ABIEncoderV2;

contract Notary {

    event createdEvent (
        uint indexed _code
    );

    struct Person {
        uint code;
        string name;
        string city;
        string state;
        string gender;
        uint day;
        uint month;
        uint year;
        string hour;
    }

    struct Relatives {
        uint code;
        string father;
        string mother;
        string paternalGrandfather;
        string paternalGrandmother;
        string maternalGrandfather;
        string maternalGrandmother;
    }

    struct Extra {
        uint code;
        string witness;
    }
    // Read/write people
    mapping(uint => Person) public people;
    mapping(uint => Relatives) public relativeList;
    mapping(uint => Extra) public extras;
    mapping(uint => uint) public codePosition;
    uint public certificateCount;

    constructor() public {}

    function createPerson ( uint _code,
                            string memory _name,
                            string memory _city,
                            string memory _state,
                            string memory _gender,
                            uint _day,
                            uint _month,
                            uint _year,
                            string memory _hour) public {
        certificateCount ++;
        Person memory person;
        person.code = _code;
        person.name = _name;
        person.city = _city;
        person.state = _state;
        person.gender = _gender;
        person.day = _day;
        person.month = _month;
        person.year = _year;
        person.hour = _hour;
        
        validatePerson(person);

        people[certificateCount] = person;
        codePosition[_code] = certificateCount;

        emit createdEvent(_code);
    }

    function createRelatives ( uint _code,
                                string memory _father,
                                string memory _mother,
                                string memory _paternalGrandfather,
                                string memory _paternalGrandmother,
                                string memory _maternalGrandfather,
                                string memory _maternalGrandmother) public {
        Relatives memory relatives;
        relatives.code = _code;
        relatives.father = _father;
        relatives.mother = _mother;
        relatives.paternalGrandfather = _paternalGrandfather;
        relatives.paternalGrandmother = _paternalGrandmother;
        relatives.maternalGrandfather = _maternalGrandfather;
        relatives.maternalGrandmother = _maternalGrandmother;

        validateRelatives(relatives);

        relativeList[certificateCount] = relatives;

        emit createdEvent(_code);
    }

    function getPersonKey(uint _code) public view returns(uint) {
        uint position = codePosition[_code];
        return position;
    }

    function validatePerson(Person memory person) private {
        require(people[person.code].code == 0, 'code must be unique');
        require(bytes(person.name).length > 0, 'name must not be empty');
        require(bytes(person.city).length > 0, 'city must not be empty');
        require(person.day > 0 && person.day < 31, 'wrong day');
        require(person.month > 0 && person.month < 13, 'wrong month');
        require(person.year > 0, 'year must not be empty');
        bytes memory gender = bytes(person.gender);
        require(keccak256(gender) == keccak256('M') || keccak256(gender) == keccak256('F'), 'gender must not be M or F');
        require(bytes(person.hour).length > 0, 'hour must not be empty');
    }

    function validateRelatives(Relatives memory relative) private {
        require(relativeList[relative.code].code == 0, 'code must be unique');
        require(bytes(relative.father).length > 0, 'father must not be empty');
        require(bytes(relative.mother).length > 0, 'mother must not be empty');
        require(bytes(relative.paternalGrandfather).length > 0, 'paternalGrandfather must not be empty');
        require(bytes(relative.paternalGrandmother).length > 0, 'paternalGrandmother must not be empty');
        require(bytes(relative.maternalGrandfather).length > 0, 'maternalGrandfather must not be empty');
        require(bytes(relative.maternalGrandmother).length > 0, 'maternalGrandmother must not be empty');
        // require(bytes(person.witness).length > 0, 'witness must not be empty');
    }
}