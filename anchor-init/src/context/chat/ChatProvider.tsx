"use client";
import React, { ReactNode, useEffect, useMemo, useState } from "react";
import { ChatContext } from "@/context/chat/ChatContext";
import {
  ChatJsonShape,
  ChatProgressType,
  ChatShape,
  ChatTokenMetadataShape,
} from "@/shared/types/data/chat";
import { ChatOpenAI } from "@langchain/openai";
import {
  AIMessage,
  HumanMessage,
  SystemMessage,
} from "@langchain/core/messages";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { FUNDRAISE_PROMPT, STRATEGY_PROMPT } from "@/shared/constant/prompt";

type Props = {
  children: ReactNode;
};

const ChatProvider = ({ children }: Props) => {
  const apiKey = `${process.env.OPENAI_API_KEY}`;
  let content = "";
  const [input, setInput] = useState<string>("");
  const [status, setStatus] = useState<ChatProgressType>(
    ChatProgressType.common
  );
  const [strategy, setStrategy] = useState<string>("");
  const [metadata, setMetadata] = useState<ChatTokenMetadataShape | null>(null);
  const [token, setToken] = useState<string>("");
  const [commonConversations, setCommonConversations] = useState<ChatShape[]>(
    []
  );
  const [fundConversations, setFundConversations] = useState<ChatJsonShape[]>(
    []
  );
  const [recent, setRecent] = useState<ChatShape | ChatJsonShape | null>(null);
  const [fundRecent, setFundRecent] = useState<ChatJsonShape | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const model = new ChatOpenAI({
    apiKey,
    temperature: 0,
  });

  useEffect(() => {
    const messages = fundConversations.map((conversation) => {
      if (conversation.type === "agent") {
        return new AIMessage(conversation.json);
      } else {
        return new HumanMessage(conversation.value);
      }
    });
    const getAIResponse = async (userPrompt: string) => {
      const prompt =
        status === ChatProgressType.fundraise
          ? ChatPromptTemplate.fromMessages([
              new SystemMessage(FUNDRAISE_PROMPT),
              ...messages,
              new HumanMessage(userPrompt),
            ])
          : ChatPromptTemplate.fromMessages([
              new SystemMessage(STRATEGY_PROMPT),
              new HumanMessage(userPrompt),
            ]);

      const chain = prompt.pipe(model);
      const stream = await chain.stream({});

      if (status === ChatProgressType.fundraise) {
        fundRecent && setFundConversations((prev) => [...prev, fundRecent]);
        setFundRecent(null);
      } else {
        recent && setCommonConversations((prev) => [...prev, recent]);
        setRecent(null);
      }

      for await (const chunk of stream) {
        content += chunk?.content;
        if (status === ChatProgressType.fundraise) {
          setFundRecent({
            value: content,
            json: content,
            timestamp: new Date().toISOString(),
            type: "agent",
            progress: ChatProgressType.fundraise,
          });
        } else {
          setRecent({
            value: content,
            timestamp: new Date().toISOString(),
            type: "agent",
            progress: ChatProgressType.common,
          });
        }
      }

      const response = JSON.parse(content);
      console.log(response);

      if (status === ChatProgressType.fundraise) {
        setFundRecent({
          value: response.response,
          json: content,
          timestamp: new Date().toISOString(),
          type: "agent",
          progress:
            response.flag === "METADATA_COMPLETE"
              ? ChatProgressType.done
              : ChatProgressType.fundraise,
        });
      } else {
        setRecent({
          value: response.response,
          timestamp: new Date().toISOString(),
          type: "agent",
          progress:
            response.flag === "STRATEGY_VALID"
              ? ChatProgressType.confirm
              : ChatProgressType.common,
        });
      }

      if (status !== ChatProgressType.fundraise) {
        if (response.flag === "STRATEGY_VALID") {
          setStatus(ChatProgressType.confirm);
          setStrategy(userPrompt);
        }
      } else {
        if (response.flag === "METADATA_COMPLETE") {
          setStatus(ChatProgressType.done);
          setMetadata({ ...response.data, description: strategy });
        }
      }
      setLoading(false);
    };

    if (recent && recent.type === "user") {
      content = "";
      if (!loading) {
        getAIResponse(recent.value);
        setLoading(true);
      }
    } else if (fundRecent && fundRecent.type === "user") {
      content = "";
      if (!loading) {
        getAIResponse(fundRecent.value);
        setLoading(true);
      }
    }
  }, [
    commonConversations,
    recent,
    content,
    loading,
    fundRecent,
    fundConversations,
  ]);

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
      commonConversations,
      setCommonConversations,
      fundConversations,
      setFundConversations,
      recent,
      setRecent,
      fundRecent,
      setFundRecent,
    };
  }, [
    input,
    status,
    strategy,
    metadata,
    token,
    commonConversations,
    fundConversations,
    recent,
    fundRecent,
  ]);
  return (
    <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>
  );
};

export default ChatProvider;
