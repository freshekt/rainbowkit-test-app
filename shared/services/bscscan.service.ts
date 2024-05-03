import { contract } from 'web3/lib/commonjs/eth.exports';
import axios from 'axios';
import Web3, { AbiItem, Contract, ContractAbi } from 'web3';
import { ContractModel } from '../models/contract.model';

const URL = 'https://api-testnet.bscscan.com/api';

/**
 * Retrieves the ABI (Application Binary Interface) for a given Ethereum contract address from the BSCScan API.
 *
 * @param address - The Ethereum contract address to retrieve the ABI for.
 * @returns A Promise that resolves to a `ContractModel` instance containing the contract ABI and a Web3 contract instance.
 */
export const getContractABI = (
  contractId: string,
  apiKey: string
): Promise<ContractModel> => {
  return axios
    .get<{ message: string; result: string; status: string }>(
      `${URL}?module=contract&action=getabi&address=${contractId}&apikey=${apiKey}`
    )
    .then((response) => {
      const data: ContractAbi = JSON.parse(response.data.result);
      const web3 = new Web3(
        new Web3.providers.HttpProvider(
          'https://data-seed-prebsc-1-s1.binance.org:8545'
        )
      );

      const contract: Contract<ContractAbi> = new web3.eth.Contract(
        data as ContractAbi,
        contractId
      );
      return new ContractModel(contract, web3);
    });
};
