# Frontend - Guía de Configuración

## 🔧 Configuración del Frontend con el Backend

Este frontend ha sido configurado para conectarse directamente con el backend de FactuCore que corre en el puerto **3001**.

### Cambios Realizados

#### 1. **Tipos Actualizados** ✅
- **auth.ts**: Actualizado `rolId` → `roleId` y agregados campos completos del usuario
- **user.ts**: Actualizado `rolId` → `roleId` y `rol` → `role`
- **invoice.ts**: Agregados tipos `Bill` y `BillDetail` que coinciden con el backend

#### 2. **Servicios Conectados al Backend** ✅

**api.ts** - Configuración base
- URL del backend: `http://localhost:3001`
- Manejo automático de tokens JWT desde cookies
- Manejo de errores mejorado

**authService.ts** - Autenticación
- `POST /auth/login` - Login
- `POST /auth/register` - Registro
- `GET /auth/profile` - Perfil del usuario
- `POST /auth/logout` - Cerrar sesión

**userService.ts** - Gestión de usuarios
- `GET /users` - Listar todos (Solo Admin)
- `GET /users/me` - Mi perfil
- `GET /users/:id` - Obtener por ID
- `POST /users` - Crear (Solo Admin)
- `PATCH /users/:id` - Actualizar (Solo Admin)
- `DELETE /users/:id` - Eliminar (Solo Admin)

**roleService.ts** - Gestión de roles (NUEVO)
- `GET /roles` - Listar todos
- `GET /roles/:id` - Obtener por ID
- `POST /roles` - Crear
- `PATCH /roles/:id` - Actualizar
- `DELETE /roles/:id` - Eliminar

**invoiceService.ts** - Gestión de facturas
- Endpoints completos para `Bill` (facturas)
- Endpoints completos para `BillDetails` (detalles)
- Funciones legacy mantenidas para compatibilidad

#### 3. **Páginas Actualizadas** ✅

**pages/login/page.tsx**
- Validación de contraseña: mínimo 8 caracteres (como el backend)
- Integrado con authService

**pages/dashboard/users/page.tsx**
- Usa `role` en lugar de `rol`
- Conectado al backend

**components/users/user-form.tsx**
- Carga roles dinámicamente del backend
- Usa `roleId` en lugar de `rolId`
- Tipos de documento actualizados: Cédula, RUC, Pasaporte

### 📝 Configuración Requerida

#### 1. Crear archivo `.env.local`

Copia el archivo `.env.local.example` y renómbralo a `.env.local`:

```bash
cp .env.local.example .env.local
```

O crea un nuevo archivo `.env.local` con:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

#### 2. Iniciar el Backend

Asegúrate de que el backend esté corriendo en el puerto 3001:

```bash
cd BE/factu-core-server
npm run start:dev
```

#### 3. Iniciar el Frontend

```bash
cd FE
npm install
npm run dev
```

El frontend estará disponible en: `http://localhost:3000`

### 🔑 Credenciales de Prueba

Según el seed del backend, puedes usar:

```
Email: admin@factucore.com
Password: Admin123!
```

### 🚀 Flujo de Trabajo

1. **Login**: El usuario inicia sesión en `/pages/login`
2. **Token**: El token JWT se guarda en cookies (`auth_token`)
3. **Autenticación**: Todas las peticiones incluyen automáticamente el token en el header `Authorization: Bearer <token>`
4. **Datos**: Los datos se obtienen directamente del backend

### 📊 Estructura de Datos

#### Usuario (User)
```typescript
{
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  documentType: string;
  documentNumber: string;
  phoneNumber: string;
  address: string;
  roleId: number;
  role?: {
    id: number;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}
```

#### Factura (Bill)
```typescript
{
  id: number;
  billNumber: string;
  date: string;
  grandTotal: number; // Calculado automáticamente
  userId: number;
  user?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  details?: BillDetail[];
}
```

#### Detalle de Factura (BillDetail)
```typescript
{
  id: number;
  name: string;
  amount: number; // cantidad
  description: string;
  itemPrice: number; // precio unitario
  totalItem: number; // calculado: amount * itemPrice
  billId: number;
}
```

### ⚠️ Notas Importantes

1. **CORS**: Asegúrate de que el backend tenga CORS habilitado para `http://localhost:3000`

2. **Tokens**: Los tokens se guardan en cookies con las siguientes características:
   - Nombre: `auth_token`
   - Path: `/`
   - Max-Age: 3600 segundos (1 hora)
   - SameSite: Lax

3. **Roles**: 
   - ID 1: Administrador (acceso completo)
   - ID 2: Gerente (acceso limitado)
   - ID 3+: Otros roles según configuración

4. **Validaciones**:
   - Email: formato válido
   - Password: mínimo 8 caracteres, mayúsculas, minúsculas y números
   - Documento: solo números

### 🔍 Troubleshooting

**Error: Network Error o Failed to fetch**
- Verifica que el backend esté corriendo en `http://localhost:3001`
- Verifica el archivo `.env.local`

**Error: 401 Unauthorized**
- El token expiró o no es válido
- Haz logout y vuelve a iniciar sesión

**Error: 403 Forbidden**
- El usuario no tiene permisos para esta acción
- Solo administradores pueden crear/editar/eliminar usuarios

**Error: CORS**
- Verifica la configuración de CORS en el backend

### 📚 Documentación del Backend

Para más detalles sobre los endpoints y modelos del backend, consulta:
`BE/factu-core-server/CONFIGURATION.md`

### 🎯 Próximos Pasos Recomendados

1. **Implementar página de facturas** usando los nuevos servicios de `invoiceService.ts`
2. **Agregar página de tiendas (Shops)** según endpoints del backend
3. **Mejorar manejo de errores** con mensajes más específicos
4. **Agregar loading states** en todas las páginas
5. **Implementar refresh automático** de token antes de que expire
6. **Agregar página de perfil** usando `GET /users/me`

---

**Última actualización**: Febrero 3, 2026
