import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { UsersModule } from './modules/users/users.module';
import { ShopsModule } from './modules/shops/shops.module';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './modules/roles/roles.module';
import { BillModule } from './modules/bill/bill.module';
import { BillDetailsModule } from './modules/bill-details/bill-details.module';

@Module({
  imports: [
    UsersModule, 
    ShopsModule, 
    AuthModule, 
    RolesModule, 
    BillModule, 
    BillDetailsModule
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
