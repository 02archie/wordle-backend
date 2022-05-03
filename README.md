# Instrucciones

**_Nota: no es necesario tener instalado NodeJS, NestJS ni PostgreSQL, cree los contenedores para virtualizar todo el backend_**

**Al clonar el repositorio hay que crear el archivo .env con las variables e instrucciones que se encuentran en el archivo .env.example**

**Una vez ya teniendo ese archivo hay que ejecutar el siguiente comando**

```
npm install
```

## Comandos para manipular los contenedores Docker

**Comando para conectarse al docker**

```
docker-compose up -d
```

## Comandos para ejecutar migraciones y seeders

**Primero hay que conectarse al docker del backend para poder ejecutar las migraciones y los seeders**

```
docker exec -it api_wordle sh
```

**Despúes correr el comando para las migraciones**

```
npx prisma migrate dev --name init
```

**Por último correr el comando para los seeders**

```
npx prisma db seed
```

## Decoradores

**Todos los controladores estan protegidos, necesitan un token, realice un decorador por si algunas rutas llegasen a ser públicas, en el controlador solo hay que mandar llamar el controlador:**

```
@Public()
```

## Endpoints

- **Login**
- **_POST_ https://localhost:{port}/api/auth/login**

  Body:

  ```
  {
    "email": "admin@wordle.com",
    "password": "123456"
  }
  ```

- **Obtener letras en aleatorio, máximo y mínimo 5 caracteres**

  **_GET_ https://localhost:{port}/api/words**

- **Obtener los mejores 10 jugadores**

  **_GET_ https://localhost:{port}/api/games/best_players**

- **Obtener las partidas jugadas y ganadas por id del juego**

  **_GET_ https://localhost:{port}/api/games/stadistics/{id}**

- **Obtener datos del juego por id**

  **_GET_ https://localhost:{port}/api/games/{id}**

- **Crear el registro del juego**

  **_POST_ https://localhost:{port}/api/games**

  Body:

  ```
  {
    "player_id": 1,
  }
  ```

- **Actualizar el registro, aumentando los intentos, puntos, juegos ganados y partidas, todo esto por id del juego**

  **_PUT_ https://localhost:{port}/api/games**

  Body:

  ```
  {
    "id": 26,
    "attempts": 1,
    "points": 1,
    "games_won": 1,
    "word_user": "asjoa"
  }
  ```

**Se realizó una tarea programada que actualiza la palabra asignada al usuario en la base de datos, esta tarea programada se ejecuta cada 5 minutos y ejecuta un servicio llamado *updateFindWord()***

## Notas.

- **Todas las rutas estan protegidas, para iniciar sesion hay un usuario de prueba, que se crea al ejecutar los seeders, las credenciales son las siguientes**
  ```
  {
      "email": "admin@wordle.com",
      "password": "123456"
  }
  ```
  
- Se realizaron 3 contenedores, uno para el servidor de back end, otro para la base de datos hecha en postgresql y por último uno para adminer, para poder gestionar la base de datos de una manera visual.
