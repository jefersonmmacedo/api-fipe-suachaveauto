import { server } from "./http";
import "./websocket"

const port = process.env.PORT || 4444;

server.listen(port, () => {
  console.log(`Server initialized! Access the link: http://localhost:${port}`);
  console.log(process.env.STRINGCONNECTION);
});