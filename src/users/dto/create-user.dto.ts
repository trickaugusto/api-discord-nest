export class CreateUserDto {
  username: string;
  nickname: string;
  password: string;
  email: string;
  created_at?: Date | string;
  updated_at?: Date | string;
}
