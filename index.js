//Node server which will handle socket io connections
const io = require('socket.io')(8000);//io initialised
const users = {};
//socket.io is an instance of http, which listens to incoming events
//io.on is an socket.io instance which listens to many socket connections

io.on('connection', socket => {
    //socket on listens to events with particular connection
    //If any new user joins, let other users connected to server know
    socket.on('new-user-joined', userName => {
        users[socket.id] = userName; //users array updated
        socket.broadcast.emit('user-joined', userName);
        //this will be handled on client side
    });
//If someone sends a message broadcast it to other people
    socket.on('send', message => {
        socket.broadcast.emit('recieve', { message: message, name: users[socket.id] });
    });
    //If someone leaves thechat, let others know
    socket.on('disconnect', message => {//Disconnect event is built in, not custom name
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });
})

//send, receive, new-user-joined, all these are custom event names 
