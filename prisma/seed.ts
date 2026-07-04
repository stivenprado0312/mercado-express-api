import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('Iniciando seed...');

  await prisma.product.createMany({
    data: [
      {
        name: 'Agua Mineral 500ml',
        sku: 'BEB-001',
        category: 'Bebidas',
        price: 1500,
        currentStock: 150,
        minimumStock: 50,
        supplier: 'Distribuidora Andina'
      },
      {
        name: 'Jugo de Naranja 1L',
        sku: 'BEB-002',
        category: 'Bebidas',
        price: 3200,
        currentStock: 30,
        minimumStock: 40,
        supplier: 'Lácteos del Valle'
      },
      {
        name: 'Leche Entera 1L',
        sku: 'LAC-001',
        category: 'Lácteos',
        price: 2100,
        currentStock: 200,
        minimumStock: 60,
        supplier: 'Lácteos del Valle'
      },
      {
        name: 'Yogur Natural 500g',
        sku: 'LAC-002',
        category: 'Lácteos',
        price: 2800,
        currentStock: 15,
        minimumStock: 25,
        supplier: 'Lácteos del Valle'
      },
      {
        name: 'Papas Fritas 200g',
        sku: 'SNA-001',
        category: 'Snacks',
        price: 2500,
        currentStock: 80,
        minimumStock: 30,
        supplier: 'SnacksCorp'
      },
      {
        name: 'Detergente 1L',
        sku: 'LIM-001',
        category: 'Limpieza',
        price: 4500,
        currentStock: 45,
        minimumStock: 20,
        supplier: 'Químicos del Sur'
      }
    ]
  });

  console.log('Seed completado: 6 productos creados');
}

main()
  .catch((e) => {
    console.error('Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
