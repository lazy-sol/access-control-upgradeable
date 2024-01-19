// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "../UpgradeableAccessControl.sol";

// Used in UpgradeableAccessControl tests to check if `isSenderInRole` works through the `restrictedTo` modifier
contract UpgradeableAccessControlMock is UpgradeableAccessControl {
	uint32 public constant RESTRICTED_ROLE = 1;
	event Restricted();
	function restricted() public restrictedTo(RESTRICTED_ROLE) {
		emit Restricted();
	}
}

contract UpgradeableAccessControl1 is UpgradeableAccessControlMock {
	string public version1;

	function postConstruct() public virtual initializer {
		_postConstruct(msg.sender);
		version1 = "1";
	}
}

contract UpgradeableAccessControl2 is UpgradeableAccessControlMock {
	string public version2;

	function postConstruct() public virtual initializer {
		_postConstruct(msg.sender);
		version2 = "2";
	}
}
