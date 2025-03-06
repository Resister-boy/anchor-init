import { useChatContext } from "@/context/chat/ChatContext";
import { ChatProgressType, ChatShape } from "@/shared/types/data/chat";
import React, { useMemo } from "react";

type Props = ChatShape & {
  handler?: () => void;
};

const CommonChat = ({ value, timestamp, type, progress, handler }: Props) => {
  const { setStatus, recent, setCommonConversations, setRecent, status } =
    useChatContext();
  const isAgent = useMemo(() => type === "agent", [type]);
  return (
    <div className="mx-4 p-2">
      {isAgent ? (
        <div className="mb-1 w-full flex flex-col justify-start">
          <div className="flex items-start justify-start w-4/5">
            <div className="bg-yellow-300 text-black rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0">
              <span>{"A"}</span>
            </div>
            <div style={{ marginTop: 2 }}>
              <p className="text-sm">{value}</p>
            </div>
          </div>
          {progress === ChatProgressType.confirm && (
            <div className="flex mt-4 ml-8">
              <button
                className="bg-black text-white font-bold px-4 py-1 text-sm rounded mr-2"
                onClick={() => {
                  setStatus(ChatProgressType.fundraise);
                  recent && setCommonConversations((prev) => [...prev, recent]);
                  setRecent(null);
                }}
                disabled={status === ChatProgressType.fundraise}
              >
                {status === ChatProgressType.fundraise
                  ? "Confirmed"
                  : "Confirm"}
              </button>
              {/* <button className="border border-black font-bold px-4 py-1 text-sm rounded">
                START OVER
              </button> */}
            </div>
          )}
          {progress === ChatProgressType.done && (
            <div className="flex mt-4 ml-8">
              <button
                className="bg-black text-white font-bold px-4 py-1 text-sm rounded mr-2"
                onClick={() => handler && handler()}
              >
                Yes
              </button>
              <button
                className="border border-black font-bold px-4 py-1 text-sm rounded"
                onClick={() => window.location.reload()}
              >
                START OVER
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="mb-1 w-full flex justify-end">
          <div className="flex items-start justify-end w-4/5">
            <div style={{ marginTop: 2 }}>
              <p className="text-sm">{value}</p>
            </div>
            <div className="bg-yellow-300 text-black rounded-full w-6 h-6 flex items-center justify-center ml-2 flex-shrink-0">
              <span>{"U"}</span>
            </div>
          </div>
          <div></div>
        </div>
      )}
    </div>
  );
};

export default CommonChat;
