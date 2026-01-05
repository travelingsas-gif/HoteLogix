
import { Product, Property, User } from './types';

export const MOCK_USERS: User[] = [
  // Fixed Role 'ADMIN' to 'OWNER' and added missing 'tenantId'
  { id: '1', tenantId: 't1', email: 'admin@hotel.com', name: 'Admin User', role: 'OWNER' },
  { id: '2', tenantId: 't1', email: 'reception@hotel.com', name: 'Reception Desk', role: 'RECEPTION' },
  { id: '3', tenantId: 't1', email: 'cleaner1@hotel.com', name: 'Maria Rossi', role: 'OPERATOR' },
  { id: '4', tenantId: 't1', email: 'alfonso@supply.com', name: 'Alfonso Forniture', role: 'SUPPLIER' },
];

export const MOCK_PROPERTIES: Property[] = [
  // Added missing 'tenantId' to satisfy Property interface
  {
    id: 'p1',
    tenantId: 't1',
    name: 'METROPOLITAN',
    address: 'Piazza Giuseppe Garibaldi 80',
    imageUrl: 'https://picsum.photos/800/400?random=1',
    alarmCode: '9988',
    accessCode: '1234#',
  },
  {
    id: 'p2',
    tenantId: 't1',
    name: 'Paradise',
    address: 'Piazza Garibaldi 73',
    imageUrl: 'https://picsum.photos/800/400?random=2',
    alarmCode: '1122',
  },
  {
    id: 'p3',
    tenantId: 't1',
    name: 'Sofia Rooms',
    address: 'Via Roma 12',
    imageUrl: 'https://picsum.photos/800/400?random=3',
  },
  {
    id: 'p4',
    tenantId: 't1',
    name: 'VULCANIA ROOMS',
    address: 'Via Etnea 200',
    imageUrl: 'https://picsum.photos/800/400?random=4',
  },
];

export const MOCK_PRODUCTS: Product[] = [
  // Added missing 'tenantId' to satisfy Product interface
  { id: 'prod1', tenantId: 't1', name: 'Candeggina', category: 'CLEANING', unit: 'flacone', defaultQuantity: 5 },
  { id: 'prod2', tenantId: 't1', name: 'Sgrassatore', category: 'CLEANING', unit: 'flacone', defaultQuantity: 3 },
  { id: 'prod3', tenantId: 't1', name: 'Carta Igienica', category: 'BATHROOM', unit: 'rotoli', defaultQuantity: 20 },
  { id: 'prod4', tenantId: 't1', name: 'Caffè Cialde', category: 'BREAKFAST', unit: 'scatola', defaultQuantity: 2 },
  { id: 'prod5', tenantId: 't1', name: 'Kit Cortesia', category: 'BATHROOM', unit: 'pezzi', defaultQuantity: 50 },
  { id: 'prod6', tenantId: 't1', name: 'Sacchi Spazzatura', category: 'CLEANING', unit: 'rotolo', defaultQuantity: 5 },
];

export const MOCK_LAUNDRY: Product[] = [
  // Added missing 'tenantId' to satisfy Product interface
  { id: 'lin1', tenantId: 't1', name: 'Lenzuola Matrimoniali', category: 'LAUNDRY', unit: 'pezzi', defaultQuantity: 10 },
  { id: 'lin2', tenantId: 't1', name: 'Lenzuola Singole', category: 'LAUNDRY', unit: 'pezzi', defaultQuantity: 10 },
  { id: 'lin3', tenantId: 't1', name: 'Federe', category: 'LAUNDRY', unit: 'pezzi', defaultQuantity: 20 },
  { id: 'lin4', tenantId: 't1', name: 'Asciugamano Viso', category: 'LAUNDRY', unit: 'pezzi', defaultQuantity: 20 },
  { id: 'lin5', tenantId: 't1', name: 'Asciugamano Doccia', category: 'LAUNDRY', unit: 'pezzi', defaultQuantity: 20 },
  { id: 'lin6', tenantId: 't1', name: 'Tappetino Bagno', category: 'LAUNDRY', unit: 'pezzi', defaultQuantity: 5 },
];
