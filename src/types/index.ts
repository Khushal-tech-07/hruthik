export type Language = 'en' | 'te';

export type Theme = 'light' | 'dark' | 'system';

export interface User {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  isDemo?: boolean;
}

export interface Transaction {
  id: string;
  timestamp: number;
  dateStr: string;
  timeStr: string;
  description: string;
  gpayAmount: number;
  cashAmount: number;
  totalAmount: number;
}

export interface ShopConfig {
  name: string;
  ownerName: string;
  phone?: string;
  address?: string;
  currencySymbol: string;
  whatsappNumber: string;
}
