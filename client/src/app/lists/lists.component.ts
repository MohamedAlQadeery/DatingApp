import { Component, OnInit } from '@angular/core';
import { IMember } from '../_models/member';
import { IPagination } from '../_models/pagination';
import { MembersService } from '../_services/members.service';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css'],
})
export class ListsComponent implements OnInit {
  members: Partial<IMember[]>;
  type = 'liked';
  pagination: IPagination;
  pageNumber = 1;
  pageSize = 5;
  constructor(private _memberService: MembersService) {}

  ngOnInit(): void {
    this.LoadLikes();
  }

  LoadLikes() {
    this._memberService
      .GetUserLikes(this.type, this.pageNumber, this.pageSize)
      .subscribe((response) => {
        this.members = response.result;
        this.pagination = response.pagination;
      });
  }

  PageChanged(event: any) {
    this.pageNumber = event.page;
    this.LoadLikes();
  }
}
