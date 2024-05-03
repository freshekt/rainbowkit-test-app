import styles from '../styles/Home.module.css';
import logo from '../assets/img/logo.png';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { ContractModel } from '../shared/models/contract.model';
import { AuthenticationStatus } from '@rainbow-me/rainbowkit';
import { toast } from 'react-toastify';

type Props = {
  account?: {
    address: string;
    balanceDecimals?: number;
    balanceFormatted?: string;
    balanceSymbol?: string;
    displayBalance?: string;
    displayName: string;
    ensAvatar?: string;
    ensName?: string;
    hasPendingTransactions: boolean;
  };
  chain?: {
    hasIcon: boolean;
    iconUrl?: string;
    iconBackground?: string;
    id: number;
    name?: string;
    unsupported?: boolean;
  };
  mounted: boolean;
  authenticationStatus?: AuthenticationStatus;
  openAccountModal: () => void;
  openChainModal: () => void;
  openConnectModal: () => void;
  accountModalOpen: boolean;
  chainModalOpen: boolean;
  connectModalOpen: boolean;
  contract: ContractModel | undefined;
};

function Main({
  chain,
  account,
  openConnectModal,
  openAccountModal,
  openChainModal,
  mounted,
  contract,
}: Props) {
  const [amount, setAmount] = useState<number | undefined>();
  const [stacked, setStacked] = useState<number>(0);
  const [rewards, setRewards] = useState<number>(0);
  const [tvl, setTVL] = useState<string>('0');

  useEffect(() => {
    if (contract && account) {
      contract.getStaked().then((value) => {
        setStacked(value);
      });
      contract.calculateReward(account.address).then((value) => {
        setRewards(value);
      });

      contract.totalUsersStaked().then((value) => {
        console.log({ totalUsersStaked: value });
        setTVL(value);
      });

      contract.stakingToken().then((value) => {
        console.log({ stakingToken: value });
      });

      console.log(account);
    }
  }, [contract, account]);
  /**
   * Asynchronously stakes the specified amount on behalf of the provided Ethereum address.
   *
   * @param address - The Ethereum address to stake the amount from.
   * @returns A Promise that resolves when the staking transaction is complete.
   * @throws An error if the contract or address is not provided, or if the staking transaction fails.
   */
  const stakeHandler = async (address: string | undefined) => {
    try {
      if (!contract || !address || !amount) {
        return;
      }
      await contract.stake(amount, address);
    } catch (error: unknown) {
      toast.error((error as Error).message);
      console.error(error);
    }
  };

  /**
   * Unstakes the specified amount of tokens from the user's address.
   *
   * @param address - The address of the user to unstake from.
   * @returns A Promise that resolves when the unstaking operation is complete.
   * @throws An error if the contract, address, or amount is not defined, or if the unstaking operation fails.
   */
  const unstakeHandler = async (address: string | undefined) => {
    try {
      if (!contract || !address || !amount) {
        return;
      }

      await contract.unstake(address);
    } catch (error: unknown) {
      toast.error((error as Error).message);
      console.error(error);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <Image src={logo} alt="logo" width={168} height={99} />
        {chain?.hasIcon && chain?.iconUrl && (
          <div
            onClick={openChainModal}
            style={{
              background: chain?.iconBackground,
              width: 28,
              height: 28,
              borderRadius: 999,
              overflow: 'hidden',
              marginRight: 4,
              backgroundImage: `url(${chain?.iconUrl})`,
            }}
          ></div>
        )}
        {chain ? (
          <button
            onClick={openAccountModal}
            className={styles.primaryButton}
            type="button"
          >
            account
          </button>
        ) : (
          <button
            className={styles.primaryButton}
            onClick={openConnectModal}
            style={{ maxWidth: '200px' }}
            disabled={!mounted}
          >
            Connect Wallet
          </button>
        )}
      </div>
      <div className={styles.block}>
        <div className={styles.blockHeader}> Details</div>
        <div>
          Balance:{' '}
          {account?.displayBalance ||
            `0.00  ${account?.balanceSymbol || '$BSN'}`}{' '}
        </div>
        <div>
          Staked: {`${stacked.toFixed(2)} ${account?.balanceSymbol || '$BSN'}`}{' '}
        </div>
        <div>TVL: {`${tvl} ${account?.balanceSymbol || '$BSN'}`}</div>
        <input
          type="text"
          placeholder={`1000  ${account?.balanceSymbol || '$BSN'}`}
          disabled={!account}
          value={amount !== undefined ? amount.toFixed(2) : ''}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
        />
        <button
          className={styles.primaryButton}
          style={{ width: '100%' }}
          disabled={(!account && !amount) || amount === 0}
          onClick={() => stakeHandler(account?.address)}
        >
          Allow staking
        </button>
      </div>
      <div className={styles.block} style={{ height: '194px', flex: 0.65 }}>
        <div className={styles.blockHeader}>
          My Rewards <span>(</span>APR: 200<span>%)</span>
        </div>
        <div>
          {' '}
          {`${rewards.toFixed(2)} ${account?.balanceSymbol || '$BSN'}`}
        </div>
        <button
          className={styles.primaryButton}
          style={{ width: '100%' }}
          disabled={!account}
          onClick={() => unstakeHandler(account?.address)}
        >
          Withdraw All
        </button>
        <div className={styles.note}>
          Notice that withdrawing will send rewards AND staked tokens to your
          wallet.
        </div>
      </div>
    </main>
  );
}

export default Main;
