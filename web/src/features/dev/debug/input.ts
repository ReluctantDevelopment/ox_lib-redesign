import { debugData } from '../../../utils/debugData';
import type { InputProps } from '../../../typings';

export const debugInput = () => {
  debugData<InputProps>([
    {
      action: 'openDialog',
      data: {
        heading: 'Police locker',
        rows: [
          {
            type: 'input',
            label: 'Locker number',
            placeholder: '420',
            description: 'Enter the locker ID you want to access',
          },
          {
            type: 'time',
            format: '12',
            label: 'Locker Time',
            description: 'Select the lock expiration time',
          },
          { type: 'checkbox', label: 'Enable private locker' },
          { type: 'input', label: 'Locker PIN', password: true, icon: 'lock' },
          { type: 'checkbox', label: 'Allow staff access', checked: true },
          {
            type: 'select',
            label: 'Locker type',
            options: [
              { value: 'option1' },
              { value: 'option2', label: 'Option 2' },
              { value: 'option3', label: 'Option 3' },
            ],
          },
          {
            type: 'number',
            label: 'Number counter',
            default: 12,
            min: 3,
            max: 10,
            icon: 'receipt',
          },
          {
            type: 'number',
            label: 'Price',
            default: 6.5,
            min: 0,
            max: 10,
            icon: 'receipt',
          },
          {
            type: 'slider',
            label: 'Security level',
            min: 10,
            max: 50,
            step: 2,
          },
        ],
      },
    },
  ]);
};
