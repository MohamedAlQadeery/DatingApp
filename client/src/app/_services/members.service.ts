import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IMember } from '../_models/member';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  baseUrl = environment.apiUrl;

  constructor(private _http: HttpClient) {}

  GetMembers() {
    return this._http.get<IMember[]>(this.baseUrl + 'users');
  }

  GetMember(username: string) {
    return this._http.get<IMember>(this.baseUrl + 'users/' + username);
  }
}
