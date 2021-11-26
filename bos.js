import { BadRequestException, Body, Controller, InternalServerErrorException, Post, Request, Res, UnauthorizedException, UseGuards, } from '@nestjs/common';
import { Role } from '@prisma/client';
import { FastifyRequest } from 'fastify';
import { UsersService } from 'users/users.service';
import { AuthService } from './auth.service';
import { SigninInput, SigninOutput } from './dto/signin.dto';
import { SignupInput } from './dto/signup.dto';
import { LocalAuthGuard } from './passport/local-auth.guard';
import argon2 from 'argon2';
import { SkipDefaultGuard } from 'shared/decorators/public.decorator';
import { UserWithoutPassword } from 'users/dto/user.dto';
import { FastifyReply } from 'fastify';
import moment from 'moment';
import { stringToDuration } from 'shared/helpers/duration';
import { ApiExtraModels } from '@nestjs/swagger';
import { Token } from './dto/token.dto';

@Controller('auth')
export class AuthController {

  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) { }


  @Post('signin')
  @SkipDefaultGuard()
  @UseGuards(LocalAuthGuard)
  async signin(
    @Body() _body: SignupInput,
    @Request() req: FastifyRequest,
    @Res({ passthrough: true }) response: FastifyReply,
  ): Promise<SigninOutput> {

    // Since, this request is guarded by LocalAuthGuard;
    // Here, "req.user" will be the response of the LocalStrategy.validate method.
    // 
    // For all of the other controller request methods,
    // which will be guarded by the default guard (JwtAuthGuard)
    // unless decorated otherwise using @SkipDefaultGuard() for example,
    // "req.user" will be the response of the JwtStrategy.validate method.
    const { refresh_token, ...payload } = await this.authService.signLocalUser(req.user as unknown as UserWithoutPassword);

    response.setCookie('refresh_token', refresh_token, {
      sameSite: 'none', // "lax" only sends request when navigating.
      secure: true,
      httpOnly: true,
      expires: moment().add(stringToDuration(process.env.JWT_REFRESH_EXPIRES_IN)).toDate(),
    });
    return payload;
  }

  @Post('signout')
  async signout(
    @Res({ passthrough: true }) response: FastifyReply,
  ): Promise<'ok'> {
    response.clearCookie('refresh_token');
    return 'ok';
  }

  @Post('signup')
  @SkipDefaultGuard()
  async signup(
    @Body() body: SigninInput,
  ) {

    const password = await argon2.hash(body.password);
    const role: Role = 'ADMIN';

    if (!await this.usersService.isUsernameAvailable(body.username)) {
      throw new BadRequestException({
        error: 'Validation Error',
        messages: {
          username: 'Username is not available',
        }
      });
    }

    const payload = {
      email: body.username,
      password,
      role,
    };

    try {
      const user = await this.usersService.create(payload);
      const { password: _password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      return new InternalServerErrorException(error);
    }
  }


  @Post('refresh')
  @SkipDefaultGuard()
  @ApiExtraModels(Token)
  async refresh(
    @Request() req: FastifyRequest,
    @Res({ passthrough: true }) response: FastifyReply,
  ) {

    const { refresh_token: refreshTokenFromCookie } = req.cookies;

    const decoded = await this.authService
      .validateRefreshToken(refreshTokenFromCookie)
      .catch(_error => {
        throw new UnauthorizedException('Refresh token validation failed');
      });
    if (!decoded) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // TODO: Maybe, validate access token too (ignoreExpiration)

    const userPayloadFromToken = {
      id: decoded?.sub,
      role: decoded?.role,
    };

    const { refresh_token, ...payload } = await this.authService.signLocalUser(userPayloadFromToken);

    response.setCookie('refresh_token', refresh_token, {
      sameSite: 'lax',
      secure: true,
      httpOnly: true,
      expires: moment().add(stringToDuration(process.env.JWT_REFRESH_EXPIRES_IN)).toDate(),
    });

    return payload;
  }