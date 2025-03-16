export type UsesBovaerStatus = "yes" | "no" | "soon" | "unknown";

export interface DairyCode {
  id: number;
  name: string;
  code: string;
  address: string;
  place: string;
  uses_bovaer: UsesBovaerStatus;
}

export type DairyCodeList = DairyCode[];
