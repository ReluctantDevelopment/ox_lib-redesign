import React from 'react';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { Box, createStyles, Group, Text } from '@mantine/core';
import ReactMarkdown from 'react-markdown';
import ScaleFade from '../../transitions/ScaleFade';
import remarkGfm from 'remark-gfm';
import type { TextUiPosition, TextUiProps } from '../../typings';
import MarkdownComponents from '../../config/MarkdownComponents';

const useStyles = createStyles((_, params: { position?: TextUiPosition }) => ({
  wrapper: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    display: 'flex',
    alignItems:
      params.position === 'top-center' ? 'baseline' :
      params.position === 'bottom-center' ? 'flex-end' : 'center',
    justifyContent:
      params.position === 'right-center' ? 'flex-end' :
      params.position === 'left-center' ? 'flex-start' : 'center',
    pointerEvents: 'none',
  },
  frame: {
    maxWidth: 'min(560px, calc(100vw - 32px))',
    width: 'max-content',
    margin: 8,
    pointerEvents: 'auto',
  },
  keyBox: {
    minWidth: 34,
    height: 34,
    padding: '0 10px',
    borderRadius: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid rgba(161, 217, 255, 0.78)',
    background: 'linear-gradient(180deg, rgba(72, 153, 238, 0.98) 0%, rgba(34, 97, 173, 0.97) 100%)',
    boxShadow: '0 6px 14px rgba(0, 0, 0, 0.32), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
    color: '#ffffff',
    fontSize: 19,
    fontWeight: 800,
    lineHeight: 1,
    textTransform: 'uppercase',
    fontFamily: 'Montserrat, Roboto, sans-serif',
    letterSpacing: 0.2,
  },
  textContainer: {
    '--b': '2px',
    '--w': '12px',
    border: 'var(--b) solid transparent',
    '--accent': '#9dd8ff',
    '--_g': '#0000 90deg, var(--accent) 0',
    '--_p': 'var(--w) var(--w) border-box no-repeat',
    padding: '6px 12px',
    borderRadius: 2,
    background:
      'conic-gradient(from 90deg at top var(--b) left var(--b), var(--_g)) 0 0 / var(--_p),' +
      'conic-gradient(from 180deg at top var(--b) right var(--b), var(--_g)) 100% 0 / var(--_p),' +
      'conic-gradient(from 0deg at bottom var(--b) left var(--b), var(--_g)) 0 100% / var(--_p),' +
      'conic-gradient(from -90deg at bottom var(--b) right var(--b), var(--_g)) 100% 100% / var(--_p),' +
      'linear-gradient(90deg, rgba(14, 19, 25, 0.94), rgba(17, 28, 38, 0.94))',
    backgroundOrigin: 'border-box',
    backgroundClip: 'border-box',
    boxShadow: '0 8px 18px rgba(0, 0, 0, 0.35)',
  },
  text: {
    color: '#fff',
    opacity: 0.94,
    fontFamily: 'Montserrat, Roboto, sans-serif',
    fontSize: 16,
    fontWeight: 600,
    lineHeight: 'normal',
    letterSpacing: 0.15,
    textShadow: '0 1px 4px #000a, 0 0 1px #000',
    textTransform: 'uppercase',
    '& p': {
      margin: 0,
    },
  },
}));

const TextUI: React.FC = () => {
  const [data, setData] = React.useState<TextUiProps>({
    text: '',
    position: 'right-center',
  });
  const [visible, setVisible] = React.useState(false);
  const { classes } = useStyles({ position: data.position });
  const keyLabel =
    typeof data.icon === 'string' && /^[a-z0-9]{1,3}$/i.test(data.icon) ? data.icon.toUpperCase() : undefined;

  useNuiEvent<TextUiProps>('textUi', (data) => {
    if (!data.position) data.position = 'right-center';
    setData(data);
    setVisible(true);
  });

  useNuiEvent('textUiHide', () => setVisible(false));

  return (
    <>
      <Box className={classes.wrapper}>
        <ScaleFade visible={visible}>
          <Group style={data.style} className={classes.frame} spacing={2} noWrap>
            {keyLabel && <Box className={classes.keyBox}>{keyLabel}</Box>}
            <Box className={classes.textContainer}>
              <Text className={classes.text}>
                <ReactMarkdown components={MarkdownComponents} remarkPlugins={[remarkGfm]}>
                  {data.text}
                </ReactMarkdown>
              </Text>
            </Box>
          </Group>
        </ScaleFade>
      </Box>
    </>
  );
};

export default TextUI;
