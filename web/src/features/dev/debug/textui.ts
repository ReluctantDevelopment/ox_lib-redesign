import { TextUiProps } from '../../../typings';
import { debugData } from '../../../utils/debugData';

export const debugTextUI = () => {
  debugData<TextUiProps>([
    {
      action: 'textUi',
      data: {
        text: 'Open Garage',
        position: 'right-center',
        icon: 'e',
      },
    },
  ]);
};
