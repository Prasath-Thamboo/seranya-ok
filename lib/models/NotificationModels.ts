export type NotificationType = 'COMMENT' | 'CONTACT' | 'GDPR_REQUEST' | 'NEW_USER';

export interface NotificationModel {
  id: number;
  type: NotificationType;
  message: string;
  link?: string | null;
  isRead: boolean;
  createdAt: string;
}
