import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { IMessage } from 'src/app/_models/message';
import { MessagesService } from 'src/app/_services/messages.service';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css'],
})
export class MemberMessagesComponent implements OnInit {
  @ViewChild('messageForm') messageForm: NgForm;
  @Input() messages: IMessage[];
  @Input() username: string;
  content: string;

  constructor(private _messagesService: MessagesService) {}

  ngOnInit(): void {}

  SendMessage() {
    this._messagesService
      .SendMessage(this.username, this.content)
      .subscribe((msg) => {
        this.messages.push(msg);
        this.messageForm.reset();
      });
  }
}
