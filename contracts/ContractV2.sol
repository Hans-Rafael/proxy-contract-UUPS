// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;
import "./ContractV1.sol";

contract ContractV2 is ContractV1 {
    // Evento para seguimiento de cambios en 'data'
    event DataUpdated(string oldData, string newData);
    uint public updateCount; // Contador de actualizaciones

    // contract logic v2
    // Función para actualizar data (practica override si anterior es virtual)
    function setData(string memory _data) public override {
        require(bytes(_data).length > 0, "Data cannot be empty");

        string memory oldData = getData(); //valor actual
        super.setData(_data); // llamada a la superclase o implementacion original para actualizar
        updateCount++; // Incrementar contador
        emit DataUpdated(oldData, _data); // emitr evento d actualizacion
    }

    // número de actualizaciones
    function getUpdateCount() public view returns (uint) {
        return updateCount;
    }

    //function suma
    function add(uint a, uint b) public pure returns (uint) {
        return a + b;
    }
}
