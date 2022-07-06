import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  registerMode = false;
  constructor() { }

  ngOnInit(): void {
  }

  ToggleRegisterMode(){
    this.registerMode = !this.registerMode;
  }

  HandleCancelRegister(cancelRegister : boolean){
    this.registerMode = cancelRegister;
  }
}
