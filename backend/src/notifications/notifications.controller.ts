import { Controller, Get } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Controller('test')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get('birthday')
  async testBirthday() {
    console.log('🔥 ROTA CHAMADA');

    const fakeUser = {
      id: '1',
      name: 'Teste',
      email: 'apple9934+stevenson@gmail.com',
    };

    await this.notificationsService.sendBirthdayNotification(fakeUser);

    return { message: 'Email enviado' };
  }
}
