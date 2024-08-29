Si cuentan con algún problema respecto al error de "cr" con Prettier, utilicen en la terminal **"npm run lint"**.

#### Dependencias instaladas:

***@nestjs/config:*** Para manejar variables de entorno.  
***@prisma/client y prisma:*** Para interactuar con tu base de datos MySQL usando Prisma.  
***mysql2:*** El driver necesario para que Prisma se conecte a MySQL.

#### Configuración de Prisma:

***npx prisma init:***  
Esto creará una carpeta `prisma` con un archivo `schema.prisma`. Aquí es donde definirás tu esquema de base de datos.

#### Configura la conexión a MySQL:

En el archivo `.env` generado por Prisma, añade la cadena de conexión a tu base de datos MySQL:

```
DATABASE_URL="mysql://usuario:contraseña@localhost:3306/nombre_de_tu_base_de_datos"
```

Ahí reemplazarán: `usuario`, `contraseña`, `localhost`, `3306`, y `nombre_de_tu_base_de_datos` con los detalles correctos de la base de datos de ustedes.

#### Esquema de la base de datos en Prisma:

En el **schema.prisma** en la carpeta `prisma`, define el modelo para almacenar la información de los lugares cercanos. Este es el modelo que se encuentra ahí:

```prisma
model NearbyPlace {
  id           Int      @id @default(autoincrement())
  externalId   String
  address      String
  latitude     Float
  longitude    Float
  placeName    String
  placeType    String
  createdAt    DateTime @default(now())
}
```

Guarda el archivo y ejecuta **npx prisma migrate dev --name init** para crear la tabla en tu base de datos.

#### Interacción de la API:

Crea el modelo y el servicio.

**Service:** Este código utiliza el `HttpService` de Nest.js para realizar una solicitud a la API de Google Geocoding y convertir una dirección en coordenadas.

El método **getNearbyPlaces** se utiliza para interactuar con la API de Google Places usando las coordenadas obtenidas.

En el **controlador** (`places.controller.ts`), añade un endpoint que reciba el ID y la dirección, y luego utiliza el servicio para obtener los lugares cercanos y guardarlos en la base de datos.

#### Guardado en la base de datos:

En **places.service.ts** se utiliza **createMany** de Prisma para insertar múltiples registros de lugares cercanos en la base de datos en una sola operación.

---
