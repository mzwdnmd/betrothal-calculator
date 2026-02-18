export type Side = "bridePrice" | "dowry";

export type Item = {
  id: string;
  name: string;
  amount: number; // 元
  note?: string;
};

export type Category = {
  id: string;
  name: string;
  items: Item[];
};
