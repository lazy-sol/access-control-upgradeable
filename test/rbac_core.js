// AccessControlUpgradeable (U-RBAC) Core Tests

// Zeppelin test helpers
const {
	BN,
	constants,
	expectEvent,
	expectRevert,
} = require("@lazy-sol/zeppelin-test-helpers");
const {
	assert,
	expect,
} = require("chai");
const {
	ZERO_ADDRESS,
	ZERO_BYTES32,
	MAX_UINT256,
} = constants;

// import the core RBAC behaviour to use
const {
	behavesLikeRBAC,
} = require("./include/rbac.behaviour");

// deployment routines in use
const {
	deploy_upgradeable_ac_impl,
	deploy_erc1967_upgradeable_ac,
} = require("./include/deployment_routines");

// RBAC proxy instance un-wrapper
async function deploy_access_control(a0, owner = a0, features = new BN(0)) {
	const {proxy} = await deploy_erc1967_upgradeable_ac(a0, owner, features);
	return proxy;
}

// RBAC proxy instance un-wrapper
async function deploy_access_control_v2(a0, owner = a0, features = new BN(0)) {
	const {proxy} = await deploy_erc1967_upgradeable_ac(a0, owner, features);
	if(owner !== ZERO_ADDRESS) {
		const v2 = await deploy_upgradeable_ac_impl(a0, 2);
		await proxy.upgradeTo(v2.address, {from: owner});
	}
	return proxy;
}

// run AccessControlUpgradeable (U-RBAC) tests
contract("AccessControlUpgradeable (U-RBAC) Core tests", function(accounts) {
	// extract accounts to be used:
	// A0 – special default zero account accounts[0] used by Truffle, reserved
	// a0 – deployment account having all the permissions, reserved
	// H0 – initial token holder account
	// a1, a2,... – working accounts to perform tests on
	const [A0, a0, H0, a1, a2, a3] = accounts;

	// run the core RBACs behaviour test
	behavesLikeRBAC(deploy_access_control, a0, a1, a2);
	behavesLikeRBAC(deploy_access_control_v2, a0, a1, a2);
});
