import { Injectable } from '@angular/core';
import {
  Router,
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { IMember } from '../_models/member';
import { MembersService } from '../_services/members.service';

@Injectable({
  providedIn: 'root',
})
export class MemberDetailedResolver implements Resolve<IMember> {
  constructor(private _memberService: MembersService) {}
  resolve(route: ActivatedRouteSnapshot): Observable<IMember> {
    return this._memberService.GetMember(route.paramMap.get('username'));
  }
}
