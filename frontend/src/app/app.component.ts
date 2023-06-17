import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { io } from 'socket.io-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  chatMessages: string[] = [];
  private socket = io('http://localhost:3000');
  message = '';
  messages: { sender: string, content: string }[] = [];

  constructor(private http: HttpClient) {
    // Listen for chat messages
    this.socket.on('chat message', (data: { sender: string, content: string }) => {
      this.messages.push(data);
    });
  }
  ngonInit(){
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


  downloadChatMessages() {
    this.http.get<any[]>('http://localhost:3000/messages/all').subscribe(
      (messages) => {
        if (messages.length === 0) {
          return;
        }
  
        const chatContent = messages.map((message) => `${message.sender}: ${message.content}`).join('\n');
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
}
