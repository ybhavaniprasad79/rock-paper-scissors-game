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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex flex-col items-center justify-center px-4 py-8">
      <div className="max-w-4xl w-full mx-auto flex flex-col md:flex-row gap-8 items-center">
        {/* Left side - Game Title and Description */}
        <div className="w-full md:w-1/2 text-center md:text-left">
          <h1 className="text-5xl font-bold mb-4 text-amber-800">
            Rock Paper Scissors
          </h1>
          <p className="text-lg text-amber-700 mb-6">
            Challenge your friends to an exciting game of Rock Paper Scissors! Create a room or join one to start playing.
          </p>
          <div className="hidden md:flex justify-start space-x-4">
            <span className="inline-flex items-center text-amber-600">
              <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/>
              </svg>
              Multiplayer
            </span>
            <span className="inline-flex items-center text-amber-600">
              <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"/>
              </svg>
              Real-time
            </span>
          </div>
        </div>

        {/* Right side - Game Controls */}
        <div className="w-full md:w-1/2">
          <div className="bg-amber-50/50 backdrop-blur-sm border border-amber-200 shadow-xl rounded-xl p-8">
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mb-4 px-4 py-3 rounded-lg bg-amber-50 border border-amber-300 
              text-amber-900 placeholder-amber-400 focus:outline-none focus:ring-2 
              focus:ring-amber-500 focus:border-transparent transition-all duration-200"
            />

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-amber-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-amber-50 text-amber-600">Choose an Option</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Enter Room Code"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-lg bg-amber-50 border border-amber-300 
                  text-amber-900 placeholder-amber-400 focus:outline-none focus:ring-2 
                  focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                />
                <button
                  onClick={joinRoom}
                  className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold 
                  rounded-lg shadow-lg hover:shadow-amber-300/50 transition-all duration-200"
                >
                  Join Game
                </button>
              </div>

              <button
                onClick={createRoom}
                className="w-full px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold 
                rounded-lg shadow-lg hover:shadow-amber-300/50 transition-all duration-200"
              >
                Create New Game
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
