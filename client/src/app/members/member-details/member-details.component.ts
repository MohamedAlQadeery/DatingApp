import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import { IMember } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.css'],
})
export class MemberDetailsComponent implements OnInit {
  constructor(
    private _memberService: MembersService,
    private _route: ActivatedRoute
  ) {}

  member: IMember;

  ngOnInit(): void {
    this.LoadMember();
  }

  LoadMember() {
    let username = this._route.snapshot.paramMap.get('username');
    this._memberService
      .GetMember(username)
      .pipe(take(1))
      .subscribe((mem) => (this.member = mem));
  }
}
