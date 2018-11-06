import * as moment from "moment";

import { Address } from "../Types";

import * as PMT from "./Types";

export const getInvestorFromWhitelist = async (
  transferManager: PMT.TransferManager,
  address: Address
): Promise<PMT.NativeInvestor | null> => {
  const whitelist = await transferManager.getWhitelist();
  const results = whitelist.filter(investor => investor.address === address);
  return results.length == 0 ? null : results[0];
};

export const buildInvestor = (
  investor: PMT.Investor,
  whitelistedInvestor: PMT.NativeInvestor | null
): PMT.NativeInvestor | null => {
  let pmInvestor: PMT.NativeInvestor;

  if (investor.international && investor.kyc) {
    if (whitelistedInvestor) {
      if (moment().diff(whitelistedInvestor.expiry, "days") < 0) {
        // International, kyc and already on the whitelist with expiration in the future
        return null;
      }
      // Expiration is in the past.  Freshen.
      pmInvestor = {
        address: whitelistedInvestor.address,
        from: whitelistedInvestor.from,
        to: whitelistedInvestor.to,
        expiry: moment()
          .add(3, "months")
          .toDate()
      };
    } else {
      // Investor is not on the whitelist, but should be
      // TODO see what happens when we omit from and to
      pmInvestor = {
        address: investor.address,
        from: moment()
          .add(1, "years")
          .toDate(),
        to: new Date(),
        expiry: moment()
          .add(3, "months")
          .toDate()
      };
    }
  } else {
    if (whitelistedInvestor) {
      // No KYC or interational status.  Remove the user.
      pmInvestor = {
        address: investor.address,
        from: moment()
          .subtract(1, "years")
          .toDate(),
        to: moment()
          .subtract(1, "years")
          .toDate(),
        expiry: moment()
          .subtract(1, "years")
          .toDate()
      };
    } else {
      // Not on whitelist and shouldn't be.  No change.
      return null;
    }
  }

  return pmInvestor;
};
