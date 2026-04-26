import { debugData } from '../../../utils/debugData';
import { MenuSettings } from '../../../typings';

export const debugMenu = () => {
  debugData<MenuSettings>([
    {
      action: 'setMenu',
      data: {
        //   position: "bottom-left",
        title: 'Vehicle garage',
        items: [
          { label: 'Repair vehicle', icon: 'wrench' },
          {
            label: 'Clean vehicle',
            icon: 'soap',
            description: 'Remove dirt and restore shine',
            checked: true,
          },
          {
            label: 'Vehicle class',
            values: ['Compact', 'Sports', { label: 'Super', description: 'High performance class' }],
            icon: 'tag',
            description: 'Select the target class',
          },
          {
            label: 'Oil Level',
            progress: 30,
            icon: 'oil-can',
            description: 'Remaining Oil: 30%',
          },
          {
            label: 'Durability',
            progress: 80,
            icon: 'car-side',
            description: 'Durability: 80%',
            colorScheme: 'blue',
            iconColor: '#55778d',
          },
          { label: 'Toggle engine', icon: 'power-off' },
          { label: 'Toggle doors', icon: 'car-side' },
          {
            label: 'Drive mode',
            values: ['Nice', 'Super nice', 'Extra nice'],
            defaultIndex: 1,
            icon: 'gauge-high',
          },
          { label: 'Activate tracking', icon: 'location-crosshairs' },
          { label: 'Open trunk', icon: 'box-open' },
          {
            label: 'Suspension mode',
            values: ['Comfort', 'Sport', 'Race'],
            icon: 'sliders',
          },
        ],
      },
    },
  ]);
};
