import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AccountService } from './_services/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private _http : HttpClient,private _accountService :AccountService){}

  title = 'The Dating App';
  users : any;


  ngOnInit(): void {
   this.GetUsers();
   this.SetCurrentUser();
  }

  SetCurrentUser(){
    const user  = JSON.parse(localStorage.getItem('user'));
    this._accountService.SetCurrentUser(user);
  }
  private GetUsers() {
    this._http.get('https://localhost:5001/api/users').subscribe(response => {
      this.users = response;
    }, error => {
      console.log(error);
    });
  }
}
