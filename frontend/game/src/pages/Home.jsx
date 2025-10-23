import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlayer } from '../context/PlayerContext';

const Home = () => {
  const [name, setName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const navigate = useNavigate();
  const { setPlayer } = usePlayer();

  const createRoom = () => {
    if (!name.trim()) return alert("Enter your name");
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setPlayer({ name, roomId: code });
    navigate(`/lobby/${code}`);
  };

  const joinRoom = () => {
    if (!name.trim()) return alert("Enter your name");
    if (roomCode.length !== 6) return alert("Enter valid room code");
    setPlayer({ name, roomId: roomCode });
    navigate(`/lobby/${roomCode}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white border border-gray-200 shadow-lg rounded-lg p-8 w-full max-w-md text-center">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">
          Rock Paper Scissors
        </h1>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full mb-4 px-4 py-3 rounded-md border border-gray-300 text-gray-700 placeholder-gray-500 
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          />

          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Room Code"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              className="flex-1 px-4 py-3 rounded-md border border-gray-300 text-gray-700 placeholder-gray-500 
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
            <button
              onClick={joinRoom}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md 
              shadow-sm transition-colors duration-200"
            >
              Join
            </button>
          </div>
        </div>

        <div className="relative my-6">
          <hr className="border-gray-200" />
          <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-white px-4 text-sm text-gray-500">
            or
          </span>
        </div>

        <button
          onClick={createRoom}
          className="w-full px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-md 
          shadow-sm transition-colors duration-200"
        >
          Create New Room
        </button>
      </div>
    </div>
  );
};

export default Home;
