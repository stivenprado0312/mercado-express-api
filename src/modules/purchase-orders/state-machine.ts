import { OrderStatus } from '../../shared/constants/domain.constants';
import { BusinessRuleError } from '../../shared/errors';

const VALID_TRANSITIONS: Record<string, string[]> = {
  [OrderStatus.PENDING]: [OrderStatus.APPROVED, OrderStatus.REJECTED],
  [OrderStatus.APPROVED]: [OrderStatus.RECEIVED],
  [OrderStatus.REJECTED]: [],
  [OrderStatus.RECEIVED]: []
};

export function canTransition(from: string, to: string): boolean {
  return VALID_TRANSITIONS[from]?.includes(to) ?? false;
}

export function validateStatusTransition(
  currentStatus: string,
  targetStatus: string,
  action: string
): void {
  if (!canTransition(currentStatus, targetStatus)) {
    const actionMessages: Record<string, string> = {
      aprobar: `Solo se pueden aprobar órdenes en estado PENDING`,
      rechazar: `Solo se pueden rechazar órdenes en estado PENDING`,
      recibir: `Solo se pueden recibir órdenes en estado APPROVED`
    };
    const message = actionMessages[action] || `No se puede ${action} una orden en estado ${currentStatus}`;
    throw new BusinessRuleError(message);
  }
}

export function getValidTransitions(status: string): string[] {
  return VALID_TRANSITIONS[status] || [];
}
