import { Component, Input, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { take } from 'rxjs/operators';
import { IMember } from 'src/app/_models/member';
import { IUser } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css'],
})
export class PhotoEditorComponent implements OnInit {
  @Input() member: IMember;
  uploader: FileUploader;
  hasBaseDropzoneOver = false;
  baseUrl = environment.apiUrl;
  user: IUser;
  constructor(private _accountService: AccountService) {
    this._accountService.currentUser$
      .pipe(take(1))
      .subscribe((u) => (this.user = u));
  }

  ngOnInit(): void {
    this.InitUploder();
  }

  FileOverBase(e: any) {
    this.hasBaseDropzoneOver = e;
  }

  InitUploder() {
    //sets uploader options
    this.uploader = new FileUploader({
      url: this.baseUrl + 'users/add-photo',
      authToken: 'Bearer ' + this.user.token,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024,
    });

    //sets uploder events options
    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        console.log('inside onSuccessItem() success ');
        console.log(response);
        const photo = JSON.parse(response);
        this.member.photos.push(photo);
      }
    };
  }
}
