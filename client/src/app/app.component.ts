import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AccountService } from './_services/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private _accountService :AccountService){}

  title = 'The Dating App';
  users : any;


  ngOnInit(): void {
   this.SetCurrentUser();
  }

  SetCurrentUser(){
    const user  = JSON.parse(localStorage.getItem('user'));
    this._accountService.SetCurrentUser(user);
  }
  
}
