// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;
import "./ContractV1.sol";

contract ContractV2 is ContractV1 {
    // Evento para seguimiento de cambios en 'data'
    event DataUpdated(string oldData, string data);
    string public data;

    // contract logic v2
    // Función para actualizar data (practica override si anterior es virtual)
    function setData(string memory _data) public override {
    string memory oldData = data;
    data = _data;

    emit DataUpdated(oldData, _data);
}

function getNewData() public view returns (string memory) {
    return string(abi.encodePacked(data, " (updated in V2)"));
}
    //function suma
    function add(uint a, uint b) public pure returns (uint) {
        return a + b;
    }
}
