# Instrucciones

## Comandos para manipular los contenedores Docker

**Comando para conectarse al docker**
```
docker-compose up -d
```


**Comando para correr migraciones**
```
npx prisma migrate dev --name init
```

**Comando para correr seeders**
```
npx prisma db seed
```


**Todos los controladores estan protegidos, necesitan un token, realice un decorador por si algunas rutas llegasen a ser públicas, en el controlador solo hay que mandar llamar el controlador:**
```
@Public()
```