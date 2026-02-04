import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/modules/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { RolesModule } from '../modules/roles/roles.module';
import { AuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { PrismaService } from 'src/prisma.service';
import { APP_GUARD } from '@nestjs/core';


@Module({
  controllers: [AuthController],
  imports: [
    UsersModule,
    RolesModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' }, // Token expira en 1 día
    }),
  ],
  providers: [
      AuthService,
      PrismaService,
      {
        provide: APP_GUARD,
        useClass: AuthGuard,
      },
      {
        provide: APP_GUARD,
        useClass: RolesGuard,
      }
    ],
  exports: [AuthService],
})
export class AuthModule {}
