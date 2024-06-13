import { Module, forwardRef } from '@nestjs/common';
import {HttpService} from '@nestjs/axios';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/users/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { S3Storage } from 'src/utils/utils.s3';
import { ContactSchema } from 'src/communication/communication.entity';
import { EmailService } from 'src/utils/utils.email.service';
import { AppConfigsModule } from 'src/app-configs/app-configs.module';
import { SendgridModule } from 'src/sendgrid/sendgrid.module';

@Module({
  imports: [
    forwardRef(() => AppConfigsModule),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    SendgridModule,
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: "Contact", schema: ContactSchema }
    ]),
  ],
  providers: [AuthService, JwtStrategy, S3Storage, EmailService],
  controllers: [AuthController],
  exports: [JwtStrategy, PassportModule, AuthService],
})
export class AuthModule {}
