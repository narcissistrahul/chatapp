import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { io, Socket } from 'socket.io-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = "frontend";
  chatMessages: string[] = [];
  private socket: Socket;
  private userIdentifier: string; // User identifier/token;
  userName = '';
  message = '';
  messages: { sender: string, content: string, userId: string, userName: string }[] = [];

  constructor(private http: HttpClient) {
    // Generate a random user identifier/token
    this.userIdentifier = this.generateUserIdentifier();
    this.userName = this.userName

    // Establish Socket.IO connection with user identifier as a query parameter
    this.socket = io('http://localhost:3000', {
      query: { userIdentifier: this.userIdentifier }
    });

    // Listen for chat messages
    this.socket.on('chat message', (data: { sender: string, content: string, userId: string, userName: string }) => {
      this.messages.push(data);
    });
  }
  ngonInit() {
    this.fetchChatMessages();
  }

  fetchChatMessages() {
    this.http.get<string[]>('http://localhost:3000/messages').subscribe(
      (messages) => {
        this.chatMessages = messages;
      },
      (error) => {
        console.log('Error fetching chat messages:', error);
      }
    );
  }

  isUserNameBlank() {
    if (this.userName == "")
      return true
    else
      return false
  }

  sendMessage() {
    const data = {
      sender: this.userIdentifier, // Include user identifier as the sender
      content: this.message,
      userId: this.userIdentifier,
      userName: this.userName
    };

    // Send the chat message to the server
    this.socket.emit('chat message', data);

    // Clear the input field
    this.message = '';
  }


  downloadChatMessages() {
    this.http.get<any[]>('http://localhost:3000/messages').subscribe(
      (messages) => {
        if (messages.length === 0) {
          return;
        }

        const chatContent = messages
          .map((message) => `Mongo Object ID: ${message._id}. Message content: ${message.userName}: ${message.content}`)
          .join('\n');
        const element = document.createElement('a');
        const file = new Blob([chatContent], { type: 'text/plain;charset=utf-8' });
        element.href = URL.createObjectURL(file);
        element.download = 'chat.txt';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
      },
      (error) => {
        console.log('Error fetching chat messages:', error);
      }
    );
  }
  private generateUserIdentifier(): string {
    // Generate a random string for user identifier
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let userIdentifier = '';
    for (let i = 0; i < 10; i++) {
      userIdentifier += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return userIdentifier;
  }
}
