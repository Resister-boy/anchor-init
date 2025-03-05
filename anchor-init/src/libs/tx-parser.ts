import {
  checkIfInstructionParser,
  ParserType,
  SolanaFMParser,
} from "@solanafm/explorer-kit";
import { getProgramIdl, IdlItem } from "@solanafm/explorer-kit-idls";

export const parseTransaction = async (
  programId: string,
  instructionData: string,
  idl?: string
) => {
  try {
    const idlData: IdlItem | null = idl
      ? JSON.parse(idl)
      : await getProgramIdl(programId);

    if (idlData) {
      const parser = new SolanaFMParser(idlData, programId);
      const instructionParser = parser.createParser(ParserType.INSTRUCTION);
      if (instructionParser && checkIfInstructionParser(instructionParser)) {
        const decodedData =
          instructionParser.parseInstructions(instructionData);

        return decodedData;
      }
    }
    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};
