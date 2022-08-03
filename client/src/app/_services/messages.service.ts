import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IMessage } from '../_models/message';
import { GetPaginatedResult, GetPaginationHeaders } from './paginationHelpers';

@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  baseUrl = environment.apiUrl;
  constructor(private _http: HttpClient) {}

  GetMessages(pageNumber, itemsPerPage, container) {
    let params = GetPaginationHeaders(pageNumber, itemsPerPage);
    params = params.append('container', container);

    return GetPaginatedResult(this.baseUrl + 'messages', params, this._http);
  }

  GetMessageThread(username: string) {
    return this._http.get<IMessage[]>(
      this.baseUrl + 'messages/thread/' + username
    );
  }

  SendMessage(username: string, content: string) {
    return this._http.post<IMessage>(this.baseUrl + 'messages', {
      receiverUsername: username,
      content: content,
    });
  }

  DeleteMessage(id: number) {
    return this._http.delete(this.baseUrl + 'messages/' + id);
  }
}
