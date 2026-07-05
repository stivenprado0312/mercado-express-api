import { z } from 'zod';

export const AlertStatus = {
  ACTIVE: 'ACTIVE',
  RESOLVED: 'RESOLVED'
} as const;

export const MovementType = {
  ENTRY: 'ENTRY',
  EXIT: 'EXIT'
} as const;

export const OrderStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  RECEIVED: 'RECEIVED'
} as const;

export const CATEGORIES = [
  'Bebidas',
  'Lácteos',
  'Snacks',
  'Limpieza',
  'Frutas',
  'Granos'
] as const;

export const BUSINESS_RULES = {
  MINIMUM_ORDER_MULTIPLIER: 2,
  MINIMUM_REJECTION_LENGTH: 10
} as const;

export const uuidSchema = z.string().uuid('ID debe ser un UUID válido');

export type AlertStatusType = typeof AlertStatus[keyof typeof AlertStatus];
export type MovementTypeType = typeof MovementType[keyof typeof MovementType];
export type OrderStatusType = typeof OrderStatus[keyof typeof OrderStatus];
export type CategoryType = typeof CATEGORIES[number];
