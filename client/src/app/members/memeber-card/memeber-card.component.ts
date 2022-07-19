import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { IMember } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-memeber-card',
  templateUrl: './memeber-card.component.html',
  styleUrls: ['./memeber-card.component.css'],
})
export class MemeberCardComponent implements OnInit {
  @Input() member: IMember;
  constructor(
    private _memberService: MembersService,
    private _tostr: ToastrService
  ) {}

  ngOnInit(): void {}

  AddLike(username: string) {
    this._memberService.AddLike(username).subscribe(() => {
      this._tostr.success(`You liked ${username} successfully!`);
    });
  }
}
