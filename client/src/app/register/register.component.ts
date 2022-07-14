import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  @Output() registerMode = new EventEmitter<boolean>();
  registerForm: FormGroup;
  constructor(
    private _accountService: AccountService,
    private _toastr: ToastrService,
    private _fb: FormBuilder
  ) {}

  model: any = {};
  ngOnInit(): void {
    this.InitilaizeRegisterForm();
  }

  InitilaizeRegisterForm() {
    this.registerForm = this._fb.group({
      username: ['', [Validators.required]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(10),
        ],
      ],
      confirmPassword: [
        '',
        [Validators.required, this.ConfirmPasswordValidiation('password')],
      ],
    });

    this.registerForm.controls.password.valueChanges.subscribe(() => {
      this.registerForm.controls.confirmPassword.updateValueAndValidity();
    });
  }
  Register(): void {
    // this._accountService.Register(this.model).subscribe(
    //   (response) => {
    //     this.Cancel();
    //   },
    //   (error) => {
    //     console.log(error);
    //     this._toastr.error(error.error);
    //   }
    // );
  }

  Cancel() {
    this.registerMode.emit(false);
  }

  ConfirmPasswordValidiation(matchTo: string): ValidatorFn {
    return (confirmPasswordControl: AbstractControl) => {
      return confirmPasswordControl.value ===
        confirmPasswordControl?.parent?.controls[matchTo]?.value
        ? null
        : { NotMatching: true };
    };
  }
}
