import { getHttpEndpoint } from "@orbs-network/ton-access";
import { TonClient, Address } from "@ton/ton";
import Counter from "../wrappers/NOVACONTRACT"; // this is the interface class we just implemented

export async function run() {
  // initialize ton rpc client on testnet
  const endpoint = await getHttpEndpoint({ network: "mainnet" });
  const client = new TonClient({ endpoint });

  // open Counter instance by address
  const counterAddress = Address.parse("EQDZMPrJpT8iuQDePkBAB2DG1kW79J8Rw18ScCVD59GPCS9Z"); // replace with your address from step 8
  const counter = new Counter(counterAddress);
  const counterContract = client.open(counter);

  // call the getter on chain
  const counterValue = await counterContract.getCounter();
  console.log("value:", counterValue.toString());
}
