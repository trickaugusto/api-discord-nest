import { Exclude } from 'class-transformer';

export class DiscordBotEntity {
  constructor(partial: Partial<DiscordBotEntity>) {
    Object.assign(this, partial);
  }

  id: number;
  name: string;
  owner_id: number;

  @Exclude()
  token: string;

  @Exclude()
  created_at: Date;

  @Exclude()
  updated_at: Date;
}
