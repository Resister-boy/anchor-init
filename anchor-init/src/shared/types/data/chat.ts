export type ChatTokenMetadataShape = {
  name: string;
  symbol: string;
  uri: string;
  description: string;
};

export enum ChatStatusType {
  init = 0,
  strategy,
  metadata,
  finished,
}
