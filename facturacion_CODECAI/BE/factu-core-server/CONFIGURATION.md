# FactuCore Backend - Documentación Completa API

## 📋 Información General del Proyecto

**Proyecto:** Sistema de Facturación FactuCore  
**Framework:** NestJS  
**Base de Datos:** PostgreSQL  
**ORM:** Prisma  
**Autenticación:** JWT (JSON Web Tokens)  
**Puerto:** 3001  
**Base URL:** `http://localhost:3001`

---

## 🔐 Sistema de Autenticación

### Características de Autenticación

- **Tipo:** JWT (JSON Web Token)
- **Header requerido:** `Authorization: Bearer <token>`
- **Control de acceso basado en roles:** Administrador, Gerente, etc.
- **Rutas públicas:** Login y Register (decoradas con `@Public()`)
- **Rutas protegidas:** Todas las demás requieren autenticación

### Guards y Decoradores

1. **`@Public()`**: Marca rutas como públicas (sin autenticación)
2. **`@Roles('Administrador', 'Gerente')`**: Restringe acceso por roles
3. **`@UseGuards(AuthGuard)`**: Requiere autenticación JWT
4. **`@CurrentUser()`**: Inyecta el usuario autenticado en el controlador

---

## 📊 Modelos de Datos

### Role (Rol)
```typescript
{
  id: number;
  name: string;  // Ej: "Administrador", "Gerente"
  users: User[];
}
```

### User (Usuario)
```typescript
{
  id: number;
  email: string;          // Único
  password: string;       // Hasheada con bcrypt
  roleId: number;
  role: Role;
  firstName: string;
  lastName: string;
  documentType: string;
  documentNumber: string;
  phoneNumber: string;
  address: string;
  shops: UserShop[];
  bills: Bill[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Shop (Tienda)
```typescript
{
  id: number;
  name: string;
  address: string;
  phoneNumber: string;
  country: string;
  city: string;
  ruc: string;           // Único, 13 dígitos
  email: string;         // Único
  isActive: boolean;     // Default: true
  users: UserShop[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Bill (Factura)
```typescript
{
  id: number;
  billNumber: string;
  date: Date;
  grandTotal: number;    // Calculado automáticamente
  userId: number;
  user: User;
  details: BillDetails[];
}
```

### BillDetails (Detalle de Factura)
```typescript
{
  id: number;
  name: string;
  amount: number;        // Cantidad
  description: string;
  itemPrice: number;     // Precio unitario
  totalItem: number;     // Calculado: amount * itemPrice
  billId: number;
  bill: Bill;
}
```

### UserShop (Relación Usuario-Tienda)
```typescript
{
  id: number;
  userId: number;
  shopId: number;
  user: User;
  shop: Shop;
  assignedAt: Date;
}
```

---

## 🔑 Módulo de Autenticación (Auth)

**Base Path:** `/auth`

### 1. Login (Iniciar Sesión)

**Endpoint:** `POST /auth/login`  
**Autenticación:** No requerida (Pública)  
**Roles:** N/A

**Request Body:**
```json
{
  "email": "admin@factucore.com",
  "password": "Admin123!"
}
```

**Validaciones:**
- `email`: Email válido, obligatorio
- `password`: Mínimo 8 caracteres, obligatorio

**Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "admin@factucore.com",
    "firstName": "Admin",
    "lastName": "Sistema",
    "roleId": 1,
    "role": {
      "id": 1,
      "name": "Administrador"
    }
  }
}
```

**Errores:**
- `401 Unauthorized`: Credenciales incorrectas
- `400 Bad Request`: Datos de entrada inválidos

---

### 2. Registro (Crear Cuenta)

**Endpoint:** `POST /auth/register`  
**Autenticación:** No requerida (Pública)  
**Roles:** N/A

**Request Body:**
```json
{
  "firstName": "Juan",
  "lastName": "Pérez",
  "email": "juan.perez@email.com",
  "password": "Password123!",
  "documentType": "Cédula",
  "documentNumber": "1234567890",
  "address": "Av. Principal 123",
  "phoneNumber": "0991234567"
}
```

**Validaciones:**
- `firstName`: Obligatorio, string
- `lastName`: Obligatorio, string
- `email`: Email válido, único, obligatorio
- `password`: Mínimo 8 caracteres, debe contener mayúsculas, minúsculas y números/caracteres especiales
- `documentType`: Obligatorio, string
- `documentNumber`: Solo números, obligatorio
- `address`: Obligatorio, string
- `phoneNumber`: Obligatorio, string

**Response (201 Created):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 2,
    "email": "juan.perez@email.com",
    "firstName": "Juan",
    "lastName": "Pérez",
    "roleId": 2,
    "documentType": "Cédula",
    "documentNumber": "1234567890",
    "phoneNumber": "0991234567",
    "address": "Av. Principal 123",
    "createdAt": "2026-02-03T18:30:00.000Z",
    "updatedAt": "2026-02-03T18:30:00.000Z"
  }
}
```

**Errores:**
- `400 Bad Request`: Email ya existe o datos inválidos
- `400 Bad Request`: Contraseña no cumple requisitos

---

### 3. Obtener Perfil

**Endpoint:** `GET /auth/profile`  
**Autenticación:** Requerida  
**Roles:** Cualquier usuario autenticado

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "id": 1,
  "email": "admin@factucore.com",
  "roleId": 1
}
```

---

### 4. Logout (Cerrar Sesión)

**Endpoint:** `POST /auth/logout`  
**Autenticación:** Requerida  
**Roles:** Cualquier usuario autenticado

**Response (200 OK):**
```json
{
  "message": "Logout exitoso"
}
```

**Nota:** El logout en JWT se maneja en el cliente eliminando el token.

---

## 👥 Módulo de Usuarios (Users)

**Base Path:** `/users`

### 1. Crear Usuario

**Endpoint:** `POST /users`  
**Autenticación:** Requerida  
**Roles:** Solo Administrador

**Request Body:**
```json
{
  "firstName": "María",
  "lastName": "González",
  "email": "maria.gonzalez@email.com",
  "password": "Password123!",
  "documentType": "Cédula",
  "documentNumber": "0987654321",
  "phoneNumber": "0987654321",
  "address": "Calle Secundaria 456",
  "roleId": 2
}
```

**Validaciones:**
- `firstName`: Obligatorio
- `lastName`: Obligatorio
- `email`: Email válido, único
- `password`: Mínimo 8 caracteres, con mayúsculas, minúsculas y números
- `documentType`: Obligatorio
- `documentNumber`: Solo números, obligatorio
- `phoneNumber`: Obligatorio
- `address`: Obligatorio
- `roleId`: Número entero, obligatorio

**Response (201 Created):**
```json
{
  "id": 3,
  "email": "maria.gonzalez@email.com",
  "firstName": "María",
  "lastName": "González",
  "roleId": 2,
  "role": {
    "id": 2,
    "name": "Gerente"
  },
  "documentType": "Cédula",
  "documentNumber": "0987654321",
  "phoneNumber": "0987654321",
  "address": "Calle Secundaria 456",
  "createdAt": "2026-02-03T19:00:00.000Z",
  "updatedAt": "2026-02-03T19:00:00.000Z"
}
```

---

### 2. Listar Todos los Usuarios

**Endpoint:** `GET /users`  
**Autenticación:** Requerida  
**Roles:** Solo Administrador

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "email": "admin@factucore.com",
    "firstName": "Admin",
    "lastName": "Sistema",
    "roleId": 1,
    "role": {
      "id": 1,
      "name": "Administrador"
    },
    "documentType": "Cédula",
    "documentNumber": "1234567890",
    "phoneNumber": "0991234567",
    "address": "Oficina Central",
    "shops": [
      {
        "id": 1,
        "shopId": 1,
        "shop": {
          "id": 1,
          "name": "Tienda Principal"
        }
      }
    ],
    "createdAt": "2026-01-01T10:00:00.000Z",
    "updatedAt": "2026-01-01T10:00:00.000Z"
  }
]
```

---

### 3. Obtener Mi Perfil

**Endpoint:** `GET /users/me`  
**Autenticación:** Requerida  
**Roles:** Cualquier usuario autenticado

**Response (200 OK):**
```json
{
  "id": 1,
  "email": "admin@factucore.com",
  "firstName": "Admin",
  "lastName": "Sistema",
  "roleId": 1,
  "role": {
    "id": 1,
    "name": "Administrador"
  },
  "documentType": "Cédula",
  "documentNumber": "1234567890",
  "phoneNumber": "0991234567",
  "address": "Oficina Central",
  "shops": [],
  "createdAt": "2026-01-01T10:00:00.000Z",
  "updatedAt": "2026-01-01T10:00:00.000Z"
}
```

---

### 4. Obtener Usuario por ID

**Endpoint:** `GET /users/:id`  
**Autenticación:** Requerida  
**Roles:** Cualquier usuario autenticado

**Parámetros:**
- `id` (number): ID del usuario

**Response (200 OK):**
```json
{
  "id": 2,
  "email": "gerente@factucore.com",
  "firstName": "Gerente",
  "lastName": "Principal",
  "roleId": 2,
  "role": {
    "id": 2,
    "name": "Gerente"
  },
  "documentType": "Cédula",
  "documentNumber": "0987654321",
  "phoneNumber": "0987654321",
  "address": "Sucursal Norte",
  "createdAt": "2026-01-15T10:00:00.000Z",
  "updatedAt": "2026-01-15T10:00:00.000Z"
}
```

**Errores:**
- `404 Not Found`: Usuario no encontrado

---

### 5. Actualizar Usuario

**Endpoint:** `PATCH /users/:id`  
**Autenticación:** Requerida  
**Roles:** Solo Administrador

**Parámetros:**
- `id` (number): ID del usuario

**Request Body (todos los campos opcionales):**
```json
{
  "firstName": "María Actualizada",
  "phoneNumber": "0999999999",
  "address": "Nueva Dirección 789"
}
```

**Response (200 OK):**
```json
{
  "id": 3,
  "email": "maria.gonzalez@email.com",
  "firstName": "María Actualizada",
  "lastName": "González",
  "roleId": 2,
  "phoneNumber": "0999999999",
  "address": "Nueva Dirección 789",
  "updatedAt": "2026-02-03T20:00:00.000Z"
}
```

---

### 6. Eliminar Usuario

**Endpoint:** `DELETE /users/:id`  
**Autenticación:** Requerida  
**Roles:** Solo Administrador

**Parámetros:**
- `id` (number): ID del usuario

**Response (200 OK):**
```json
{
  "message": "Usuario eliminado exitosamente"
}
```

---

## 🏪 Módulo de Tiendas (Shops)

**Base Path:** `/shops`

### 1. Crear Tienda

**Endpoint:** `POST /shops`  
**Autenticación:** Requerida  
**Roles:** Solo Administrador

**Request Body:**
```json
{
  "name": "Tienda Central",
  "address": "Av. Amazonas N123",
  "phoneNumber": "022345678",
  "country": "Ecuador",
  "city": "Quito",
  "ruc": "1234567890001",
  "email": "tienda.central@factucore.com",
  "userIds": [1, 2]
}
```

**Validaciones:**
- `name`: Mínimo 3 caracteres, máximo 100, obligatorio
- `address`: Mínimo 5 caracteres, obligatorio
- `phoneNumber`: 9-15 dígitos, obligatorio
- `country`: Obligatorio
- `city`: Obligatorio
- `ruc`: Exactamente 13 dígitos, único, obligatorio
- `email`: Email válido, único, obligatorio
- `userIds`: Array de números (opcional)

**Response (201 Created):**
```json
{
  "id": 1,
  "name": "Tienda Central",
  "address": "Av. Amazonas N123",
  "phoneNumber": "022345678",
  "country": "Ecuador",
  "city": "Quito",
  "ruc": "1234567890001",
  "email": "tienda.central@factucore.com",
  "isActive": true,
  "users": [
    {
      "id": 1,
      "userId": 1,
      "shopId": 1,
      "user": {
        "id": 1,
        "firstName": "Admin",
        "lastName": "Sistema",
        "email": "admin@factucore.com"
      }
    }
  ],
  "createdAt": "2026-02-03T21:00:00.000Z",
  "updatedAt": "2026-02-03T21:00:00.000Z"
}
```

---

### 2. Listar Todas las Tiendas

**Endpoint:** `GET /shops`  
**Autenticación:** Requerida  
**Roles:** Solo Administrador

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Tienda Central",
    "address": "Av. Amazonas N123",
    "phoneNumber": "022345678",
    "country": "Ecuador",
    "city": "Quito",
    "ruc": "1234567890001",
    "email": "tienda.central@factucore.com",
    "isActive": true,
    "users": [
      {
        "user": {
          "id": 1,
          "firstName": "Admin",
          "lastName": "Sistema"
        }
      }
    ],
    "createdAt": "2026-02-03T21:00:00.000Z",
    "updatedAt": "2026-02-03T21:00:00.000Z"
  }
]
```

---

### 3. Obtener Mis Tiendas

**Endpoint:** `GET /shops/my-shops`  
**Autenticación:** Requerida  
**Roles:** Cualquier usuario autenticado

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Tienda Central",
    "address": "Av. Amazonas N123",
    "phoneNumber": "022345678",
    "country": "Ecuador",
    "city": "Quito",
    "ruc": "1234567890001",
    "email": "tienda.central@factucore.com",
    "isActive": true
  }
]
```

---

### 4. Obtener Tienda por ID

**Endpoint:** `GET /shops/:id`  
**Autenticación:** Requerida  
**Roles:** Cualquier usuario autenticado

**Parámetros:**
- `id` (number): ID de la tienda

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Tienda Central",
  "address": "Av. Amazonas N123",
  "phoneNumber": "022345678",
  "country": "Ecuador",
  "city": "Quito",
  "ruc": "1234567890001",
  "email": "tienda.central@factucore.com",
  "isActive": true,
  "users": [
    {
      "user": {
        "id": 1,
        "firstName": "Admin",
        "lastName": "Sistema",
        "email": "admin@factucore.com"
      }
    }
  ],
  "createdAt": "2026-02-03T21:00:00.000Z",
  "updatedAt": "2026-02-03T21:00:00.000Z"
}
```

**Errores:**
- `404 Not Found`: Tienda no encontrada

---

### 5. Actualizar Tienda

**Endpoint:** `PATCH /shops/:id`  
**Autenticación:** Requerida  
**Roles:** Solo Administrador

**Parámetros:**
- `id` (number): ID de la tienda

**Request Body (todos los campos opcionales):**
```json
{
  "name": "Tienda Central Actualizada",
  "phoneNumber": "022999999",
  "address": "Nueva dirección"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Tienda Central Actualizada",
  "address": "Nueva dirección",
  "phoneNumber": "022999999",
  "country": "Ecuador",
  "city": "Quito",
  "ruc": "1234567890001",
  "email": "tienda.central@factucore.com",
  "isActive": true,
  "updatedAt": "2026-02-03T22:00:00.000Z"
}
```

---

### 6. Asignar Usuarios a Tienda

**Endpoint:** `POST /shops/:id/assign-users`  
**Autenticación:** Requerida  
**Roles:** Solo Administrador

**Parámetros:**
- `id` (number): ID de la tienda

**Request Body:**
```json
{
  "userIds": [1, 2, 3]
}
```

**Response (200 OK):**
```json
{
  "message": "Usuarios asignados exitosamente",
  "assignments": [
    {
      "id": 1,
      "userId": 1,
      "shopId": 1,
      "assignedAt": "2026-02-03T22:30:00.000Z"
    },
    {
      "id": 2,
      "userId": 2,
      "shopId": 1,
      "assignedAt": "2026-02-03T22:30:00.000Z"
    }
  ]
}
```

---

### 7. Remover Usuario de Tienda

**Endpoint:** `DELETE /shops/:shopId/users/:userId`  
**Autenticación:** Requerida  
**Roles:** Solo Administrador

**Parámetros:**
- `shopId` (number): ID de la tienda
- `userId` (number): ID del usuario

**Response (200 OK):**
```json
{
  "message": "Usuario removido de la tienda exitosamente"
}
```

---

### 8. Eliminar Tienda (Soft Delete)

**Endpoint:** `DELETE /shops/:id`  
**Autenticación:** Requerida  
**Roles:** Solo Administrador

**Parámetros:**
- `id` (number): ID de la tienda

**Response (200 OK):**
```json
{
  "message": "Tienda desactivada exitosamente",
  "shop": {
    "id": 1,
    "name": "Tienda Central",
    "isActive": false
  }
}
```

**Nota:** Soft delete marca `isActive = false` sin eliminar el registro.

---

### 9. Eliminar Tienda Permanentemente (Hard Delete)

**Endpoint:** `DELETE /shops/:id/permanent`  
**Autenticación:** Requerida  
**Roles:** Solo Administrador

**Parámetros:**
- `id` (number): ID de la tienda

**Response (200 OK):**
```json
{
  "message": "Tienda eliminada permanentemente"
}
```

---

## 🎭 Módulo de Roles (Roles)

**Base Path:** `/roles`

### 1. Crear Rol

**Endpoint:** `POST /roles`  
**Autenticación:** Requerida  
**Roles:** Solo Administrador

**Request Body:**
```json
{
  "name": "Vendedor"
}
```

**Validaciones:**
- `name`: String, obligatorio, mínimo 3 caracteres

**Response (201 Created):**
```json
{
  "id": 3,
  "name": "Vendedor"
}
```

---

### 2. Listar Todos los Roles

**Endpoint:** `GET /roles`  
**Autenticación:** Requerida  
**Roles:** Solo Administrador

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Administrador"
  },
  {
    "id": 2,
    "name": "Gerente"
  },
  {
    "id": 3,
    "name": "Vendedor"
  }
]
```

---

### 3. Obtener Rol por ID

**Endpoint:** `GET /roles/:id`  
**Autenticación:** Requerida  
**Roles:** Solo Administrador

**Parámetros:**
- `id` (number): ID del rol

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Administrador",
  "users": [
    {
      "id": 1,
      "firstName": "Admin",
      "lastName": "Sistema",
      "email": "admin@factucore.com"
    }
  ]
}
```

**Errores:**
- `404 Not Found`: Rol no encontrado

---

### 4. Actualizar Rol

**Endpoint:** `PATCH /roles/:id`  
**Autenticación:** Requerida  
**Roles:** Solo Administrador

**Parámetros:**
- `id` (number): ID del rol

**Request Body:**
```json
{
  "name": "Vendedor Premium"
}
```

**Response (200 OK):**
```json
{
  "id": 3,
  "name": "Vendedor Premium"
}
```

---

### 5. Eliminar Rol

**Endpoint:** `DELETE /roles/:id`  
**Autenticación:** Requerida  
**Roles:** Solo Administrador

**Parámetros:**
- `id` (number): ID del rol

**Response (200 OK):**
```json
{
  "message": "Rol eliminado exitosamente"
}
```

**Errores:**
- `400 Bad Request`: No se puede eliminar si tiene usuarios asociados

---

## 🧾 Módulo de Facturas (Bill)

**Base Path:** `/bill`

### 1. Crear Factura

**Endpoint:** `POST /bill`  
**Autenticación:** Requerida  
**Roles:** Administrador, Gerente

**Request Body:**
```json
{
  "billNumber": "0000001",
  "date": "2026-02-03",
  "userId": 1
}
```

**Validaciones:**
- `billNumber`: Solo números, obligatorio, único
- `date`: Fecha en formato ISO (YYYY-MM-DD o ISO-8601), obligatorio
- `grandTotal`: Número positivo (opcional, se calcula automáticamente como 0 al inicio)
- `userId`: Número positivo, obligatorio

**Response (201 Created):**
```json
{
  "id": 1,
  "billNumber": "0000001",
  "date": "2026-02-03T00:00:00.000Z",
  "grandTotal": 0,
  "userId": 1,
  "user": {
    "id": 1,
    "firstName": "Admin",
    "lastName": "Sistema",
    "email": "admin@factucore.com"
  },
  "details": []
}
```

**Errores:**
- `400 Bad Request`: Número de factura ya existe
- `404 Not Found`: Usuario no encontrado

**Nota:** El `grandTotal` se inicializa en 0 y se recalcula automáticamente al agregar detalles.

---

### 2. Listar Todas las Facturas

**Endpoint:** `GET /bill`  
**Autenticación:** Requerida  
**Roles:** Administrador, Gerente

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "billNumber": "0000001",
    "date": "2026-02-03T00:00:00.000Z",
    "grandTotal": 157.50,
    "userId": 1,
    "user": {
      "id": 1,
      "firstName": "Admin",
      "lastName": "Sistema",
      "email": "admin@factucore.com"
    },
    "details": [
      {
        "id": 1,
        "name": "Producto A",
        "amount": 5,
        "itemPrice": 10.50,
        "totalItem": 52.50,
        "description": "Descripción del producto A"
      },
      {
        "id": 2,
        "name": "Producto B",
        "amount": 3,
        "itemPrice": 35.00,
        "totalItem": 105.00,
        "description": "Descripción del producto B"
      }
    ]
  }
]
```

**Nota:** Las facturas se ordenan por fecha descendente (más recientes primero).

---

### 3. Obtener Facturas por Usuario

**Endpoint:** `GET /bill/user/:userId`  
**Autenticación:** Requerida  
**Roles:** Administrador, Gerente

**Parámetros:**
- `userId` (number): ID del usuario

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "billNumber": "0000001",
    "date": "2026-02-03T00:00:00.000Z",
    "grandTotal": 157.50,
    "userId": 1,
    "user": {
      "id": 1,
      "firstName": "Admin",
      "lastName": "Sistema",
      "email": "admin@factucore.com"
    },
    "details": [...]
  }
]
```

---

### 4. Obtener Factura por Número

**Endpoint:** `GET /bill/bill-number/:billNumber`  
**Autenticación:** Requerida  
**Roles:** Administrador, Gerente

**Parámetros:**
- `billNumber` (string): Número de la factura

**Response (200 OK):**
```json
{
  "id": 1,
  "billNumber": "0000001",
  "date": "2026-02-03T00:00:00.000Z",
  "grandTotal": 157.50,
  "userId": 1,
  "user": {
    "id": 1,
    "firstName": "Admin",
    "lastName": "Sistema",
    "email": "admin@factucore.com"
  },
  "details": [...]
}
```

**Errores:**
- `404 Not Found`: Factura no encontrada

---

### 5. Obtener Factura por ID

**Endpoint:** `GET /bill/:id`  
**Autenticación:** Requerida  
**Roles:** Administrador, Gerente

**Parámetros:**
- `id` (number): ID de la factura

**Response (200 OK):**
```json
{
  "id": 1,
  "billNumber": "0000001",
  "date": "2026-02-03T00:00:00.000Z",
  "grandTotal": 157.50,
  "userId": 1,
  "user": {
    "id": 1,
    "firstName": "Admin",
    "lastName": "Sistema",
    "email": "admin@factucore.com"
  },
  "details": [
    {
      "id": 1,
      "name": "Producto A",
      "amount": 5,
      "description": "Descripción del producto A",
      "itemPrice": 10.50,
      "totalItem": 52.50,
      "billId": 1
    }
  ]
}
```

**Errores:**
- `404 Not Found`: Factura no encontrada

---

### 6. Actualizar Factura

**Endpoint:** `PATCH /bill/:id`  
**Autenticación:** Requerida  
**Roles:** Administrador, Gerente

**Parámetros:**
- `id` (number): ID de la factura

**Request Body (todos los campos opcionales):**
```json
{
  "billNumber": "0000002",
  "date": "2026-02-04"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "billNumber": "0000002",
  "date": "2026-02-04T00:00:00.000Z",
  "grandTotal": 157.50,
  "userId": 1,
  "user": {
    "id": 1,
    "firstName": "Admin",
    "lastName": "Sistema",
    "email": "admin@factucore.com"
  },
  "details": [...]
}
```

**Errores:**
- `400 Bad Request`: Nuevo número de factura ya existe
- `404 Not Found`: Usuario o factura no encontrados

---

### 7. Eliminar Factura

**Endpoint:** `DELETE /bill/:id`  
**Autenticación:** Requerida  
**Roles:** Solo Administrador

**Parámetros:**
- `id` (number): ID de la factura

**Response (204 No Content)**

**Nota:** La eliminación de una factura también elimina automáticamente todos sus detalles (cascade).

---

## 📝 Módulo de Detalles de Factura (Bill Details)

**Base Path:** `/bill-details`

### 1. Crear Detalle de Factura

**Endpoint:** `POST /bill-details`  
**Autenticación:** Requerida  
**Roles:** Cualquier usuario autenticado

**Request Body:**
```json
{
  "name": "Producto A",
  "amount": 5,
  "description": "Descripción detallada del producto",
  "itemPrice": 10.50,
  "billId": 1
}
```

**Validaciones:**
- `name`: String, obligatorio
- `amount`: Número entero, mínimo 1, obligatorio
- `description`: String, obligatorio
- `itemPrice`: Número positivo, obligatorio
- `totalItem`: Número positivo (opcional, se calcula automáticamente: amount * itemPrice)
- `billId`: Número entero positivo, obligatorio

**Response (201 Created):**
```json
{
  "id": 1,
  "name": "Producto A",
  "amount": 5,
  "description": "Descripción detallada del producto",
  "itemPrice": 10.50,
  "totalItem": 52.50,
  "billId": 1
}
```

**Comportamiento Automático:**
- ✅ `totalItem` se calcula como: `amount * itemPrice = 5 * 10.50 = 52.50`
- ✅ El `grandTotal` de la factura se recalcula automáticamente sumando todos los `totalItem`

**Errores:**
- `404 Not Found`: Factura no encontrada
- `400 Bad Request`: Datos inválidos

---

### 2. Listar Todos los Detalles

**Endpoint:** `GET /bill-details`  
**Autenticación:** Requerida  
**Roles:** Cualquier usuario autenticado

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Producto A",
    "amount": 5,
    "description": "Descripción detallada del producto",
    "itemPrice": 10.50,
    "totalItem": 52.50,
    "billId": 1,
    "bill": {
      "id": 1,
      "billNumber": "0000001",
      "date": "2026-02-03T00:00:00.000Z",
      "grandTotal": 157.50,
      "userId": 1
    }
  },
  {
    "id": 2,
    "name": "Producto B",
    "amount": 3,
    "description": "Otro producto",
    "itemPrice": 35.00,
    "totalItem": 105.00,
    "billId": 1,
    "bill": {
      "id": 1,
      "billNumber": "0000001",
      "date": "2026-02-03T00:00:00.000Z",
      "grandTotal": 157.50,
      "userId": 1
    }
  }
]
```

---

### 3. Obtener Detalles por Factura

**Endpoint:** `GET /bill-details/bill/:billId`  
**Autenticación:** Requerida  
**Roles:** Cualquier usuario autenticado

**Parámetros:**
- `billId` (number): ID de la factura

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Producto A",
    "amount": 5,
    "description": "Descripción detallada del producto",
    "itemPrice": 10.50,
    "totalItem": 52.50,
    "billId": 1,
    "bill": {
      "id": 1,
      "billNumber": "0000001",
      "grandTotal": 157.50
    }
  }
]
```

---

### 4. Obtener Detalle por ID

**Endpoint:** `GET /bill-details/:id`  
**Autenticación:** Requerida  
**Roles:** Cualquier usuario autenticado

**Parámetros:**
- `id` (number): ID del detalle

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Producto A",
  "amount": 5,
  "description": "Descripción detallada del producto",
  "itemPrice": 10.50,
  "totalItem": 52.50,
  "billId": 1,
  "bill": {
    "id": 1,
    "billNumber": "0000001",
    "date": "2026-02-03T00:00:00.000Z",
    "grandTotal": 157.50,
    "userId": 1
  }
}
```

**Errores:**
- `404 Not Found`: Detalle no encontrado

---

### 5. Actualizar Detalle

**Endpoint:** `PATCH /bill-details/:id`  
**Autenticación:** Requerida  
**Roles:** Cualquier usuario autenticado

**Parámetros:**
- `id` (number): ID del detalle

**Request Body (todos los campos opcionales):**
```json
{
  "amount": 10,
  "itemPrice": 12.00
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Producto A",
  "amount": 10,
  "description": "Descripción detallada del producto",
  "itemPrice": 12.00,
  "totalItem": 120.00,
  "billId": 1,
  "bill": {
    "id": 1,
    "billNumber": "0000001",
    "grandTotal": 225.00
  }
}
```

**Comportamiento Automático:**
- ✅ Si se actualiza `amount` o `itemPrice`, el `totalItem` se recalcula automáticamente
- ✅ El `grandTotal` de la factura se recalcula automáticamente
- ✅ Si se cambia el `billId`, ambas facturas (original y nueva) recalculan sus totales

---

### 6. Eliminar Detalle

**Endpoint:** `DELETE /bill-details/:id`  
**Autenticación:** Requerida  
**Roles:** Cualquier usuario autenticado

**Parámetros:**
- `id` (number): ID del detalle

**Response (204 No Content)**

**Comportamiento Automático:**
- ✅ El `grandTotal` de la factura se recalcula automáticamente después de eliminar el detalle

---

## 🔄 Flujo de Trabajo Completo - Crear Factura con Detalles

### Paso 1: Crear Factura
```http
POST /bill
Authorization: Bearer <token>
Content-Type: application/json

{
  "billNumber": "FAC-001",
  "date": "2026-02-03",
  "userId": 1
}
```

**Respuesta:**
```json
{
  "id": 1,
  "billNumber": "FAC-001",
  "date": "2026-02-03T00:00:00.000Z",
  "grandTotal": 0,
  "userId": 1
}
```

### Paso 2: Agregar Detalle 1
```http
POST /bill-details
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Laptop Dell",
  "amount": 2,
  "itemPrice": 850.00,
  "description": "Laptop Dell Inspiron 15",
  "billId": 1
}
```

**Respuesta:**
```json
{
  "id": 1,
  "name": "Laptop Dell",
  "amount": 2,
  "itemPrice": 850.00,
  "totalItem": 1700.00,
  "billId": 1
}
```

**Nota:** La factura ahora tiene `grandTotal = 1700.00`

### Paso 3: Agregar Detalle 2
```http
POST /bill-details
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Mouse Logitech",
  "amount": 5,
  "itemPrice": 25.50,
  "description": "Mouse inalámbrico Logitech",
  "billId": 1
}
```

**Respuesta:**
```json
{
  "id": 2,
  "name": "Mouse Logitech",
  "amount": 5,
  "itemPrice": 25.50,
  "totalItem": 127.50,
  "billId": 1
}
```

**Nota:** La factura ahora tiene `grandTotal = 1827.50` (1700.00 + 127.50)

### Paso 4: Ver Factura Completa
```http
GET /bill/1
Authorization: Bearer <token>
```

**Respuesta:**
```json
{
  "id": 1,
  "billNumber": "FAC-001",
  "date": "2026-02-03T00:00:00.000Z",
  "grandTotal": 1827.50,
  "userId": 1,
  "user": {
    "id": 1,
    "firstName": "Admin",
    "lastName": "Sistema",
    "email": "admin@factucore.com"
  },
  "details": [
    {
      "id": 1,
      "name": "Laptop Dell",
      "amount": 2,
      "itemPrice": 850.00,
      "totalItem": 1700.00,
      "description": "Laptop Dell Inspiron 15"
    },
    {
      "id": 2,
      "name": "Mouse Logitech",
      "amount": 5,
      "itemPrice": 25.50,
      "totalItem": 127.50,
      "description": "Mouse inalámbrico Logitech"
    }
  ]
}
```

---

## ⚙️ Características Especiales del Sistema

### 1. Cálculos Automáticos

#### Detalle de Factura:
- **`totalItem`** se calcula automáticamente como: `amount * itemPrice`
- Si no se proporciona, se calcula al crear o actualizar
- Ejemplo: `amount: 5, itemPrice: 10.50` → `totalItem: 52.50`

#### Factura:
- **`grandTotal`** se calcula automáticamente como la suma de todos los `totalItem` de sus detalles
- Se recalcula automáticamente cuando se:
  - Crea un detalle
  - Actualiza un detalle
  - Elimina un detalle
  - Cambia un detalle de una factura a otra

### 2. Transformaciones Automáticas

#### Fecha:
- Se acepta formato `YYYY-MM-DD` o `ISO-8601`
- Se transforma automáticamente a objeto `Date`
- Ejemplo: `"2026-02-03"` → `Date("2026-02-03T00:00:00.000Z")`

#### Email:
- Se convierte automáticamente a minúsculas
- Se eliminan espacios en blanco
- Ejemplo: `" ADMIN@Email.COM "` → `"admin@email.com"`

### 3. Validaciones Robustas

Todos los DTOs incluyen validaciones con mensajes descriptivos:
- Formatos de email
- Longitud mínima de contraseñas
- Tipos de datos numéricos
- Campos obligatorios
- Valores únicos (email, RUC, billNumber)

### 4. Relaciones en Cascada

- **Eliminar Usuario:** Elimina sus asignaciones de tiendas (UserShop)
- **Eliminar Tienda:** Elimina las asignaciones de usuarios
- **Eliminar Factura:** Elimina todos sus detalles automáticamente

---

## 🔒 Control de Acceso por Roles

### Matriz de Permisos

| Endpoint | Administrador | Gerente | Otros |
|----------|--------------|---------|-------|
| **Auth** |
| POST /auth/login | ✅ | ✅ | ✅ |
| POST /auth/register | ✅ | ✅ | ✅ |
| GET /auth/profile | ✅ | ✅ | ✅ |
| **Users** |
| POST /users | ✅ | ❌ | ❌ |
| GET /users | ✅ | ❌ | ❌ |
| GET /users/me | ✅ | ✅ | ✅ |
| GET /users/:id | ✅ | ✅ | ✅ |
| PATCH /users/:id | ✅ | ❌ | ❌ |
| DELETE /users/:id | ✅ | ❌ | ❌ |
| **Shops** |
| POST /shops | ✅ | ❌ | ❌ |
| GET /shops | ✅ | ❌ | ❌ |
| GET /shops/my-shops | ✅ | ✅ | ✅ |
| GET /shops/:id | ✅ | ✅ | ✅ |
| PATCH /shops/:id | ✅ | ❌ | ❌ |
| POST /shops/:id/assign-users | ✅ | ❌ | ❌ |
| DELETE /shops/:shopId/users/:userId | ✅ | ❌ | ❌ |
| DELETE /shops/:id | ✅ | ❌ | ❌ |
| **Roles** |
| POST /roles | ✅ | ❌ | ❌ |
| GET /roles | ✅ | ❌ | ❌ |
| GET /roles/:id | ✅ | ❌ | ❌ |
| PATCH /roles/:id | ✅ | ❌ | ❌ |
| DELETE /roles/:id | ✅ | ❌ | ❌ |
| **Bill** |
| POST /bill | ✅ | ✅ | ❌ |
| GET /bill | ✅ | ✅ | ❌ |
| GET /bill/user/:userId | ✅ | ✅ | ❌ |
| GET /bill/bill-number/:billNumber | ✅ | ✅ | ❌ |
| GET /bill/:id | ✅ | ✅ | ❌ |
| PATCH /bill/:id | ✅ | ✅ | ❌ |
| DELETE /bill/:id | ✅ | ❌ | ❌ |
| **Bill Details** |
| POST /bill-details | ✅ | ✅ | ✅ |
| GET /bill-details | ✅ | ✅ | ✅ |
| GET /bill-details/bill/:billId | ✅ | ✅ | ✅ |
| GET /bill-details/:id | ✅ | ✅ | ✅ |
| PATCH /bill-details/:id | ✅ | ✅ | ✅ |
| DELETE /bill-details/:id | ✅ | ✅ | ✅ |

---

## 📡 Códigos de Estado HTTP

### Códigos de Éxito
- **200 OK**: Solicitud exitosa
- **201 Created**: Recurso creado exitosamente
- **204 No Content**: Eliminación exitosa sin contenido de respuesta

### Códigos de Error
- **400 Bad Request**: Datos inválidos o violación de reglas de negocio
- **401 Unauthorized**: Token inválido o no proporcionado
- **403 Forbidden**: Usuario no tiene permisos para esta acción
- **404 Not Found**: Recurso no encontrado
- **409 Conflict**: Conflicto (ej: email duplicado)

---

## 🛠️ Configuración para Frontend

### Headers Requeridos

```javascript
// Para todas las peticiones autenticadas
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

### Manejo de Token

```javascript
// Guardar token después del login
localStorage.setItem('token', response.data.access_token);

// Recuperar token para peticiones
const token = localStorage.getItem('token');

// Eliminar token en logout
localStorage.removeItem('token');
```

### Interceptor de Axios (Recomendado)

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001'
});

// Agregar token automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

## 📋 Ejemplos de Uso para Frontend

### Login y Almacenar Token

```javascript
async function login(email, password) {
  try {
    const response = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', response.data.access_token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    return response.data;
  } catch (error) {
    console.error('Error en login:', error.response?.data);
    throw error;
  }
}
```

### Crear Factura con Detalles

```javascript
async function createBillWithDetails(billData, details) {
  try {
    // 1. Crear factura
    const billResponse = await api.post('/bill', {
      billNumber: billData.billNumber,
      date: billData.date,
      userId: billData.userId
    });
    
    const billId = billResponse.data.id;
    
    // 2. Agregar detalles
    const detailPromises = details.map(detail => 
      api.post('/bill-details', {
        ...detail,
        billId
      })
    );
    
    await Promise.all(detailPromises);
    
    // 3. Obtener factura completa con detalles
    const completeBill = await api.get(`/bill/${billId}`);
    return completeBill.data;
    
  } catch (error) {
    console.error('Error creando factura:', error);
    throw error;
  }
}
```

### Obtener Datos del Usuario Actual

```javascript
async function getCurrentUser() {
  try {
    const response = await api.get('/auth/profile');
    return response.data;
  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    throw error;
  }
}
```

---

## 🔍 Notas Importantes para el Desarrollo del Frontend

### 1. Gestión de Estado
- Guardar token y datos de usuario en localStorage o estado global (Redux, Zustand, Context)
- Implementar refresh automático de datos después de crear/actualizar/eliminar
- Manejar estados de carga (loading) y errores

### 2. Formularios
- Validar datos en el frontend antes de enviar (mismas reglas que el backend)
- Mostrar mensajes de error claros al usuario
- Formatear fechas correctamente antes de enviar

### 3. Permisos en UI
- Ocultar/deshabilitar botones según el rol del usuario
- Ejemplo: Solo mostrar "Eliminar" si el usuario es Administrador

### 4. Cálculos Automáticos
- No es necesario calcular `totalItem` en el frontend (se hace en backend)
- No es necesario calcular `grandTotal` en el frontend (se hace en backend)
- Mostrar estos valores tal como los devuelve la API

### 5. Fechas
- Usar componentes de calendario/datepicker
- Enviar en formato ISO: `YYYY-MM-DD`
- El backend transforma automáticamente

### 6. Listados y Tablas
- Implementar paginación si hay muchos registros
- Agregar filtros de búsqueda
- Ordenar por columnas relevantes

### 7. Feedback Visual
- Mostrar confirmaciones antes de eliminar
- Toast/Snackbar para acciones exitosas
- Mensajes de error claros y específicos

---

## 🚀 Endpoints de Desarrollo Rápido

Para probar rápidamente el sistema:

```bash
# 1. Login como administrador
POST http://localhost:3001/auth/login
{"email": "admin@factucore.com", "password": "Admin123!"}

# 2. Crear una tienda
POST http://localhost:3001/shops
Authorization: Bearer <token>

# 3. Crear una factura
POST http://localhost:3001/bill
Authorization: Bearer <token>

# 4. Agregar detalles a la factura
POST http://localhost:3001/bill-details
Authorization: Bearer <token>

# 5. Ver factura completa
GET http://localhost:3001/bill/1
Authorization: Bearer <token>
```

---

## ✨ Resumen de Características Clave

1. ✅ **Autenticación JWT** completa con roles
2. ✅ **Cálculos automáticos** de totales
3. ✅ **Validaciones robustas** en todos los DTOs
4. ✅ **Control de acceso** basado en roles
5. ✅ **Relaciones en cascada** para mantener integridad
6. ✅ **Transformaciones automáticas** de datos
7. ✅ **Manejo de errores** descriptivo y consistente
8. ✅ **Endpoints RESTful** bien estructurados

---

## 📞 Contacto y Soporte

Para cualquier duda o aclaración sobre la API, consultar el código fuente en:
- Controllers: `/src/modules/*/controllers`
- Services: `/src/modules/*/services`
- DTOs: `/src/modules/*/dto`
- Schema: `/prisma/schema.prisma`

---

**Última Actualización:** Febrero 3, 2026  
**Versión del Documento:** 1.0  
**Backend Version:** NestJS 10.x con Prisma 6.x
