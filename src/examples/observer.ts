import { EventEmitter } from "events";
import express from "express";

class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

// Registrar los listeners para el evento 'newUser'
myEmitter.on("newUser", (user) => {
  console.log("Listener 1 - Nuevo usuario creado:", user);
});

myEmitter.on("newUser", (user) => {
  console.log("Listener 2 - Enviar correo de bienvenida a:", user.email);
});

myEmitter.on("newUser", (user) => {
  console.log("Listener 3 - Log de auditoría para usuario:", user.username);
});

const app = express();
app.use(express.json());

// Ruta para crear un nuevo usuario
app.post("/users", (req, res) => {
  const newUser = req.body;

  // Aquí normalmente guardarías el usuario en la base de datos.
  // Simulamos un usuario recién creado:
  console.log("Usuario guardado en la base de datos:", newUser);

  // Emitimos el evento 'newUser' y pasamos el objeto usuario a los listeners
  myEmitter.emit("newUser", newUser);

  // Respondemos al cliente
  res.status(201).json({ message: "Usuario creado", user: newUser });
});

// Configurar el servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
