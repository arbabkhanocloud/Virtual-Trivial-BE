export type GAMECODEDTO = {
  uniqueCode: String;
  dateCreated: String;
  gameType: String;
  dateActivated: String;
  dateExpired: String;
};

export type IGAMECODEDTO = {
  uniqueCode: string;
  gameType: string;
  dateCreated: string;
  dateActivated: string;
  dateExpired: string;
  reseller?: string;
  companyName?: string;
};
