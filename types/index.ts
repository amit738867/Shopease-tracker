export type PriceHistoryItem = {
    price: number;
  };
  
  export type User = {
    email: string;
  };
  
  export type Product = {
    _id?: string;
    url: string;
    currency: string;
    imgURL: string;
    title: string;
    currentPrice: number;
    originalPrice: number;
    priceHistory: PriceHistoryItem[] | [];
    highestPrice: number;
    lowestPrice: number;
    averagePrice: number;
    discount: number;
    description: string;
    category: string;
    reviewsCount: number;
    stars: number;
    isOutOfStock: Boolean;
    users?: User[];
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