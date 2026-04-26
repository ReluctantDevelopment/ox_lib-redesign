import { Button, createStyles } from '@mantine/core';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import LibIcon from '../../../../components/LibIcon';

interface Props {
  icon: IconProp;
  canClose?: boolean;
  iconSize: number;
  handleClick: () => void;
}

const useStyles = createStyles((_, params: { canClose?: boolean }) => ({
  button: {
    borderRadius: 4,
    flex: '1 15%',
    alignSelf: 'stretch',
    height: 'auto',
    textAlign: 'center',
    justifyContent: 'center',
    padding: 2,
    background: 'linear-gradient(180deg, rgba(8, 16, 28, 0.96) 0%, rgba(15, 43, 79, 0.94) 100%)',
    border: '1px solid rgba(121, 186, 255, 0.46)',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.42), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
    transition: 'background 140ms ease, border-color 140ms ease, transform 140ms ease',
    '&:hover': {
      background: 'linear-gradient(180deg, rgba(18, 56, 100, 0.97) 0%, rgba(35, 96, 168, 0.97) 100%)',
      borderColor: 'rgba(165, 214, 255, 0.82)',
      transform: 'translateX(1px) translateY(-1px) translateZ(4px)',
    },
  },
  root: {
    border: 'none',
  },
  label: {
    color: params.canClose === false ? '#6c87ab' : '#d9edff',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
  },
}));

const HeaderButton: React.FC<Props> = ({ icon, canClose, iconSize, handleClick }) => {
  const { classes } = useStyles({ canClose });

  return (
    <Button
      variant="default"
      className={classes.button}
      classNames={{ label: classes.label, root: classes.root }}
      disabled={canClose === false}
      onClick={handleClick}
    >
      <LibIcon icon={icon} fontSize={iconSize} fixedWidth />
    </Button>
  );
};

export default HeaderButton;
