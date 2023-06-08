import { useState } from 'react';
import Chat from './Chat';

import io from 'socket.io-client';

// const socket = io.connect(
//   process.env.NODE_ENV === 'development'
//     ? 'http://localhost:3001'
//     : 'https://chat-app-server-99ky.onrender.com',
//   {
//     withCredentials: true,
//   }
// );

const socket = io.connect({
  withCredentials: true,
  extraHeaders: {
    'Access-Control-Allow-Origin': 'https://chat-app-client-d6dk.onrender.com',
  },
});

function App() {
  const [username, setUsername] = useState('');
  const [roomID, setRoomID] = useState(null);
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {
    if (username && roomID) {
      socket.emit('join_room', roomID);
      setShowChat(true);
    }
  };

  const back = () => {
    setUsername('');
    setRoomID(null);
    setShowChat(false);
  };

  return (
    <div className="container grid max-w-screen-md gap-4 my-8">
      {showChat ? (
        <>
          <button className="flex gap-2 text-left" onClick={back}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
              />
            </svg>
            Back
          </button>

          <Chat socket={socket} username={username} roomID={roomID} />
        </>
      ) : (
        <form
          className="grid gap-4 p-4 rounded-md shadow-md bg-slate-50"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="grid">
            <label htmlFor="name">Name</label>

            <input
              className="p-4 outline-2 focus:outline-violet-500"
              type="text"
              id="name"
              placeholder="John Doe"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="grid">
            <label htmlFor="room">Room ID</label>

            <input
              className="p-4 outline-2 focus:outline-violet-500"
              type="number"
              id="room"
              placeholder="31415"
              required
              onChange={(e) => setRoomID(e.target.value)}
            />
          </div>

          <button
            className="p-4 font-bold text-white rounded shadow-md bg-violet-500"
            type="submit"
            onClick={joinRoom}
          >
            Enter
          </button>
        </form>
      )}
    </div>
  );
}

export default App;
