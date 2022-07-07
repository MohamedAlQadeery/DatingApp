import { Component, OnInit } from '@angular/core';
import { IMember } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css'],
})
export class MemberListComponent implements OnInit {
  constructor(private _membersService: MembersService) {}
  members: IMember[];
  ngOnInit(): void {
    this.LoadMembers();
  }

  LoadMembers() {
    this._membersService.GetMembers().subscribe((m) => {
      this.members = m;
    });
  }
}
