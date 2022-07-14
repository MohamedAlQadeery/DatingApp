import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
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
  maxDate: Date;
  validationErrors: string[] = [];

  constructor(
    private _accountService: AccountService,
    private _toastr: ToastrService,
    private _fb: FormBuilder,
    private _router: Router
  ) {}

  model: any = {};
  ngOnInit(): void {
    this.InitilaizeRegisterForm();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  InitilaizeRegisterForm() {
    this.registerForm = this._fb.group({
      gender: ['male'],
      username: ['', [Validators.required]],
      knownAs: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
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

    //validtate password input on every change
    this.registerForm.controls.password.valueChanges.subscribe(() => {
      this.registerForm.controls.confirmPassword.updateValueAndValidity();
    });
  }
  Register(): void {
    this._accountService.Register(this.registerForm.value).subscribe(
      () => {
        this._router.navigateByUrl('/members');
      },
      (error) => {
        this.validationErrors = error;
      }
    );
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
