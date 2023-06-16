import { Component } from '@angular/core';
import { io } from 'socket.io-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private socket = io('http://localhost:3000');
  message = '';
  messages: { sender: string, content: string }[] = [];

  constructor() {
    // Listen for chat messages
    this.socket.on('chat message', (data: { sender: string, content: string }) => {
      this.messages.push(data);
    });
  }

  sendMessage() {
    const data = {
      sender: 'User',
      content: this.message
    };

    // Send the chat message to the server
    this.socket.emit('chat message', data);

    // Clear the input field
    this.message = '';
  }
}
