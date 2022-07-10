import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs/operators';
import { IMember } from 'src/app/_models/member';
import { IUser } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css'],
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm') editForm: NgForm;
  member: IMember;
  currentUser: IUser;

  @HostListener('window:beforeunload', ['$event']) UnloadNotification(
    $event: any
  ) {
    if (this.editForm.dirty) {
      $event.returnValue = true;
    }
  }
  constructor(
    private _accountService: AccountService,
    private _memberService: MembersService,
    private _tostr: ToastrService
  ) {
    this._accountService.currentUser$.pipe(take(1)).subscribe((user) => {
      this.currentUser = user;
    });
  }

  ngOnInit(): void {
    this.LoadMemberInfo();
  }

  private LoadMemberInfo() {
    this._memberService
      .GetMember(this.currentUser.username)
      .subscribe((member) => (this.member = member));
  }

  UpdateMember() {
    this._memberService.UpdateMember(this.member).subscribe(() => {
      this._tostr.success('Profile Updated Succesfully!');
      this.editForm.reset(this.member);
    });
  }
}
