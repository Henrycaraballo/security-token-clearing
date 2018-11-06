import { BigNumber } from "bignumber.js";
import { Address } from "../Types";

/**
 * An investor from the permissioned token's point of view
 */
export interface Investor {
  address: string;
  international: boolean;
  kyc: boolean;
}

/**
 * The investor type used by polymathjs
 */
export interface NativeInvestor {
  address: string;
  from?: Date;
  to?: Date;
  expiry?: Date;
  added?: Date;
  addedBy?: Address;
  canBuyFromSTO?: boolean;
  isPercentage?: boolean;
  minted?: BigNumber;
}

export interface TransferManager {
  getWhitelist(): Promise<Array<NativeInvestor>>;
}
