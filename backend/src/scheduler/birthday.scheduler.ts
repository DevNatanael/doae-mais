import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { UsersService } from '../users/users.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class BirthdayScheduler {
  constructor(
    private usersService: UsersService,
    private notificationsService: NotificationsService,
  ) {}

  @Cron('0 8 * * *') // todo dia às 08:00
  async handleBirthdays() {
    const birthdays = await this.usersService.findBirthdaysToday();

    for (const user of birthdays) {
      await this.notificationsService.sendBirthdayNotification(user);
    }
  }
}