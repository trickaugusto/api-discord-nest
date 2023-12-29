import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entity/user.entity';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return new UserEntity(await this.usersService.create(createUserDto));
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    const users = await this.usersService.findAll();
    return users.map((user) => new UserEntity(user));
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findOne(+id);

    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }

    return new UserEntity(user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = await this.usersService.findOne(id);

    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }

    return new UserEntity(await this.usersService.update(+id, updateUserDto));
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findOne(+id);

    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }

    return new UserEntity(await this.usersService.remove(id));
  }
}
