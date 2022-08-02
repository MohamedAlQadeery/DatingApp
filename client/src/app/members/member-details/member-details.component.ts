import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  NgxGalleryAnimation,
  NgxGalleryImage,
  NgxGalleryOptions,
} from '@kolkov/ngx-gallery';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { take } from 'rxjs/operators';
import { IMember } from 'src/app/_models/member';
import { IMessage } from 'src/app/_models/message';
import { MembersService } from 'src/app/_services/members.service';
import { MessagesService } from 'src/app/_services/messages.service';

@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.css'],
})
export class MemberDetailsComponent implements OnInit {
  constructor(
    private _memberService: MembersService,
    private _route: ActivatedRoute,
    private _messagesService: MessagesService
  ) {}

  member: IMember;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  @ViewChild('memberTabs') memberTabs: TabsetComponent;
  activeTab: TabDirective;
  messages: IMessage[] = [];

  ngOnInit(): void {
    this.LoadMember();
    this.InitGalleryOptions();
  }

  LoadMember() {
    let username = this._route.snapshot.paramMap.get('username');
    this._memberService
      .GetMember(username)
      .pipe(take(1))
      .subscribe((mem) => {
        this.member = mem;
        this.galleryImages = this.InitGalleryImages();
      });
  }

  private InitGalleryOptions() {
    this.galleryOptions = [
      {
        width: '500px',
        height: '500px',
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false,
      },
    ];
  }

  private InitGalleryImages(): NgxGalleryImage[] {
    const imageUrls = [];
    for (const photo of this.member.photos) {
      imageUrls.push({
        small: photo?.url,
        medium: photo?.url,
        big: photo?.url,
      });
    }
    return imageUrls;
  }

  LoadActiveTab(data: TabDirective) {
    this.activeTab = data;
    if (this.activeTab.heading == 'Messages' && this.messages.length === 0) {
      this.LoadMessages();
    }
  }

  LoadMessages() {
    return this._messagesService
      .GetMessageThread(this.member.username)
      .subscribe((res) => {
        this.messages = res;
      });
  }
}
