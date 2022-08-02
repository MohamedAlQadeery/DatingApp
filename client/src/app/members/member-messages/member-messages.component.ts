import { Component, Input, OnInit } from '@angular/core';
import { IMessage } from 'src/app/_models/message';
import { MessagesService } from 'src/app/_services/messages.service';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css'],
})
export class MemberMessagesComponent implements OnInit {
  @Input() messages: IMessage[];
  @Input() username: string;
  constructor() {}

  ngOnInit(): void {}
}
