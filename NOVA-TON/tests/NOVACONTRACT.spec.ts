import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { NOVACONTRACT } from '../wrappers/NOVACONTRACT';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('NOVACONTRACT', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('NOVACONTRACT');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let nOVACONTRACT: SandboxContract<NOVACONTRACT>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        nOVACONTRACT = blockchain.openContract(NOVACONTRACT.createFromConfig({}, code));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await nOVACONTRACT.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: nOVACONTRACT.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and nOVACONTRACT are ready to use
    });
});
