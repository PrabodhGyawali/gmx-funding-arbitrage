type _NotificationType = 'trade' | 'developer';

interface _Notification {
    id: string;
    type: _NotificationType;
    title: string;
    message: string;
    timestamp: Date;
    read: boolean;
}

export type {_NotificationType};
export type {_Notification};