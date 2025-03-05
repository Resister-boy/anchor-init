"use client";
import React, { ReactNode, useMemo, useState } from "react";
import { ChatContext } from "@/context/chat/ChatContext";
import {
  ChatStatusType,
  ChatTokenMetadataShape,
} from "@/shared/types/data/chat";

type Props = {
  children: ReactNode;
};

const ChatProvider = ({ children }: Props) => {
  const [input, setInput] = useState<string>("");
  const [status, setStatus] = useState<ChatStatusType>(ChatStatusType.init);
  const [strategy, setStrategy] = useState<string>("");
  const [metadata, setMetadata] = useState<ChatTokenMetadataShape | null>(null);
  const [token, setToken] = useState<string>("");

  const contextValue = useMemo(() => {
    return {
      input,
      setInput,
      status,
      setStatus,
      strategy,
      setStrategy,
      metadata,
      setMetadata,
      token,
      setToken,
    };
  }, [input, status, strategy, metadata, token]);
  return (
    <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>
  );
};

export default ChatProvider;
