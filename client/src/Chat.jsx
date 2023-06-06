import React, { useState, useEffect } from 'react';

const Chat = ({ socket, username, roomID }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    if (message) {
      const time = new Date(Date.now());

      const messageData = {
        id: Date.now(),
        room: roomID,
        author: username,
        message: message,
        time: `${time.getHours() < 10 ? '0' : ''}${time.getHours()}:${
          time.getMinutes() < 10 ? '0' : ''
        }${time.getMinutes()}`,
      };

      await socket.emit('send_message', messageData);

      setMessages((messageList) => [...messageList, messageData]);
      setMessage('');
    }
  };

  useEffect(() => {
    socket.on('receive_message', (data) => {
      setMessages((messageList) => [...messageList, data]);
    });

    return () => {
      socket.removeListener('receive_message');
    };
  }, [socket]);

  return (
    <div className="grid gap-4">
      <h4 className="text-lg font-bold">Room: {roomID}</h4>

      <div className="grid gap-4">
        {messages.map((message, i) => {
          return (
            <div
              className={`grid max-w-[300px] ${
                message.author === username
                  ? 'justify-self-end justify-items-end'
                  : 'justify-self-start justify-items-start'
              }`}
              key={i}
            >
              <span className="text-xs">
                {message.author === username ? 'You' : message.author}
              </span>

              <div
                className={`grid p-4 rounded-lg relative ${
                  message.author === username ? 'bg-blue-200' : 'bg-green-200'
                }`}
              >
                {message.message}
              </div>

              <span className="text-xs">{message.time}</span>
            </div>
          );
        })}
      </div>

      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
      >
        <input
          className="flex-1 p-4 transition border-2 rounded focus:outline-black"
          type="text"
          placeholder="Hello World!"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button className="p-4 transition border-2 rounded group hover:border-black disabled:opacity-25">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            disabled={message}
            className={`w-6 h-6 transition ${
              message.length ? 'stroke-black' : 'stroke-gray-300'
            }`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
            />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default Chat;
