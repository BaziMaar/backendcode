const games = {};
const playerGameMap = {}; // To track which game each player is in
let gameIdCounter = 100000; // Initialize a gameId counter.

const generateController = (io) => {
  io.on('connection', (socket) => {
    console.log('A user connected', socket.id);

    socket.on('joinGame', (playerData) => {
      const { amount,game_name } = playerData; 
      let gameId;
      for (const id in games) {
        console.log(games[id]);
        if (games[id].players.length < 2 && games[id].amount === amount && games[id].game_name==game_name) {
          gameId = id;
          break;
        }
      }
      if (!gameId) {
        gameIdCounter++; 
        gameId = gameIdCounter;
        games[gameId] = { 
          players: [{ ...playerData, socketId: socket.id }],
          amount,
          game_name
        };
      } else {
        // Add player to the found game
        games[gameId].players.push({ ...playerData, socketId: socket.id });
      }

      // Track the game this player joined
      playerGameMap[socket.id] = gameId;

      // Emit the updated game list to all clients
      io.emit('gameList', games);
    });

    // Listen for player leaving a game
    socket.on('leaveGame', (playerData) => {
      const game = games[playerData.gameId];

      if (game) {
        // Remove the player from the game
        game.players = game.players.filter(p => p.name !== playerData.name);
        io.emit('GameDeleted',games[playerData.gameId]);
        delete games[playerData.gameId];
        delete playerGameMap[socket.id];
        io.emit('gameList', games);
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected', socket.id);

      const gameId = playerGameMap[socket.id];
      if (gameId) {
        const game = games[gameId];
        if (game) {
          // Remove the disconnected player from the game
          game.players = game.players.filter(p => p.socketId !== socket.id);

          // If the game is empty after removal, delete the game
          
          if (game.players.length === 0||game.players.length===1) {
            delete games[gameId];
          }

          // Remove the player from the player-game map
          delete playerGameMap[socket.id];

          // Emit the updated game list to all clients
          io.emit('gameList', games);
          io.emit('gameLeft',game);
        }
      }
    });

    // Emit the current game list to the client
    socket.emit('gameList', games);
  });
};
const sendData = (io) => {
  io.on('connection', (socket) => {
    socket.on('diceMove', (moveData) => {
      const { gameId, move } = moveData; // Assuming moveData includes gameId and move information
      const game = games[gameId];

        // Emit the move to the specific players in the game
          io.emit('playerMoved', { gameId,move }); // Replace 'playerMoved' with your event name

    });
  });
};


module.exports = { generateController,sendData };
