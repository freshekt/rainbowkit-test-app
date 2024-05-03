import Web3, { Contract, ContractAbi } from 'web3';
import { ToastContainer, toast } from 'react-toastify';

export class ContractModel {
  constructor(private contract: Contract<ContractAbi>, private web3: Web3) {
    console.log(contract);
  }

  /**
   * Stakes a specified amount of tokens for the given address.
   *
   * @param amount - The amount of tokens to stake.
   * @param address - The address to stake the tokens for.
   * @returns A Promise that resolves when the staking transaction is complete.
   */
  stake(amount: number, address: string): Promise<any> {
    return this.contract.methods.stake(amount).send({
      from: address,
    });
  }

  /**
   * Unstakes tokens from the contract for the given address.
   *
   * @param address - The address to unstake tokens for.
   * @returns A Promise that resolves when the unstake transaction is complete.
   */
  unstake(address: string): Promise<any> {
    return this.contract.methods.unstake().send({
      from: address,
    });
  }

  /**
   * Retrieves the total amount of tokens staked in the contract.
   * @returns {Promise<number>} The total amount of tokens staked, in Ether.
   */
  async getStaked(): Promise<number> {
    try {
      const value = await this.contract.methods.totalStaked().call();
      return Number(this.web3.utils.fromWei(value as any, 'ether'));
    } catch (error) {
      toast.error((error as Error).message);
      console.error(error);
      return 0;
    }
  }

  /**
   * Calculates the reward for the given address.
   *
   * @param address - The address to calculate the reward for.
   * @returns The calculated reward amount in ether.
   */
  async calculateReward(address: string): Promise<number> {
    try {
      const value = await this.contract.methods.calculateReward(address).call();
      console.log({ calculateReward: value });
      return Number(this.web3.utils.fromWei(value as any, 'ether'));
    } catch (error) {
      toast.error((error as Error).message);
      console.error(error);
      return 0;
    }
  }

  /**
   * Retrieves the total amount of rewards that have been distributed.
   * @returns {Promise<number>} The total rewards distributed, in Ether.
   */
  async totalRewardsDistributed(): Promise<number> {
    console.log(this.contract);
    try {
      const value = await this.contract.methods
        .totalRewardsDistributed()
        .call();
      return Number(this.web3.utils.fromWei(value as any, 'ether'));
    } catch (error) {
      toast.error((error as Error).message);
      console.error(error);
      return 0;
    }
  }

  /**
   * Withdraws tokens from the contract to the specified address.
   *
   * @param address - The address to withdraw the tokens to.
   * @param amount - The amount of tokens to withdraw, in ether.
   * @returns A Promise that resolves when the withdrawal is complete.
   */
  async withdrawTokens(address: string, amount: number): Promise<void> {
    try {
      const value = await this.contract.methods
        .withdrawTokens(address, this.web3.utils.toWei(amount, 'ether'))
        .send({
          from: address,
        });
    } catch (error) {
      toast.error((error as Error).message);
      console.error(error);
    }
  }

  /**
   * Retrieves the address of the staking token contract.
   * @returns {Promise<string>} The address of the staking token contract.
   */
  async stakingToken(): Promise<string> {
    try {
      const value = await this.contract.methods.stakingToken().call<string>();
      return value;
    } catch (error) {
      toast.error((error as Error).message);
      console.error(error);
      return '';
    }
  }

  /**
   * Retrieves the total number of users who have staked tokens in the contract.
   * @returns {Promise<number>} The total number of users staked, or 0 if an error occurs.
   */
  async totalUsersStaked(): Promise<string> {
    try {
      const value = await this.contract.methods.totalUsersStaked().call();
      return this.web3.utils.fromWei(value as any, 'ether');
    } catch (error) {
      toast.error((error as Error).message);
      console.error(error);
      return '0';
    }
  }
}
