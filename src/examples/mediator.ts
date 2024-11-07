import express, { Request, Response } from "express";

class ChatRoom {
  private users: User[] = [];

  // Agregar un usuario a la sala de chat
  addUser(user: User): void {
    this.users.push(user);
  }

  // Enviar mensaje a todos los usuarios conectados
  showMessage(user: User, message: string): void {
    // Mostrar el mensaje en consola (simulando la comunicación)
    console.log(`[${user.name}]: ${message}`);

    // Notificar a todos los demás usuarios de la sala
    this.users.forEach((u) => {
      if (u !== user) {
        // No enviamos el mensaje al usuario que lo envió
        u.receiveMessage(user, message);
      }
    });
  }
}

class User {
  constructor(public name: string, public chatroom: ChatRoom) {}

  send(message: string): void {
    this.chatroom.showMessage(this, message);
  }

  // Recibir un mensaje del chatroom
  receiveMessage(sender: User, message: string): void {
    console.log(
      `${this.name} recibió un mensaje de ${sender.name}: ${message}`
    );
  }
}

// Inicializamos la sala de chat (mediador)
const chatroom = new ChatRoom();

// Inicializamos Express
const app = express();
const port = 3000;

// Middleware para analizar el cuerpo de la solicitud como JSON
app.use(express.json());

// Ruta para enviar un mensaje
app.post("/send", (req: Request, res: Response) => {
  const { name, message } = req.body;
  if (!name || !message) {
    res.status(400).json({ error: "El nombre y el mensaje son requeridos" });
    return;
  }

  // Creamos un usuario y lo registramos en la sala de chat
  const user = new User(name, chatroom);
  user.send(message);

  // Respuesta al cliente
  res.status(200).json({ status: "Mensaje enviado" });
});

// Ruta para agregar un usuario
app.post("/addUser", (req: Request, res: Response) => {
  const { name } = req.body;
  if (!name) {
    res.status(400).json({ error: "El nombre es requerido" });
    return;
  }

  // Crear un nuevo usuario y agregarlo a la sala
  const user = new User(name, chatroom);
  chatroom.addUser(user);
  res.status(200).json({ status: `${name} ha sido agregado a la sala` });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
