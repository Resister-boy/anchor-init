import {
  ChatStatusType,
  ChatTokenMetadataShape,
} from "@/shared/types/data/chat";
import {
  Context,
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
} from "react";

export type ChatContextShape = {
  input: string;
  setInput: Dispatch<SetStateAction<string>>;
  status: ChatStatusType;
  setStatus: Dispatch<SetStateAction<ChatStatusType>>;
  strategy: string;
  setStrategy: Dispatch<SetStateAction<string>>;
  metadata: ChatTokenMetadataShape | null;
  setMetadata: Dispatch<SetStateAction<ChatTokenMetadataShape | null>>;
  token: string;
  setToken: Dispatch<SetStateAction<string>>;
};

const defaultValue: ChatContextShape = {
  input: "",
  setInput: () => {},
  status: ChatStatusType.init,
  setStatus: () => {},
  strategy: "",
  setStrategy: () => {},
  metadata: null,
  setMetadata: () => {},
  token: "",
  setToken: () => {},
};

export const ChatContext: Context<ChatContextShape> =
  createContext<ChatContextShape>(defaultValue);

export const useChatContext = () => {
  return useContext(ChatContext);
};
