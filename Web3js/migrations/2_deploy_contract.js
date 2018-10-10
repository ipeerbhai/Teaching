var CandidateManagerContract = artifacts.require("CandidateManager");

module.exports = function(deployer) {
    deployer.deploy(CandidateManagerContract);
}