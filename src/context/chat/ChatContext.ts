import {
  ChatJsonShape,
  ChatProgressType,
  ChatShape,
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
  status: ChatProgressType;
  setStatus: Dispatch<SetStateAction<ChatProgressType>>;
  strategy: string;
  setStrategy: Dispatch<SetStateAction<string>>;
  metadata: ChatTokenMetadataShape | null;
  setMetadata: Dispatch<SetStateAction<ChatTokenMetadataShape | null>>;
  token: string;
  setToken: Dispatch<SetStateAction<string>>;
  commonConversations: ChatShape[];
  setCommonConversations: Dispatch<SetStateAction<ChatShape[]>>;
  fundConversations: ChatJsonShape[];
  setFundConversations: Dispatch<SetStateAction<ChatJsonShape[]>>;
  recent: ChatShape | null;
  setRecent: Dispatch<SetStateAction<ChatShape | null>>;
  fundRecent: ChatJsonShape | null;
  setFundRecent: Dispatch<SetStateAction<ChatJsonShape | null>>;
};

const defaultValue: ChatContextShape = {
  input: "",
  setInput: () => {},
  status: ChatProgressType.common,
  setStatus: () => {},
  strategy: "",
  setStrategy: () => {},
  metadata: null,
  setMetadata: () => {},
  token: "",
  setToken: () => {},
  commonConversations: [],
  setCommonConversations: () => {},
  fundConversations: [],
  setFundConversations: () => {},
  recent: null,
  setRecent: () => {},
  fundRecent: null,
  setFundRecent: () => {},
};

export const ChatContext: Context<ChatContextShape> =
  createContext<ChatContextShape>(defaultValue);

export const useChatContext = () => {
  return useContext(ChatContext);
};
