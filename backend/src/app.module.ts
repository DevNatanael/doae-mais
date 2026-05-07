import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { MembersModule } from './members/members.module';
import { DonationCategoriesModule } from './donation_categories/donation_categories.module';
import { NeedsModule } from './needs/needs.module';
import { DonationsModule } from './donations/donations.module';
import { AuthModule } from './auth/auth.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { PaymentModule } from './payment/payment.module';
import { NotificationsModule } from './notifications/notifications.module';
import { SchedulerModule } from './scheduler/scheduler.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost', // 'localhost'
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || '123',
      database: process.env.DB_NAME || 'postgres',

      // Entidades serão adicionadas aqui
      entities: [__dirname + '/**/*.entity{.ts,.js}'],

      // Sincroniza o schema do DB (apenas para desenvolvimento!)
      // Isso cria as tabelas automaticamente.
      synchronize: true,
    }),

    UsersModule,

    MembersModule,

    DonationCategoriesModule,

    NeedsModule,

    DonationsModule,

    AuthModule,

    DashboardModule,

    PaymentModule,

    NotificationsModule,

    SchedulerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
