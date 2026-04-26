import { Checkbox, createStyles } from '@mantine/core';

const useStyles = createStyles(() => ({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    backgroundColor: 'rgba(8, 24, 44, 0.95)',
    borderColor: 'rgba(83, 149, 241, 0.45)',
    '&:checked': { backgroundColor: '#5baeff', borderColor: '#5baeff' },
  },
  inner: {
    '> svg > path': {
      fill: '#0b2647',
    },
  },
}));

const CustomCheckbox: React.FC<{ checked: boolean }> = ({ checked }) => {
  const { classes } = useStyles();
  return (
    <Checkbox
      checked={checked}
      size="md"
      classNames={{ root: classes.root, input: classes.input, inner: classes.inner }}
    />
  );
};

export default CustomCheckbox;
