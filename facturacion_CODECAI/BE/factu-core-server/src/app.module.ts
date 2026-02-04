import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { UsersModule } from './modules/users/users.module';
import { ShopsModule } from './modules/shops/shops.module';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './modules/roles/roles.module';

@Module({
  imports: [UsersModule, ShopsModule, AuthModule, RolesModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
