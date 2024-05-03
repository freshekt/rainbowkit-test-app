import { contract } from 'web3/lib/commonjs/eth.exports';
import axios from 'axios';
import Web3, { AbiItem, Contract, ContractAbi } from 'web3';
import { ContractModel } from '../models/contract.model';

const URL = 'https://api-testnet.bscscan.com/api';

const PROVIDER_URI = 'https://data-seed-prebsc-1-s1.binance.org:8545';

/**
 * Retrieves the contract ABI (Application Binary Interface) for the specified contract ID using the provided API key.
 *
 * @param contractId - The address of the Ethereum contract.
 * @param apiKey - The API key to use for the BSCScan API request.
 * @returns A Promise that resolves to the contract ABI.
 */
export const getContractABI = async (
  contractId: string,
  apiKey: string
): Promise<ContractAbi> => {
  const response = await axios.get<{
    message: string;
    result: string;
    status: string;
  }>(
    `${URL}?module=contract&action=getabi&address=${contractId}&apikey=${apiKey}`
  );
  const data: ContractAbi = JSON.parse(response.data.result);
  return data;
};

/**
 * Retrieves a contract model for the specified contract ID using the provided API key.
 *
 * @param contractId - The address of the Ethereum contract.
 * @param apiKey - The API key to use for the BSCScan API request.
 * @returns A Promise that resolves to a `ContractModel` instance, which encapsulates the contract and Web3 instance.
 */
export const getContractModel = async (
  contractId: string,
  apiKey: string
): Promise<ContractModel> => {
  return getContractABI(contractId, apiKey).then((abi) => {
    return convertABIToContract(abi, contractId);
  });
};

/**
 * Converts the provided contract ABI (Application Binary Interface) to a Web3 contract instance.
 *
 * @param data - The contract ABI data.
 * @param contractId - The address of the Ethereum contract.
 * @returns A `ContractModel` instance, which encapsulates the contract and Web3 instance.
 */
export const convertABIToContract = (data: ContractAbi, contractId: string) => {
  const web3 = new Web3(new Web3.providers.HttpProvider(PROVIDER_URI));

  const contract: Contract<ContractAbi> = new web3.eth.Contract(
    data as ContractAbi,
    contractId
  );
  return new ContractModel(contract, web3);
};
