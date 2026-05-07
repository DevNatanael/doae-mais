import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { BirthdayScheduler } from './birthday.scheduler';
import { UsersModule } from '../users/users.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    UsersModule,
    NotificationsModule,
  ],
  providers: [BirthdayScheduler],
})
export class SchedulerModule {}