import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IMember } from '../_models/member';
import { PaginatedResult } from '../_models/pagination';
import { UserParams } from '../_models/userParams';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  baseUrl = environment.apiUrl;
  members: IMember[] = [];

  constructor(private _http: HttpClient) {}

  GetMembers(userParams: UserParams) {
    let params = this.GetPaginationHeaders(
      userParams.pageNumber,
      userParams.pageSize
    );

    params = params.append('minAge', userParams.minAge.toString());
    params = params.append('maxAge', userParams.maxAge.toString());
    params = params.append('gender', userParams.gender);

    return this.GetPaginatedResult<IMember[]>(this.baseUrl + 'users', params);
  }

  private GetPaginationHeaders(pageNumber: Number, itemsPerPage: Number) {
    let params = new HttpParams();

    params = params.append('pageNumber', pageNumber.toString());
    params = params.append('pageSize', itemsPerPage.toString());

    return params;
  }

  private GetPaginatedResult<T>(url: string, params: HttpParams) {
    const paginatedMembers: PaginatedResult<T[]> = new PaginatedResult<T[]>();
    return this._http.get<T>(url, { observe: 'response', params }).pipe(
      map((response) => {
        paginatedMembers.result = response.body;
        if (response.headers.has('Pagination')) {
          paginatedMembers.pagination = JSON.parse(
            response.headers.get('Pagination')
          );
        }
        return paginatedMembers;
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
