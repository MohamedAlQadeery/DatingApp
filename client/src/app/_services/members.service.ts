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
  membersCache = new Map();
  constructor(private _http: HttpClient) {}

  GetMembers(userParams: UserParams) {
    var response = this.membersCache.get(Object.values(userParams).join('-'));
    if (response) {
      return of(response);
    }
    let params = this.GetPaginationHeaders(
      userParams.pageNumber,
      userParams.pageSize
    );

    params = params.append('minAge', userParams.minAge.toString());
    params = params.append('maxAge', userParams.maxAge.toString());
    params = params.append('gender', userParams.gender);
    params = params.append('orderBy', userParams.orderBy);

    return this.GetPaginatedResult<IMember[]>(
      this.baseUrl + 'users',
      params
    ).pipe(
      map((response) => {
        this.membersCache.set(Object.values(userParams).join('-'), response);

        return response;
      })
    );
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
    const member = [...this.membersCache.values()]
      .reduce((arr, elem) => arr.concat(elem.result), [])
      .find((m: IMember) => m.username === username);

    if (member) {
      console.log(member);
      return of(member);
    }
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

  AddLike(username: string) {
    return this._http.post(this.baseUrl + 'likes/' + username, {});
  }

  GetUserLikes(type: string, pageNumber, pageSize) {
    let params = this.GetPaginationHeaders(pageNumber, pageSize);
    params = params.append('type', type);

    return this.GetPaginatedResult<Partial<IMember[]>>(
      this.baseUrl + 'likes/',
      params
    );
  }
}
