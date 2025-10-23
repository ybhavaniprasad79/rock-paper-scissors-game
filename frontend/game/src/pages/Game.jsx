import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import socket from "../socket";
import { usePlayer } from "../context/PlayerContext";

const choices = ["rock", "paper", "scissors"];

const Game = () => {
  const { player } = usePlayer();
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [players, setPlayers] = useState([]);
  const [scores, setScores] = useState([]);
  const [roundResult, setRoundResult] = useState(null);
  const [moves, setMoves] = useState({});
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState("");
  const [hasPicked, setHasPicked] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [rematchRequested, setRematchRequested] = useState(false);
  const [rematchInvite, setRematchInvite] = useState(null); // { from: id, name: string }
  const [rematchDeclinedMsg, setRematchDeclinedMsg] = useState("");

  useEffect(() => {
    // Handle initial join and updates to player list
    socket.on("both-players-joined", ({ players: ps, scores: sc }) => {
      console.log("Both players joined:", ps);
      setPlayers(ps);
      setScores(sc);
    });
    
    // Keep players list updated when players change
    socket.on("update-players", ({ players: ps }) => {
      console.log("Players updated:", ps);
      setPlayers(ps);
    });

    socket.on("round-result", ({ moves, winnerId, scores }) => {
      setMoves(moves);
      setScores(scores);
      setRoundResult(winnerId);
      setHasPicked(false);
      setShowResult(true);
    });

    socket.on("rematch-start", () => {
      setRoundResult(null);
      setMoves({});
      setHasPicked(false);
      setShowResult(false);
      setRematchRequested(false);
      setRematchInvite(null);
      setRematchDeclinedMsg("");
    });

    socket.on("rematch-invite", ({ fromId, fromName }) => {
      setRematchInvite({ from: fromId, name: fromName });
    });

    socket.on("rematch-declined", ({ name }) => {
      setRematchDeclinedMsg(`${name} has declined your invitation.`);
      setRematchRequested(false);
    });

    const handleChat = (msg) => {
      setChat((prev) => [...prev, msg]);
    };

    socket.on("chat-message", handleChat);

    socket.on("opponent-left", () => {
      alert("Opponent left the game.");
      navigate("/");
    });

    setChat([]);

    return () => {
      socket.off("chat-message", handleChat);
      socket.off("both-players-joined");
      socket.off("update-players");
      socket.off("round-result");
      socket.off("rematch-start");
      socket.off("opponent-left");
      socket.off("rematch-invite");
      socket.off("rematch-declined");
    };
  }, [navigate]);

  const sendMove = (choice) => {
    if (!hasPicked && roundResult === null) {
      socket.emit("player-move", choice);
      setHasPicked(true);
    }
  };

  const rematch = () => {
    console.log("Current players:", players);
    console.log("Current socket ID:", socket.id);
    
    // Request current players from server before sending invite
    socket.emit("request-players", { roomId }, (currentPlayers) => {
      if (!currentPlayers || currentPlayers.length < 2) {
        alert("Waiting for opponent to reconnect...");
        return;
      }
      
      const opponent = currentPlayers.find(p => p.id !== socket.id);
      if (opponent) {
        console.log("Found opponent:", opponent);
        socket.emit("rematch-invite", { 
          to: opponent.id, 
          fromId: socket.id,
          fromName: player.name 
        });
        setRematchRequested(true);
      } else {
        console.error("Players in room:", currentPlayers);
        alert("Opponent not found for rematch. Try refreshing the page.");
      }
    });
  };

  const sendChat = () => {
    if (message.trim()) {
      socket.emit("chat-message", message);
      setMessage("");
    }
  };

  const getPlayerName = (id) =>
    players.find((p) => p.id === id)?.name || "Unknown";

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col md:flex-row">
      {/* Game Panel */}
      <div className="flex-1 flex flex-col items-center p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        {/* Player Name */}
        <div className="mb-2 text-lg text-white font-medium">
          Welcome,{" "}
          <span className="text-indigo-400 font-bold">{player.name}</span>
        </div>
        {/* Room Code */}
        <div className="mb-4">
          <span className="text-sm uppercase text-gray-400">Room</span>
          <div className="text-3xl font-bold bg-gray-800 px-4 py-2 rounded-lg text-indigo-400 shadow">
            #{roomId}
          </div>
        </div>

        {/* Scoreboard
  <div className="w-full max-w-md flex justify-between mb-6 bg-gray-800 p-4 rounded-xl shadow-lg">
    {players.map((p) => (
      <div
        key={p.id}
        className={`flex-1 text-center ${
          p.id === socket.id ? "text-blue-400" : "text-pink-400"
        }`}
      >
        <div className="text-2xl">
          {p.id === socket.id ? "🧍 You" : "🧑 Opponent"}
        </div>
        <div className="text-lg font-bold mt-1">{p.name}</div>
        <div className="text-sm mt-1 text-gray-300">
          Score: {scores.find((s) => s[0] === p.id)?.[1] ?? 0}
        </div>
      </div>
    ))}
  </div> */}

        {/* Choice Buttons */}
        {!showResult && (
          <div className="flex space-x-6 my-4">
            {choices.map((choice) => (
              <button
                key={choice}
                onClick={() => sendMove(choice)}
                disabled={hasPicked || roundResult !== null}
                className={`px-6 py-3 rounded-full capitalize text-lg font-semibold transition-all duration-200 ${
                  hasPicked || roundResult !== null
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:scale-105"
                }`}
              >
                ✊ {choice}
              </button>
            ))}
          </div>
        )}

        {/* Result Panel */}
        {showResult && (
          <div className="mt-6 text-center bg-gray-800 p-6 rounded-xl shadow-md w-full max-w-md">
            <h3 className="text-2xl font-bold mb-3 text-green-400">
              {roundResult === socket.id
                ? "🎉 You won!"
                : roundResult === null
                ? "🤝 Draw!"
                : "😞 You lost!"}
            </h3>
            <div className="flex justify-center gap-8 mb-4">
              {/* Show both players' choices using moves object */}
              {Object.keys(moves).length === 2 && (
                <>
                  <div className="bg-gray-700 rounded-lg px-4 py-2">
                    <div className="font-semibold text-indigo-300">You</div>
                    <div className="text-lg mt-1">{moves[socket.id]}</div>
                  </div>
                  <div className="bg-gray-700 rounded-lg px-4 py-2">
                    <div className="font-semibold text-pink-300">Opponent</div>
                    <div className="text-lg mt-1">{Object.entries(moves).find(([id]) => id !== socket.id)?.[1]}</div>
                  </div>
                </>
              )}
            </div>
            {/* Rematch logic UI */}
            {rematchDeclinedMsg && (
              <div className="mb-3 text-red-400 font-semibold">{rematchDeclinedMsg}</div>
            )}
            {rematchInvite && rematchInvite.from !== socket.id ? (
              <div className="mb-3">
                <div className="text-yellow-300 font-semibold mb-2">{rematchInvite.name} invited you for a rematch!</div>
                <button
                  onClick={() => {
                    socket.emit("rematch-response", { accept: true, to: rematchInvite.from });
                    setRematchInvite(null);
                  }}
                  className="px-6 py-2 rounded-full bg-green-600 hover:bg-green-700 text-white font-semibold text-lg mr-2"
                >
                  Accept
                </button>
                <button
                  onClick={() => {
                    socket.emit("rematch-response", { accept: false, to: rematchInvite.from, name: player.name });
                    setRematchInvite(null);
                  }}
                  className="px-6 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white font-semibold text-lg"
                >
                  Decline
                </button>
              </div>
            ) : rematchRequested ? (
              <div className="mb-3 text-blue-400 font-semibold">Waiting for opponent to respond...</div>
            ) : (
              <button
                onClick={rematch}
                className="px-8 py-2 rounded-full bg-green-600 hover:bg-green-700 text-white font-semibold text-lg transition hover:scale-105 shadow"
              >
                🔁 Rematch
              </button>
            )}
          </div>
        )}
      </div>

      {/* Chat Panel */}
      <div className="w-full md:w-1/3 border-l border-gray-700 p-4 flex flex-col bg-gray-800">
        <h3 className="text-xl mb-3 font-semibold text-center border-b border-gray-600 pb-2">
          💬 Chat
        </h3>

        <div className="flex-1 overflow-y-auto space-y-3 px-1 py-2 bg-gray-900 rounded shadow-inner">
          {chat.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.sender === player.name ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] px-4 py-2 rounded-xl text-sm shadow-md ${
                  msg.sender === player.name
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-gray-700 text-white rounded-bl-none"
                }`}
              >
                <span className="block text-xs font-semibold mb-1 text-white/70">
                  {msg.sender} : {msg.text}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex mt-3">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type message..."
            className="flex-1 px-3 py-2 rounded-l text-black focus:outline-none"
          />
          <button
            onClick={sendChat}
            className="bg-blue-600 px-5 py-2 rounded-r hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Game;
