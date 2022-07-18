import { IUser } from './user';

export class UserParams {
  pageNumber = 1;
  pageSize = 6;

  minAge = 18;
  maxAge = 100;
  gender: string;
  orderBy = 'lastActive';
  constructor(user: IUser) {
    this.gender = user.gender === 'male' ? 'female' : 'male';
  }
}
