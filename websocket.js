// websocket.js
const WebSocket = require('ws');


module.exports = function setupWebSocket(server) {
    const wss = new WebSocket.Server({ noServer: true });

    // Event listener for when a WebSocket connection is established
    wss.on('connection', (socket) => {
        console.log('WebSocket connection established');

        // Event listener for receiving messages from the WebSocket client
        socket.on('message', (message) => {
            console.log('Received message:', message);
            // Handle the received message as needed
        });

        // Event listener for when the WebSocket connection is closed
        socket.on('close', () => {
            console.log('WebSocket connection closed');
        });

        // ... Other WebSocket-related code and event handlers
    });

    // Upgrade the HTTP server request to a WebSocket connection
    server.on('upgrade', (request, socket, head) => {
        wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit('connection', ws, request);
        });
    });
};
