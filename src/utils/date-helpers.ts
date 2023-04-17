import moment from "moment";

export const getCurrentTime = (): string => {
  return moment().format();
};
