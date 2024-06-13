import { Module, forwardRef } from '@nestjs/common';
import { SendgridController } from './sendgrid.controller';
import { SendgridService } from './sendgrid.service';
import { CommunicationService } from '../communication/communication.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Email, EmailSchema } from './sendgrid.schema';
import { UserSchema } from 'src/users/user.entity';
import { ContactSchema, SSMSSchema, SCallSchema} from 'src/communication/communication.entity';
import { AppConfigSchema } from 'src/app-configs/app-config.entity';
import { EmailService } from 'src/utils/utils.email.service';
import { AppConfigsModule } from 'src/app-configs/app-configs.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: "AppConfigs", schema: AppConfigSchema},
      { name: Email.name, schema: EmailSchema },
      { name: "User", schema: UserSchema },
      { name: "Contact", schema: ContactSchema },
      { name: "SSMS", schema: SSMSSchema },
      { name: "SCall", schema: SCallSchema }
    ]),
    forwardRef(() => AppConfigsModule)
  ],
  controllers: [SendgridController],
  providers: [SendgridService, CommunicationService, EmailService],
  exports: [SendgridService]
})
export class SendgridModule {}