import { Component, OnInit } from '@angular/core';
import { IMessage } from '../_models/message';
import { IPagination } from '../_models/pagination';
import { MessagesService } from '../_services/messages.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css'],
})
export class MessagesComponent implements OnInit {
  messages: IMessage[];
  pagination: IPagination;
  pageNumber = 1;
  pageSize = 5;
  container = 'Inbox';

  constructor(private _messageService: MessagesService) {}

  ngOnInit(): void {
    this.LoadMessages();
  }

  LoadMessages() {
    return this._messageService
      .GetMessages(this.pageNumber, this.pageSize, this.container)
      .subscribe((res) => {
        this.messages = res.result;
        this.pagination = res.pagination;
      });
  }

  PageChanged(event: any) {
    if (this.pageNumber !== event.page) {
      this.pageNumber = event.page;
      this.LoadMessages();
    }
  }
}
