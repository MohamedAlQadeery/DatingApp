import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { PaginatedResult } from '../_models/pagination';

export function GetPaginationHeaders(pageNumber: Number, itemsPerPage: Number) {
  let params = new HttpParams();

  params = params.append('pageNumber', pageNumber.toString());
  params = params.append('pageSize', itemsPerPage.toString());

  return params;
}

export function GetPaginatedResult<T>(
  url: string,
  params: HttpParams,
  http: HttpClient
) {
  const paginatedMembers: PaginatedResult<T[]> = new PaginatedResult<T[]>();
  return http.get<T>(url, { observe: 'response', params }).pipe(
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
