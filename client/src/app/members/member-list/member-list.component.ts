import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { IMember } from 'src/app/_models/member';
import { IPagination } from 'src/app/_models/pagination';
import { IUser } from 'src/app/_models/user';
import { UserParams } from 'src/app/_models/userParams';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css'],
})
export class MemberListComponent implements OnInit {
  constructor(
    private _membersService: MembersService,
    private _accountService: AccountService
  ) {
    this._accountService.currentUser$.pipe(take(1)).subscribe((user) => {
      this.user = user;
      this.userParams = new UserParams(this.user);
    });
  }
  members: IMember[];
  pagination: IPagination;
  userParams: UserParams;
  user: IUser;
  // genderList = [
  //   { value: 'male', display: 'Male' },
  //   { value: 'female', display: 'Female' },
  // ];

  ngOnInit(): void {
    this.LoadMembers();
  }

  LoadMembers() {
    this._membersService.GetMembers(this.userParams).subscribe((response) => {
      this.members = response.result;
      this.pagination = response.pagination;
    });
  }

  ResetFilters() {
    this.userParams = new UserParams(this.user);
    this.LoadMembers();
  }
  PageChanged(event: any) {
    this.userParams.pageNumber = event.page;
    this.LoadMembers();
  }
}
