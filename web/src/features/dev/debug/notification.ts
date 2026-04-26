import { NotificationProps } from '../../../typings';
import { debugData } from '../../../utils/debugData';

export const debugCustomNotification = () => {
  debugData<NotificationProps>([
    {
      action: 'notify',
      data: {
        title: 'System Info',
        description: 'Garage synchronization completed successfully.',
        type: 'info',
        id: 'debug-info',
      },
    },
  ], 150);

  debugData<NotificationProps>([
    {
      action: 'notify',
      data: {
        title: 'Success',
        description: 'Vehicle has been stored in slot B-12.',
        type: 'success',
        id: 'debug-success',
      },
    },
  ], 300);

  debugData<NotificationProps>([
    {
      action: 'notify',
      data: {
        title: 'Warning',
        description: 'Fuel level is below 15%.',
        type: 'warning',
        id: 'debug-warning',
      },
    },
  ], 450);

  debugData<NotificationProps>([
    {
      action: 'notify',
      data: {
        title: 'Error',
        description: 'Failed to retrieve ownership records.',
        type: 'error',
        id: 'debug-error',
      },
    },
  ], 600);
};
