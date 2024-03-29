/**
 * Deploys UpgradeableAccessControl
 *
 * @param a0 smart contract deployer
 * @param version version number to deploy, optional
 * @returns UpgradeableAccessControl instance
 */
async function deploy_upgradeable_ac_impl(a0, version = 1) {
	// smart contracts required
	const UpgradeableAccessControl = artifacts.require("UpgradeableAccessControl" + (version || ""));

	// deploy and return
	return await UpgradeableAccessControl.new({from: a0});
}

/**
 * Deploys UpgradeableAccessControl via ERC1967Proxy
 *
 * @param a0 smart contract deployer
 * @param owner smart contract owner, super admin, optional
 * @param features initial smart contract features, optional
 * @param version version number to deploy, optional
 * @returns ERC1967Proxy –> UpgradeableAccessControl instance
 */
async function deploy_erc1967_upgradeable_ac(a0, owner = a0, features = 0, version = 1) {
	// smart contracts required
	const UpgradeableAccessControl = artifacts.require("UpgradeableAccessControl" + (version || ""));
	const Proxy = artifacts.require("ERC1967Proxy");

	// deploy the impl
	const impl = await UpgradeableAccessControl.new({from: a0});

	// prepare the initialization call bytes
	const init_data = impl.contract.methods.postConstruct(owner, features).encodeABI();

	// deploy proxy, and initialize the impl (inline)
	const proxy = await Proxy.new(impl.address, init_data, {from: a0});

	// wrap the proxy into the impl ABI
	const ac = await UpgradeableAccessControl.at(proxy.address);
	ac.transactionHash = proxy.transactionHash;

	// return, proxy, and impl
	return {proxy: ac, implementation: impl};
}

// export public deployment API
module.exports = {
	deploy_upgradeable_ac_impl,
	deploy_erc1967_upgradeable_ac,
}
