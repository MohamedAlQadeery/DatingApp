import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IMember } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css'],
})
export class MemberListComponent implements OnInit {
  constructor(private _membersService: MembersService) {}
  members$: Observable<IMember[]>;
  ngOnInit(): void {
    this.members$ = this._membersService.GetMembers();
  }
}
