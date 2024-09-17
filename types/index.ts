export type PriceHistoryItem = {
    price: number;
  };
  
  export type User = {
    email: string;
  };
  
  export type Product = {
    _id?: string;
    url: string;
    title: string;
    currentPrice: number;
    originalPrice: number;
    discount?: number;
    imgURL: string;
    priceHistory: PriceHistoryItem[];
    lowestPrice?: number;
    highestPrice?: number;
    averagePrice?: number;
    users?: { email: string }[];
  };
  
  
  export type NotificationType =
    | "WELCOME"
    | "CHANGE_OF_STOCK"
    | "LOWEST_PRICE"
    | "THRESHOLD_MET";
  
  export type EmailContent = {
    subject: string;
    body: string;
  };
  
  export type EmailProductInfo = {
    title: string;
    url: string;
  };