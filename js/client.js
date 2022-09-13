const socket = io('https://chat-app102.herokuapp.com/', { transports: ['websocket'] });
//connected to server via html script socket.io\socket.io.js

//Get DOM elements in respective js variable 
const form = document.getElementById('sendContainer');
const messageInput = document.getElementById('messageInp');
const messaegContainer = document.querySelector('.container');
// audio that will play on recieve messages
var audio = new Audio('ting.mp3');

//Function to append event info to container
const append = (user, message, type, position) => {
    const messageElement = document.createElement('div');
    const messageContent = document.createElement('div');
    messageContent.innerHTML = message;
    if (type == 'message') {
        
        if (user != 'You'){
            const messageTitle = document.createElement('div');
            messageTitle.innerHTML = user;
            messageTitle.classList.add('messageHead');
            messageElement.append(messageTitle);
        }
        messageElement.classList.add(position);
        messageElement.classList.add('message');

    } else if (type == 'joined' || type == 'disconnected') {
        messageElement.classList.add('centerNotify');
    }
    messageElement.append(messageContent);
    messaegContainer.append(messageElement);
    if (position == 'left') {
        audio.play();
    }
}

//Ask new user for his/her name and let the server know so it can alert all
const userName = prompt("Enter yourname to join");
//let others know new user joined
socket.emit('new-user-joined', userName);

//If new user joined, recieve event from the server
socket.on('user-joined', userName => {
    append(`${userName}`,`${userName} joined the chat`, 'joined', 'left');
})
//if user sends a message, receive it and append 
socket.on('recieve', data => {
    // var username= data.name.bold();
    append(`${data.name}`,`${data.message}`, 'message', 'left');
})
//if a user leaves chat, append the info to the container
socket.on('left', data => {
    append(`${data}`,`${data} left the chat`, 'disconnected', 'left');
})

//if form gets submitted, send server the message
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append('You',`${message}`, 'message', 'right');
    socket.emit('send', message);
    messageInput.value = '';
})
