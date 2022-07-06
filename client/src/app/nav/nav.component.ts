import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { IUser } from '../_models/user';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  constructor(public _accountService :AccountService,private _router:Router,private _toastr:ToastrService) { }
  model:any ={};

  ngOnInit(): void {
  }



  Login() : void{
    this._accountService.Login(this.model).subscribe(response=>{
      this._router.navigateByUrl("/members");
    },error=>{
      console.log(error);
      this._toastr.error(error.error);
    });
  }



  Logout() : void{
    this._accountService.Logout();
    this._router.navigateByUrl("/");

  }
}
