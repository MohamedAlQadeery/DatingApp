import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IMember } from '../_models/member';
import { PaginatedResult } from '../_models/pagination';
import { UserParams } from '../_models/userParams';
import { GetPaginatedResult, GetPaginationHeaders } from './paginationHelpers';

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
    let params = GetPaginationHeaders(
      userParams.pageNumber,
      userParams.pageSize
    );

    params = params.append('minAge', userParams.minAge.toString());
    params = params.append('maxAge', userParams.maxAge.toString());
    params = params.append('gender', userParams.gender);
    params = params.append('orderBy', userParams.orderBy);

    return GetPaginatedResult<IMember[]>(
      this.baseUrl + 'users',
      params,
      this._http
    ).pipe(
      map((response) => {
        this.membersCache.set(Object.values(userParams).join('-'), response);

        return response;
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
    let params = GetPaginationHeaders(pageNumber, pageSize);
    params = params.append('type', type);

    return GetPaginatedResult<Partial<IMember[]>>(
      this.baseUrl + 'likes/',
      params,
      this._http
    );
  }
}
