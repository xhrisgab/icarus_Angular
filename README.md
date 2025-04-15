# Icarus

Interfaz para la estacion terrena del Proyecto Icarus. Este permite conectarse a un puerto COM y recibir datos del CanSat.

## Instalacion

El proyecto esta realizado con [Angular CLI](https://github.com/angular/angular-cli) version 18.2.9.

Asegurate de copiar (clonar) el proyecto y ejecutar:

```bash
  npm install
```
Para instalar las dependencias de desarrollo y librerias.


## Servidor de Desarrollo

Ejecuta el comando `ng serve` para generar un servidor local. Navega a la direccion `http://localhost:4200/`. La aplicacion automaticamente correra y se recargara si realizas algun cambio.

## API para guardar datos

El proyecto usa una API para leer y guardar datos, para ello sera necesario instalar [json-server](https://www.npmjs.com/package/json-server). Una vez instalado en tu equipo en la raiz del proyecto esta el archivo `./db.json`. realiza una copia de seguridad y copia este archivo a una ruta alterna.

```bash
  mkdir baseDatos
  cp ./db.json ./baseDatos
  cd ./baseDatos
  json-server db.json
```
por defecto la API usa la ruta `http://localhost:3000`.

## Build

Corre el comando `ng build` para generar los archivos de produccion y poder desplegar el proyecto en un servidor. los archivos se guardan por defecto en la ruta `dist/`.

## Ruta del prueba del proyecto

Actualmente el proyecto esta alojado en el sitio: https://icarus-team.netlify.app/#/control

## Mayor informacion y ayuda

Para mayor informacion o ayuda respecto al proyecto, contactanos a travez de nuestras redes sociales:

[Facebook](https://www.facebook.com/profile.php?id=61574729484414)

