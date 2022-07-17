import { IUser } from './user';

export class UserParams {
  pageNumber = 1;
  pageSize = 5;

  minAge = 18;
  maxAge = 100;
  gender: string;

  constructor(user: IUser) {
    this.gender = user.gender === 'male' ? 'female' : 'male';
  }
}
