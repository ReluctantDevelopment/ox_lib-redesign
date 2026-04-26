import { debugData } from '../../../utils/debugData';
import { AlertProps } from '../../../typings';

export const debugAlert = () => {
  debugData<AlertProps>([
    {
      action: 'sendAlert',
      data: {
        header: 'Confirm Vehicle Action',
        content: 'You are about to transfer this vehicle to the impound lot.  \n Please confirm to continue.',
        centered: true,
        size: 'lg',
        overflow: true,
        cancel: true,
        // labels: {
        //   confirm: 'Ok',
        //   cancel: 'Not ok',
        // },
      },
    },
  ]);
};
