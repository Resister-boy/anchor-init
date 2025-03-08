import React from "react";

type Props = {
  text: string;
};

const InitChat = ({ text }: Props) => {
  return (
    <div className="mx-4 p-2">
      <div className="mb-1">
        <div className="flex items-start">
          <div className="bg-yellow-300 text-black rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0">
            <span>A</span>
          </div>
          <div style={{ marginTop: 2 }}>
            <p className="text-sm">{text}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InitChat;
