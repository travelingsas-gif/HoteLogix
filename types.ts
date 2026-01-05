
export type Role = 'SUPER_ADMIN' | 'OWNER' | 'RECEPTION' | 'OPERATOR' | 'SUPPLIER';

export interface Tenant {
  id: string;
  name: string;
  trialStartDate: string;
  subscriptionStatus: 'trial' | 'active' | 'expired';
}

export interface User {
  id: string;
  tenantId: string;
  email: string;
  name: string;
  role: Role;
  avatarUrl?: string;
}

export interface Property {
  id: string;
  tenantId: string;
  name: string;
  address: string;
  imageUrl: string;
  alarmCode?: string;
  accessCode?: string;
  managerEmail?: string;
}

export interface Product {
  id: string;
  tenantId: string;
  name: string;
  category: 'CLEANING' | 'BREAKFAST' | 'BATHROOM' | 'OTHER' | 'LAUNDRY';
  unit: string;
  defaultQuantity: number;
}

export interface InventoryItem {
  productId: string;
  quantityInStock: number;
  quantityToOrder: number;
}

export interface Order {
  id: string;
  tenantId: string;
  propertyId: string;
  createdAt: string;
  status: 'PENDING' | 'SENT' | 'DELIVERED';
  items: InventoryItem[];
  type: 'PRODUCT' | 'LAUNDRY';
}

export interface IssueReport {
  id: string;
  tenantId: string;
  propertyId: string;
  description: string;
  reportedBy: string;
  date: string;
  status: 'OPEN' | 'RESOLVED';
}

export interface UnusedLaundryReport {
  id: string;
  tenantId: string;
  propertyId: string;
  date: string;
  reportedBy: string;
  items: { productId: string; quantity: number }[];
}
