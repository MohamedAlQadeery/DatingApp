import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
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
  container = 'Unread';
  isLoading = false;

  constructor(
    private _messageService: MessagesService,
    private _tostr: ToastrService
  ) {}

  ngOnInit(): void {
    this.LoadMessages();
  }

  LoadMessages() {
    this.isLoading = true;
    return this._messageService
      .GetMessages(this.pageNumber, this.pageSize, this.container)
      .subscribe((res) => {
        this.messages = res.result;
        this.pagination = res.pagination;
        this.isLoading = false;
      });
  }

  PageChanged(event: any) {
    if (this.pageNumber !== event.page) {
      this.pageNumber = event.page;
      this.LoadMessages();
    }
  }

  DeleteMessage(id: number) {
    this._messageService.DeleteMessage(id).subscribe(() => {
      this.messages.splice(
        this.messages.findIndex((m) => m.id == id),
        1
      );
      this._tostr.success('Messages deleted successfully');
    });
  }
}
