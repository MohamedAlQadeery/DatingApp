import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root',
})
export class BusyService {
  // when it reach to 0  hide else show
  requestCount = 0;
  constructor(private _spinnerService: NgxSpinnerService) {}

  Busy() {
    this.requestCount++;
    this._spinnerService.show(undefined, {
      type: 'line-scale-party',
      bdColor: 'rgba(255,255,255,0)',
      color: '#333333',
    });
  }

  Idle() {
    this.requestCount--;
    if (this.requestCount <= 0) {
      this.requestCount = 0;
      this._spinnerService.hide();
    }
  }
}
