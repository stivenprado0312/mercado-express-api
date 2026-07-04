import request from 'supertest';
import { createApp } from '../../../src/app';

jest.mock('../../../src/modules/alerts/alerts.repository');
jest.mock('../../../src/database/index', () => ({
  default: {}
}));

describe('GET /alerts', () => {
  const app = createApp();

  it('debe retornar 200 con lista de alertas', async () => {
    const createdAt = new Date();
    const mockAlerts = [
      {
        id: '123e4567-e89b-12d3-a456-426614174000',
        productId: 'prod-123',
        type: 'LOW_STOCK',
        status: 'ACTIVE',
        createdAt,
        resolvedAt: null,
        product: {
          id: 'prod-123',
          name: 'Agua Mineral 500ml',
          sku: 'BEB-001',
          currentStock: 30,
          minimumStock: 50
        }
      }
    ];

    const { alertsRepository } = require('../../../src/modules/alerts/alerts.repository');
    alertsRepository.findAll.mockResolvedValue(mockAlerts);

    const response = await request(app).get('/alerts');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].id).toBe(mockAlerts[0].id);
    expect(response.body.data[0].status).toBe('ACTIVE');
  });

  it('debe retornar 200 con filtro por status', async () => {
    const mockAlerts: never[] = [];

    const { alertsRepository } = require('../../../src/modules/alerts/alerts.repository');
    alertsRepository.findAll.mockResolvedValue(mockAlerts);

    const response = await request(app).get('/alerts?status=RESOLVED');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(alertsRepository.findAll).toHaveBeenCalledWith({ status: 'RESOLVED' });
  });
});

describe('GET /alerts/:id', () => {
  const app = createApp();

  it('debe retornar 200 con alerta encontrada', async () => {
    const createdAt = new Date();
    const mockAlert = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      productId: 'prod-123',
      type: 'LOW_STOCK',
      status: 'ACTIVE',
      createdAt,
      resolvedAt: null,
      product: {
        id: 'prod-123',
        name: 'Agua Mineral 500ml',
        sku: 'BEB-001',
        currentStock: 30,
        minimumStock: 50
      }
    };

    const { alertsRepository } = require('../../../src/modules/alerts/alerts.repository');
    alertsRepository.findById.mockResolvedValue(mockAlert);

    const response = await request(app).get('/alerts/123e4567-e89b-12d3-a456-426614174000');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.id).toBe(mockAlert.id);
  });

  it('debe retornar 404 cuando alerta no existe', async () => {
    const { alertsRepository } = require('../../../src/modules/alerts/alerts.repository');
    alertsRepository.findById.mockResolvedValue(null);

    const response = await request(app).get('/alerts/123e4567-e89b-12d3-a456-426614174999');

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
  });
});

describe('POST /alerts/:id/resolve', () => {
  const app = createApp();

  it('debe retornar 200 al resolver alerta', async () => {
    const createdAt = new Date();
    const resolvedAt = new Date();
    const mockAlert = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      productId: 'prod-123',
      type: 'LOW_STOCK',
      status: 'RESOLVED',
      createdAt,
      resolvedAt
    };

    const { alertsRepository } = require('../../../src/modules/alerts/alerts.repository');
    alertsRepository.findById.mockResolvedValue({ ...mockAlert, status: 'ACTIVE' });
    alertsRepository.resolve.mockResolvedValue(mockAlert);

    const response = await request(app).post('/alerts/123e4567-e89b-12d3-a456-426614174000/resolve');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.status).toBe('RESOLVED');
  });

  it('debe retornar 200 cuando alerta ya esta resuelta', async () => {
    const createdAt = new Date();
    const resolvedAt = new Date();
    const mockAlert = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      productId: 'prod-123',
      type: 'LOW_STOCK',
      status: 'RESOLVED',
      createdAt,
      resolvedAt
    };

    const { alertsRepository } = require('../../../src/modules/alerts/alerts.repository');
    alertsRepository.findById.mockResolvedValue(mockAlert);

    const response = await request(app).post('/alerts/123e4567-e89b-12d3-a456-426614174000/resolve');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it('debe retornar 404 cuando alerta no existe', async () => {
    const { alertsRepository } = require('../../../src/modules/alerts/alerts.repository');
    alertsRepository.findById.mockResolvedValue(null);

    const response = await request(app).post('/alerts/123e4567-e89b-12d3-a456-426614174999/resolve');

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
  });
});
