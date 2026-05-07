import { Controller, Get } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Controller('test')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get('birthday')
  async testBirthday() {
    const fakeUsers = [
      {
        id: '1',
        name: 'João',
        email: 'email1@gmail.com',
      },
      {
        id: '2',
        name: 'Maria',
        email: 'email2@gmail.com',
      },
    ];

    // simula envio individual
    for (const user of fakeUsers) {
      await this.notificationsService.sendBirthdayNotification(user);
    }

    // simula envio coletivo
    await this.notificationsService.notifyMembersAboutBirthdays(fakeUsers);

    return { message: 'Emails enviados' };
  }
}
