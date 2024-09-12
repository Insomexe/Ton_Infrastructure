import { getHttpEndpoint } from "@orbs-network/ton-access";
import { mnemonicToWalletKey } from "ton-crypto";
import { TonClient, WalletContractV4, Address } from "@ton/ton";
import Counter from "../wrappers/NOVACONTRACT"; // this is the interface class we just implemented

export async function run() {
  // initialize ton rpc client on testnet
  const endpoint = await getHttpEndpoint({ network: "mainnet" });
  const client = new TonClient({ endpoint });

  // open wallet v4 (notice the correct wallet version here)
  const mnemonic = "convince choose possible coil scare citizen guess about process aisle rather dice else slush blame dad attract attract month resist remove ecology furnace enhance"; // your 24 secret words 
  const key = await mnemonicToWalletKey(mnemonic.split(" "));
  const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });
  if (!await client.isContractDeployed(wallet.address)) {
    return console.log("wallet is not deployed");
  }

  // open wallet and read the current seqno of the wallet
  const walletContract = client.open(wallet);
  const walletSender = walletContract.sender(key.secretKey);
  const seqno = await walletContract.getSeqno();

  // open Counter instance by address
  const counterAddress = Address.parse("EQDZMPrJpT8iuQDePkBAB2DG1kW79J8Rw18ScCVD59GPCS9Z"); // replace with your address from step 8
  const counter = new Counter(counterAddress);
  const counterContract = client.open(counter);

  // send the increment transaction
  await counterContract.sendIncrement(walletSender);

  // wait until confirmed
  let currentSeqno = seqno;
  while (currentSeqno == seqno) {
    console.log("waiting for transaction to confirm...");
    await sleep(1500);
    currentSeqno = await walletContract.getSeqno();
  }
  console.log("transaction confirmed!");
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
