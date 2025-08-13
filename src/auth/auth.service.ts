import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) {}

    async login(loginDto: LoginDto): Promise<{ access_token: string }> {
        const user = await this.usersService.findOne(loginDto.username);
        if (user?.password !== loginDto.password) {
            throw new UnauthorizedException();
        }
        const now = Math.floor(Date.now() / 1000);
        const payload: JwtPayload = {
            sub: user._id,
            username: user.username,
            iat: now,
        };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }

    async verify(token: string): Promise<JwtPayload> {
        try {
            return await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_SECRET,
            });
        } catch {
            throw new UnauthorizedException();
        }
    }
}
