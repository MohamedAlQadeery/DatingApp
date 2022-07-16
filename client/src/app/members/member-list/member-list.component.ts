import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IMember } from 'src/app/_models/member';
import { IPagination } from 'src/app/_models/pagination';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css'],
})
export class MemberListComponent implements OnInit {
  constructor(private _membersService: MembersService) {}
  members: IMember[];
  pagination: IPagination;
  pageNumber = 1;
  pageSize = 5;

  ngOnInit(): void {
    this.LoadMembers();
  }

  LoadMembers() {
    this._membersService
      .GetMembers(this.pageNumber, this.pageSize)
      .subscribe((response) => {
        this.members = response.result;
        this.pagination = response.pagination;
      });
  }

  PageChanged(event: any) {
    this.pageNumber = event.page;
    this.LoadMembers();
  }
}
