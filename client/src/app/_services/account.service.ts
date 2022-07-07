import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import {map} from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IUser } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  baseUrl : string = environment.apiUrl;
  private currentUserSource = new ReplaySubject<IUser>(1);
  currentUser$ = this.currentUserSource.asObservable();
  constructor( private _http:HttpClient ) { }


  Register(model:any){
    return this._http.post(this.baseUrl+'account/register',model).pipe(
      this.MapUserLocalStorage()
    )
  }

  Login(model:any){
   return this._http.post(this.baseUrl +'account/login',model).pipe(
    this.MapUserLocalStorage()
   )
  }

  private MapUserLocalStorage() {
    return map((response: IUser) => {
      const user = response;
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        this.currentUserSource.next(user);
      }
    //  return user;
    });
  }

  SetCurrentUser(user : IUser){
    this.currentUserSource.next(user);
  }

  Logout(){
    localStorage.removeItem('user');
    this.currentUserSource.next(null);

  }
}
