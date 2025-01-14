// SPDX-License-Identifier: MIT
pragma solidity >=0.8.4;

import "../UpgradeableAccessControl.sol";

// Used in UpgradeableAccessControl tests to check if `isSenderInRole` works through the `restrictedTo` modifier
contract UpgradeableAccessControlMock is UpgradeableAccessControl {
	uint32 public constant RESTRICTED_ROLE = 1;
	event Restricted();
	function restricted() public restrictedTo(RESTRICTED_ROLE) {
		emit Restricted();
	}
	function requireSenderInRole(uint256 required) public view {
		_requireSenderInRole(required);
	}
	function requireAccessCondition(bool condition) public pure {
		_requireAccessCondition(condition);
	}
}

contract UpgradeableAccessControl1 is UpgradeableAccessControlMock {
	string public version1;

	function postConstruct(address _owner, uint256 _features) public virtual initializer {
		postConstructNonInit(_owner, _features);
	}

	function postConstructNonInit(address _owner, uint256 _features) public virtual {
		_postConstruct(_owner, _features);
		version1 = "1";
	}
}

contract UpgradeableAccessControl2 is UpgradeableAccessControlMock {
	string public version2;

	function postConstruct(address _owner, uint256 _features) public virtual initializer {
		postConstructNonInit(_owner, _features);
	}

	function postConstructNonInit(address _owner, uint256 _features) public virtual {
		_postConstruct(_owner, _features);
		version2 = "2";
	}
}
