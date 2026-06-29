import { io } from "socket.io-client";

const socket = io(process.env.REACT_APP_COMPLAINTS_APP_BE_URL);

export default socket;