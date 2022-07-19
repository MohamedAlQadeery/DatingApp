import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router, NavigationExtras } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private _router: Router, private _toastr: ToastrService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((errorResponse: HttpErrorResponse) => {
        if (errorResponse) {
          switch (errorResponse.status) {
            case 400:
              if (errorResponse.error.errors) {
                const modalStateErrors = [];
                for (const key in errorResponse.error.errors) {
                  modalStateErrors.push(errorResponse.error.errors[key]);
                }
                throw modalStateErrors.flat();
              } else if (typeof errorResponse.error == 'object') {
                this._toastr.error(
                  'Bad Request !',
                  errorResponse.status.toString()
                );
              } else {
                this._toastr.error(errorResponse.error);
              }
              break;
            case 401:
              this._toastr.error(
                'Unauthroized !',
                errorResponse.status.toString()
              );
              break;
            case 404:
              this._router.navigateByUrl('/not-found');
              break;
            case 500:
              const navigationExtras: NavigationExtras = {
                state: { error: errorResponse.error },
              };
              this._router.navigateByUrl('/server-error', navigationExtras);
              break;
            default:
              this._toastr.error('Something unexpected went wrong');
              console.log(errorResponse);
              break;
          }
        }
        return throwError(errorResponse);
      })
    );
  }
}
