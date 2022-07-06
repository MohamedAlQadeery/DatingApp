import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IUser } from '../_models/user';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  constructor(public _accountService :AccountService) { }
  model:any ={};

  ngOnInit(): void {
  }



  Login() : void{
    this._accountService.Login(this.model).subscribe(response=>{
      console.log(response);
    },error=>{
      console.log(error);
    });
  }



  Logout() : void{
    this._accountService.Logout();

  }
}
