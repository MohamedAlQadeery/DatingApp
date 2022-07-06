import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

 @Output() registerMode = new EventEmitter<boolean>();
  constructor(private _accountService:AccountService) { }

  model : any={};
  ngOnInit(): void {
  }

  Register() : void{
    this._accountService.Register(this.model).subscribe(response => {
      this.Cancel()
    },error => console.log(error))
  }

  Cancel() {
    this.registerMode.emit(false);
    
  }

}
