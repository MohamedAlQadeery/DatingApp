import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IMember } from '../_models/member';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  baseUrl = environment.apiUrl;
  members: IMember[] = [];

  constructor(private _http: HttpClient) {}

  GetMembers() {
    if (this.members.length > 0) return of(this.members);
    return this._http
      .get<IMember[]>(this.baseUrl + 'users')
      .pipe(map((m) => (this.members = m)));
  }

  GetMember(username: string) {
    const member = this.members.find((m) => m.username == username);
    if (member !== undefined) return of(member);
    return this._http.get<IMember>(this.baseUrl + 'users/' + username);
  }

  UpdateMember(member: IMember) {
    return this._http.put(this.baseUrl + 'users', member).pipe(
      map(() => {
        const index = this.members.indexOf(member);
        this.members[index] = member;
      })
    );
  }
}
