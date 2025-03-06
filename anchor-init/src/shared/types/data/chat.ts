export type ChatTokenMetadataShape = {
  name: string;
  symbol: string;
  uri: string;
  description: string;
};

export enum ChatProgressType {
  common = 0,
  confirm,
  fundraise,
  done,
}

export type ChatShape = {
  value: string;
  timestamp: string;
  type: "user" | "agent";
  progress: ChatProgressType;
};

export type ChatJsonShape = {
  value: string;
  json: string;
  timestamp: string;
  type: "user" | "agent";
  progress: ChatProgressType;
};
