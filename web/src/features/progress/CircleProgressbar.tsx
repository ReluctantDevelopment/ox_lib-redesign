import React from 'react';
import { createStyles, RingProgress, Stack, Text } from '@mantine/core';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { fetchNui } from '../../utils/fetchNui';
import ScaleFade from '../../transitions/ScaleFade';
import type { CircleProgressbarProps } from '../../typings';

const useStyles = createStyles((_, params: { position: 'middle' | 'bottom' }) => ({
  container: {
    width: '100%',
    height: params.position === 'middle' ? '100%' : '20%',
    bottom: 0,
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progress: {
    filter: 'drop-shadow(0 0 10px rgba(80, 178, 255, 0.22))',
    '> svg > circle:nth-child(1)': {
      stroke: 'rgba(14, 48, 86, 0.82)',
    },
    '> svg > circle:nth-child(2)': {
      strokeLinecap: 'round',
      stroke: '#54a4ff',
    },
  },
  value: {
    textAlign: 'center',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.6)',
    color: '#eaf7ff',
    fontWeight: 700,
    fontSize: 17,
    lineHeight: 1,
    letterSpacing: 0.4,
    fontVariantNumeric: 'tabular-nums',
  },
  label: {
    textAlign: 'center',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.58)',
    color: '#f2f9ff',
    minHeight: 24,
    fontWeight: 700,
    fontSize: 15,
    maxWidth: 300,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    marginTop: 10,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  wrapper: {
    marginTop: params.position === 'middle' ? 25 : undefined,
  },
}));

const CircleProgressbar: React.FC = () => {
  const [visible, setVisible] = React.useState(false);
  const [progressDuration, setProgressDuration] = React.useState(0);
  const [position, setPosition] = React.useState<'middle' | 'bottom'>('middle');
  const [value, setValue] = React.useState(0);
  const [label, setLabel] = React.useState('');
  const activeRef = React.useRef(false);
  const rafRef = React.useRef<number>();
  const lastUpdateRef = React.useRef(0);
  const { classes } = useStyles({ position });

  useNuiEvent('progressCancel', () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    activeRef.current = false;
    setValue(0);
    setVisible(false);
  });

  useNuiEvent<CircleProgressbarProps>('circleProgress', (data) => {
    if (activeRef.current) return;
    activeRef.current = true;
    setVisible(true);
    setValue(0);
    setLabel(data.label || '');
    setProgressDuration(data.duration);
    setPosition(data.position || 'middle');
  });

  React.useEffect(() => {
    if (!visible || progressDuration <= 0) return;

    const startTime = performance.now();
    lastUpdateRef.current = 0;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const nextProgress = Math.min((elapsed / progressDuration) * 100, 100);

      if (now - lastUpdateRef.current >= 33 || nextProgress >= 100) {
        lastUpdateRef.current = now;
        const rounded = Math.round(nextProgress);
        setValue((prev) => (prev === rounded ? prev : rounded));
      }

      if (nextProgress >= 100) {
        activeRef.current = false;
        setVisible(false);
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      activeRef.current = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [visible, progressDuration]);

  return (
    <>
      <Stack spacing={0} className={classes.container}>
        <ScaleFade visible={visible} onExitComplete={() => fetchNui('progressComplete')}>
          <Stack spacing={0} align="center" className={classes.wrapper}>
            <RingProgress
              size={122}
              thickness={9}
              roundCaps
              sections={[{ value, color: '#67b8ef' }]}
              className={classes.progress}
              label={<Text className={classes.value}>{value}%</Text>}
            />
            {label && <Text className={classes.label}>{label}</Text>}
          </Stack>
        </ScaleFade>
      </Stack>
    </>
  );
};

export default CircleProgressbar;
