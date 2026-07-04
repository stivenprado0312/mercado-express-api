import { NotFoundError } from '../../shared/errors';
import { alertsRepository } from './alerts.repository';
import type { ListAlertsQuery } from './alerts.schemas';

export class AlertsService {
  async getById(id: string) {
    const alert = await alertsRepository.findById(id);
    if (!alert) {
      throw new NotFoundError(`Alerta con id ${id} no encontrada`);
    }
    return alert;
  }

  async list(query: ListAlertsQuery) {
    return alertsRepository.findAll(query);
  }

  async resolve(id: string) {
    const alert = await alertsRepository.findById(id);
    if (!alert) {
      throw new NotFoundError(`Alerta con id ${id} no encontrada`);
    }

    if (alert.status === 'RESOLVED') {
      return alert;
    }

    return alertsRepository.resolve(id);
  }
}

export const alertsService = new AlertsService();
