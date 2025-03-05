import { parseTransaction } from "@/libs/tx-parser";

export const useParseTx = () => {
  return {
    parseTransaction,
  };
};
