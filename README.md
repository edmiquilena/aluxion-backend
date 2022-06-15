# Prueba Aluxion FullStack: Backend

A continuacion mi interpretacion para la prueba en la seccion de backend.
La tecnologia utilizada fue **NodeJS** con tipeo (TypeScript) junto a **NestJS** por su escalabilidad.
Con NestJS resulta mas sencillo expandir a futuro los endpoints, y el versionamiento.

Para la database fue utilizada **MongoDB**, ya que su estructura es facil expandir, y trabajar a futuro con mayor cantidad de datos.
Suponiendo el caso de querer introducir nuevas funciones, por ejemplo, contar la cantidad de descargas de imagenes, agregar una funcion de "Me gusta", esto en una base de datos relacional representaria la creacion de muchas entradas, con Mongo se puede hacer uso de patterns para agilizar este proceso, como el caso de Buckets y mas.

La documentacion viene dada por **Swagger** y las pruebas por medio de **Jest**.

## Definicion de prueba
- ✔️ Login
- ✔️Registro (Con la contraseña encriptada)
- ✔️ Olvide contraseña con envío de email.
- ✔️ Subida de archivos (AWS S3)
- ✔️ Bajada de archivos (AWS S3)
- ✔️ Gestor de archivos donde puedes: cambiar nombre y obtener enlace de
archivo. (AWS S3)
- ✔️ Integrar un buscador de imagenes online usando una API externa
(Unsplash por ejemplo)
- ✔️ Subir una imagen proveniente de una API externa directo a S3 (Es
decir, sin que el usuario tenga que bajar la imagen en su local y luego
subirla manualmente)

## Instalación

Primero es necesario clonar el repositorio, o descargarlo.

```bash
git clone https://github.com/edmiquilena/aluxion-backend.git
```
En la carpeta principal se encuentran todos los archivos para correr el servidor.


Instalar las dependencias con ``npm`` o ``yarn``
```
npm install
```
o
```
yarn install
```

## Env Variables

Se debe crear un archivo ``.env`` en el directorio principal que incluya:
```bash
DB_URI=[URI A MONGO]
JWT_secret=
JWT_TIMEOUT=
SMTP_USER=
SMTP_PASS=
SMTP_HOST=
SMTP_PORT=
AWS_ACCESS_KEY=
AWS_SECRET_KEY=
AWS_BUCKET=
UNSPLASH_ACCESS_TOKEN=
MONGO_USERNAME=
MONGO_PASSWORD=
MONGO_DATABASE=
```
**Todas** las variables son requeridas para su funcionamiento. 
Ejemplo de URI:
``DB_URI=mongodb://root:pass@mongo_db:27017/db?authSource=admin``
Nota: ``mongo_db`` dentro de la URI es constante para hacer referencia si se ejecuta por medio de docker.
Si se utiliza alguna externa, puede ser sustiuda completamente.

## Deployment

Existen dos formas de correr el servidor en modo produccion.

### Docker compose

```bash
docker compose up [-d]
```

### Docker 
Esto es util en el caso de utilizar una base de datos externa, asi no es necesario crear una replica de mongDB en el servidor
```bash
 docker build -t nestserver . 
 docker run --name nestServer -p 3000:3000 nestserver:latest
```
Es necesario crear las variables con anterioridad.
### nest-cli
O directamente con la linea de commandos de NestJS



```bash
yarn build
yarn start:prod
```
En modo dev:
```bash
yarn build
yarn start:dev
```



## Documentation
Al correr el servidor tanto en produccion, como en development NestJS crea el endpoint de la documentacion con Swagger
Puede ser accedido en el navegador en:
```
http://localhost:3000/docs
```

## Pruebas unitarias

Para correr las pruebas unitarias usar:

```bash
  npm run test
```

```bash
  yarn test
```

(Solo algunos servicios poseen pruebas unitarias basicas)