import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IMember } from '../_models/member';
import { PaginatedResult } from '../_models/pagination';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  baseUrl = environment.apiUrl;
  members: IMember[] = [];
  paginatedMembers: PaginatedResult<IMember[]> = new PaginatedResult<
    IMember[]
  >();

  constructor(private _http: HttpClient) {}

  GetMembers(pageNumber?: Number, itemsPerPage?: Number) {
    let params = new HttpParams();

    if (pageNumber != null && itemsPerPage != null) {
      params = params.append('pageNumber', pageNumber.toString());
      params = params.append('pageSize', itemsPerPage.toString());
    }

    return this._http
      .get<IMember[]>(this.baseUrl + 'users', { observe: 'response', params })
      .pipe(
        map((response) => {
          this.paginatedMembers.result = response.body;
          if (response.headers.has('Pagination')) {
            this.paginatedMembers.pagination = JSON.parse(
              response.headers.get('Pagination')
            );
          }
          return this.paginatedMembers;
        })
      );
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

  SetMainPhoto(photoId: Number) {
    return this._http.put(this.baseUrl + 'users/set-main-photo/' + photoId, {});
  }

  DeletePhoto(photoId: Number) {
    return this._http.delete(this.baseUrl + 'users/delete-photo/' + photoId);
  }
}
