import { Injectable, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { UsersService } from '../users/users.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class BirthdayScheduler implements OnModuleInit {
  private lastRunDate: string | null = null;

  constructor(
    private usersService: UsersService,
    private notificationsService: NotificationsService,
  ) {}

  async onModuleInit() {
    console.log('🚀 Verificando aniversários ao iniciar...');
    await this.safeHandleBirthdays();
  }

  @Cron('0 8 * * *')
  async handleCron() {
    console.log('⏰ Executando cron de aniversários...');
    await this.safeHandleBirthdays();
  }

  private async safeHandleBirthdays() {
    const today = new Date().toDateString();

    if (this.lastRunDate === today) {
      console.log('⚠️ Já executado hoje, ignorando...');
      return;
    }

    const birthdays = await this.usersService.findBirthdaysToday();

    if (!birthdays.length) {
      console.log('📭 Nenhum aniversariante hoje');
      this.lastRunDate = today;
      return;
    }

    // 🎂 envia para aniversariantes
    for (const user of birthdays) {
      await this.notificationsService.sendBirthdayNotification(user);
    }

    // 📢 envia para membros
    await this.notificationsService.notifyMembersAboutBirthdays(birthdays);

    this.lastRunDate = today;

    console.log('✅ Notificações de aniversário enviadas');
  }
}
