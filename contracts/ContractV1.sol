// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract ContractV1 is Initializable, UUPSUpgradeable, OwnableUpgradeable {
    string private data;
    event ContractUpgraded(address newImplementation);

    // Función inicializadora
    function initialize(string memory _data) public initializer {
        data = _data;
        __Ownable_init(msg.sender); // Establece el propietario(Owner) inicial como msg.sender
        __UUPSUpgradeable_init(); // Inicializa UUPS
    }

    // Función de actualización UUPS solo por propietario
    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyOwner {
        emit ContractUpgraded(newImplementation);
    }

    // Lógica del contrato
    function setData(string memory _data) public virtual {
        data = _data;
    }

    function getData() public view returns (string memory) {
        return data;
    }
}
