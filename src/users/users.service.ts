import { Injectable, ConflictException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {}

    create(createUserDto: CreateUserDto) {
        return this.userModel
            .findOne({ username: createUserDto.username })
            .exec()
            .then((existingUser) => {
                if (existingUser) {
                    throw new ConflictException('User already exists');
                }
                const createdUser = new this.userModel(createUserDto);
                return createdUser.save();
            });
    }

    findAll() {
        return this.userModel.find().exec();
    }

    findOne(username: string) {
        return this.userModel.findOne({ username }).exec();
    }

    update(username: string, updateUserDto: UpdateUserDto) {
        return this.userModel
            .findOneAndUpdate({ username }, updateUserDto)
            .exec();
    }

    remove(username: string) {
        return this.userModel.findOneAndDelete({ username }).exec();
    }
}
