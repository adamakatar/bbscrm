export class SendEmailDto {
  readonly to: string;
  readonly from: { email: string, name?: string };
  readonly subject: string;
  readonly text: string;
  readonly isRead: boolean;
}