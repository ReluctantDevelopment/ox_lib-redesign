import { debugData } from '../../../utils/debugData';
import type { RadialMenuItem } from '../../../typings';

export const debugRadial = () => {
  debugData<{ items: RadialMenuItem[]; sub?: boolean }>([
    {
      action: 'openRadialMenu',
      data: {
        items: [
          { icon: 'car', label: 'Vehicle Actions' },
          {
            iconWidth: 30,
            iconHeight: 30,
            icon: 'https://icon-library.com/images/white-icon-png/white-icon-png-18.jpg',
            label: 'Profile Menu',
          },
          { icon: 'warehouse', label: 'Open Garage' },
          { icon: 'palette', label: 'Primary Respray' },
          { icon: 'wrench', label: 'Quick Repair' },
          { icon: 'gas-pump', label: 'Refuel Vehicle' },
          { icon: 'key', label: 'Toggle Locks' },
        ],
      },
    },
  ]);
};
