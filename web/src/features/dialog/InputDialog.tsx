import { Button, Group, Modal, Stack, createStyles } from '@mantine/core';
import React from 'react';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { useLocales } from '../../providers/LocaleProvider';
import { fetchNui } from '../../utils/fetchNui';
import type { InputProps } from '../../typings';
import { OptionValue } from '../../typings';
import InputField from './components/fields/input';
import CheckboxField from './components/fields/checkbox';
import SelectField from './components/fields/select';
import NumberField from './components/fields/number';
import SliderField from './components/fields/slider';
import { useFieldArray, useForm } from 'react-hook-form';
import ColorField from './components/fields/color';
import DateField from './components/fields/date';
import TextareaField from './components/fields/textarea';
import TimeField from './components/fields/time';
import dayjs from 'dayjs';

export type FormValues = {
  test: {
    value: any;
  }[];
};

const useStyles = createStyles(() => ({
  modalContent: {
    position: 'relative',
    border: '1px solid rgba(104, 176, 255, 0.45)',
    background: 'linear-gradient(180deg, rgba(13, 36, 64, 0.96) 0%, rgba(7, 20, 38, 0.96) 100%)',
    boxShadow: '0 14px 34px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 56,
      background: 'linear-gradient(180deg, rgba(159, 212, 255, 0.08) 0%, rgba(159, 212, 255, 0) 100%)',
      pointerEvents: 'none',
    },
  },
  modalHeader: {
    background: 'transparent',
    borderBottom: '1px solid rgba(104, 176, 255, 0.35)',
    marginBottom: 8,
    paddingBottom: 8,
  },
  modalTitle: {
    textAlign: 'center',
    width: '100%',
    fontSize: 17,
    fontWeight: 700,
    letterSpacing: 0.6,
    color: '#e3f3ff',
    textTransform: 'uppercase',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.45)',
  },
  formStack: {
    gap: 8,
    '.mantine-Input-label, .mantine-Checkbox-label': {
      color: '#dcebfb',
      fontWeight: 600,
      letterSpacing: 0.2,
    },
    '.mantine-Input-description': {
      color: 'rgba(190, 223, 250, 0.82)',
      lineHeight: 1.25,
    },
    '.mantine-Input-input, .mantine-Select-input, .mantine-MultiSelect-input, .mantine-NumberInput-input, .mantine-Textarea-input':
      {
        border: '1px solid rgba(92, 160, 245, 0.5)',
        background: 'linear-gradient(180deg, rgba(10, 29, 52, 0.92) 0%, rgba(6, 19, 36, 0.92) 100%)',
        color: '#dcebfb',
        borderRadius: 5,
        transition: 'border-color 120ms ease, box-shadow 120ms ease',
      },
    '.mantine-Input-input:focus, .mantine-Select-input:focus, .mantine-MultiSelect-input:focus, .mantine-NumberInput-input:focus, .mantine-Textarea-input:focus':
      {
        borderColor: 'rgba(149, 207, 255, 0.88)',
        boxShadow: '0 0 0 1px rgba(91, 170, 255, 0.25)',
      },
    '.mantine-Select-dropdown, .mantine-MultiSelect-dropdown, .mantine-Popover-dropdown': {
      border: '1px solid rgba(92, 160, 245, 0.45)',
      background: 'linear-gradient(180deg, rgba(11, 32, 56, 0.98) 0%, rgba(7, 22, 42, 0.98) 100%)',
      color: '#dcebfb',
    },
    '.mantine-Select-item, .mantine-MultiSelect-value, .mantine-MultiSelect-defaultValue': {
      color: '#dcebfb',
    },
    '.mantine-Select-item:hover': {
      background: 'rgba(68, 133, 207, 0.3)',
    },
    '.mantine-Slider-markLabel': {
      color: 'rgba(190, 223, 250, 0.82)',
    },
    '.mantine-Slider-track': {
      backgroundColor: 'rgba(110, 162, 219, 0.26)',
    },
    '.mantine-Slider-bar': {
      background: 'linear-gradient(90deg, #235fc7 0%, #377dd2 45%, #5baeff 100%)',
    },
    '.mantine-Checkbox-input': {
      borderColor: 'rgba(92, 160, 245, 0.5)',
      backgroundColor: 'rgba(7, 22, 42, 0.95)',
    },
    '.mantine-Checkbox-input:checked': {
      backgroundColor: '#4c96dc',
      borderColor: '#4c96dc',
    },
  },
  cancelButton: {
    minWidth: 90,
    height: 34,
    borderRadius: 5,
    border: '1px solid rgba(104, 176, 255, 0.45)',
    background: 'linear-gradient(180deg, rgba(13, 37, 64, 0.95) 0%, rgba(8, 23, 43, 0.95) 100%)',
    color: '#dcefff',
    transition: 'transform 130ms ease, border-color 130ms ease, background 130ms ease',
    '&:hover': {
      background: 'linear-gradient(180deg, rgba(20, 55, 96, 0.98) 0%, rgba(12, 34, 62, 0.98) 100%)',
      borderColor: 'rgba(147, 205, 255, 0.7)',
      transform: 'translateY(-1px)',
    },
  },
  confirmButton: {
    minWidth: 96,
    height: 34,
    borderRadius: 5,
    border: '1px solid rgba(148, 206, 255, 0.75)',
    background: 'linear-gradient(180deg, rgba(44, 98, 170, 0.98) 0%, rgba(22, 56, 102, 0.98) 100%)',
    color: '#e8f7ff',
    transition: 'transform 130ms ease, border-color 130ms ease, background 130ms ease, box-shadow 130ms ease',
    '&:hover': {
      background: 'linear-gradient(180deg, rgba(56, 118, 202, 1) 0%, rgba(29, 73, 133, 1) 100%)',
      borderColor: 'rgba(181, 223, 255, 0.92)',
      boxShadow: '0 0 12px rgba(95, 173, 255, 0.38)',
      transform: 'translateY(-1px)',
    },
  },
}));

const InputDialog: React.FC = () => {
  const [fields, setFields] = React.useState<InputProps>({
    heading: '',
    rows: [{ type: 'input', label: '' }],
  });
  const [visible, setVisible] = React.useState(false);
  const { locale } = useLocales();
  const { classes } = useStyles();

  const form = useForm<{ test: { value: any }[] }>({});
  const fieldForm = useFieldArray({
    control: form.control,
    name: 'test',
  });

  useNuiEvent<InputProps>('openDialog', (data) => {
    setFields(data);
    setVisible(true);
    data.rows.forEach((row, index) => {
      fieldForm.insert(
        index,
        {
          value:
            row.type !== 'checkbox'
              ? row.type === 'date' || row.type === 'date-range' || row.type === 'time'
                ? // Set date to current one if default is set to true
                  row.default === true
                  ? new Date().getTime()
                  : Array.isArray(row.default)
                  ? row.default.map((date) => new Date(date).getTime())
                  : row.default && new Date(row.default).getTime()
                : row.default
              : row.checked,
        } || { value: null }
      );
      // Backwards compat with new Select data type
      if (row.type === 'select' || row.type === 'multi-select') {
        row.options = row.options.map((option) =>
          !option.label ? { ...option, label: option.value } : option
        ) as Array<OptionValue>;
      }
    });
  });

  useNuiEvent('closeInputDialog', async () => await handleClose(true));

  const handleClose = async (dontPost?: boolean) => {
    setVisible(false);
    await new Promise((resolve) => setTimeout(resolve, 200));
    form.reset();
    fieldForm.remove();
    if (dontPost) return;
    fetchNui('inputData');
  };

  const onSubmit = form.handleSubmit(async (data) => {
    setVisible(false);
    const values: any[] = [];
    for (let i = 0; i < fields.rows.length; i++) {
      const row = fields.rows[i];

      if ((row.type === 'date' || row.type === 'date-range') && row.returnString) {
        if (!data.test[i]) continue;
        data.test[i].value = dayjs(data.test[i].value).format(row.format || 'DD/MM/YYYY');
      }
    }
    Object.values(data.test).forEach((obj: { value: any }) => values.push(obj.value));
    await new Promise((resolve) => setTimeout(resolve, 200));
    form.reset();
    fieldForm.remove();
    fetchNui('inputData', values);
  });

  return (
    <>
      <Modal
        opened={visible}
        onClose={handleClose}
        centered
        closeOnEscape={fields.options?.allowCancel !== false}
        closeOnClickOutside={false}
        size="xs"
        classNames={{
          modal: classes.modalContent,
          header: classes.modalHeader,
          title: classes.modalTitle,
        }}
        styles={{ body: { color: '#d9edff' } }}
        title={fields.heading}
        withCloseButton={false}
        overlayOpacity={0.5}
        transition="fade"
        exitTransitionDuration={150}
      >
        <form onSubmit={onSubmit}>
          <Stack className={classes.formStack}>
            {fieldForm.fields.map((item, index) => {
              const row = fields.rows[index];
              return (
                <React.Fragment key={item.id}>
                  {row.type === 'input' && (
                    <InputField
                      register={form.register(`test.${index}.value`, { required: row.required })}
                      row={row}
                      index={index}
                    />
                  )}
                  {row.type === 'checkbox' && (
                    <CheckboxField
                      register={form.register(`test.${index}.value`, { required: row.required })}
                      row={row}
                      index={index}
                    />
                  )}
                  {(row.type === 'select' || row.type === 'multi-select') && (
                    <SelectField row={row} index={index} control={form.control} />
                  )}
                  {row.type === 'number' && <NumberField control={form.control} row={row} index={index} />}
                  {row.type === 'slider' && <SliderField control={form.control} row={row} index={index} />}
                  {row.type === 'color' && <ColorField control={form.control} row={row} index={index} />}
                  {row.type === 'time' && <TimeField control={form.control} row={row} index={index} />}
                  {row.type === 'date' || row.type === 'date-range' ? (
                    <DateField control={form.control} row={row} index={index} />
                  ) : null}
                  {row.type === 'textarea' && (
                    <TextareaField
                      register={form.register(`test.${index}.value`, { required: row.required })}
                      row={row}
                      index={index}
                    />
                  )}
                </React.Fragment>
              );
            })}
            <Group position="right" spacing={10}>
              <Button
                uppercase
                variant="default"
                className={classes.cancelButton}
                onClick={() => handleClose()}
                mr={3}
                disabled={fields.options?.allowCancel === false}
              >
                {locale.ui.cancel}
              </Button>
              <Button uppercase variant="light" type="submit" className={classes.confirmButton}>
                {locale.ui.confirm}
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </>
  );
};

export default InputDialog;
