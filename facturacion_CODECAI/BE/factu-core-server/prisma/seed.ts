import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...\n');

  // ===== CREAR ROLES =====
  console.log('📋 Creando roles...');
  
  const adminRole = await prisma.role.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: 'Administrador',
    },
  });

  const userRole = await prisma.role.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      name: 'Usuario',
    },
  });

  const vendedorRole = await prisma.role.upsert({
    where: { id: 3 },
    update: {},
    create: {
      id: 3,
      name: 'Vendedor',
    },
  });

  console.log('✅ Roles creados correctamente:');
  console.log('   - Administrador (ID: 1)');
  console.log('   - Usuario (ID: 2)');
  console.log('   - Vendedor (ID: 3)\n');

  // ===== CREAR USUARIO ADMINISTRADOR =====
  console.log('👤 Creando usuario administrador...');

  const adminEmail = 'admin@factucore.com';
  const adminPassword = 'Admin123#'; // Cambiar en producción

  // Verificar si el usuario admin ya existe
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log('⚠️  El usuario administrador ya existe');
  } else {
    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const adminUser = await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        firstName: 'Administrador',
        lastName: 'Sistema',
        documentType: 'DNI',
        documentNumber: '00000000',
        phoneNumber: '999999999',
        address: 'Dirección del sistema',
        roleId: adminRole.id,
      },
    });

    console.log('✅ Usuario administrador creado:');
    console.log(`   📧 Email: ${adminEmail}`);
    console.log(`   🔑 Password: ${adminPassword}`);
    console.log(`   ⚠️  IMPORTANTE: Cambia esta contraseña después del primer login\n`);
  }

  console.log('🎉 Seed completado exitosamente!');
}

main()
  .catch((e) => {
    console.error('❌ Error ejecutando seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });