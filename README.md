# Instrucciones

***Nota: no es necesario tener instalado NodeJS, NestJS ni PostgreSQL, cree los contenedores para virtualizar todo el backend***

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

