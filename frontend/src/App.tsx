import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import io from 'socket.io-client';

const GET_MESSAGES = gql`
  query GetMessages {
    messages {
      id
      user
      content
      timestamp
    }
  }
`;

const CREATE_MESSAGE = gql`
  mutation CreateMessage($user: String!, $content: String!) {
    createMessage(user: $user, content: $content) {
      id
      user
      content
      timestamp
    }
  }
`;

const SOCKET_SERVER_URL = 'http://localhost:4000';

function App() {
  const [user, setUser] = useState('');
  const [content, setContent] = useState('');
  const { data, loading, error } = useQuery(GET_MESSAGES);
  const [createMessage] = useMutation(CREATE_MESSAGE, {
    refetchQueries: [{ query: GET_MESSAGES }],
  });
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    if (data) {
      setMessages(data.messages);
    }
  }, [data]);

  useEffect(() => {
    const socket = io(SOCKET_SERVER_URL);
    socket.on('receiveMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user && content) {
      await createMessage({ variables: { user, content } });
      setContent('');
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="m-auto flex flex-col w-full max-w-2xl h-full border rounded-lg shadow-lg bg-white">
        <div className="flex-grow p-4 overflow-y-auto">
          {loading && <p>Loading...</p>}
          {error && <p>Error: {error.message}</p>}
          {messages.map((msg) => (
            <div key={msg.id} className="mb-4">
              <p className="font-bold">{msg.user}</p>
              <p>{msg.content}</p>
              <p className="text-xs text-gray-500">{new Date(msg.timestamp).toDateString()}</p>
            </div>
          ))}
        </div>
        <div className="p-4 bg-gray-200">
          <form onSubmit={handleSendMessage} className="flex">
            <input
              type="text"
              placeholder="Your name"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              className="p-2 border rounded-l-lg w-1/4"
            />
            <input
              type="text"
              placeholder="Type a message..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="p-2 border-t border-b flex-grow"
            />
            <button type="submit" className="bg-blue-500 text-white p-2 rounded-r-lg">
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;