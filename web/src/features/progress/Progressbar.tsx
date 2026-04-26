import React from 'react';
import { Box, createStyles, Text } from '@mantine/core';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { fetchNui } from '../../utils/fetchNui';
import ScaleFade from '../../transitions/ScaleFade';
import type { ProgressbarProps } from '../../typings';

const useStyles = createStyles(() => ({
  container: {
    width: 390,
    padding: '12px 14px',
    borderRadius: 12,
    background: 'linear-gradient(165deg, rgba(6, 16, 30, 0.95), rgba(10, 26, 42, 0.92))',
    border: '1px solid rgba(131, 192, 255, 0.2)',
    boxShadow: '0 10px 34px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.06)',
    overflow: 'hidden',
  },
  wrapper: {
    width: '100%',
    height: '22%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 0,
    position: 'absolute',
  },
  header: {
    position: 'relative',
    zIndex: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    gap: 12,
  },
  label: {
    maxWidth: 250,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    fontSize: 15,
    fontWeight: 700,
    color: '#f4faff',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
    letterSpacing: 0.35,
    textTransform: 'uppercase',
  },
  badges: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  badge: {
    borderRadius: 999,
    padding: '2px 8px',
    fontSize: 12,
    fontWeight: 700,
    lineHeight: 1.6,
    color: '#eaf6ff',
    background: 'rgba(70, 126, 179, 0.28)',
    border: '1px solid rgba(136, 201, 255, 0.25)',
    fontVariantNumeric: 'tabular-nums',
  },
  track: {
    width: '100%',
    height: 12,
    borderRadius: 999,
    background: 'rgba(6, 20, 34, 0.92)',
    border: '1px solid rgba(130, 195, 255, 0.2)',
    overflow: 'hidden',
    boxShadow: 'inset 0 0 0 1px rgba(0, 0, 0, 0.16)',
  },
  fill: {
    height: '100%',
    borderRadius: 999,
    background: '#4fb2ff',
    boxShadow: '0 0 10px rgba(84, 178, 255, 0.55)',
    transition: 'width 0.08s linear',
  },
}));

const Progressbar: React.FC = () => {
  const { classes } = useStyles();
  const [visible, setVisible] = React.useState(false);
  const [label, setLabel] = React.useState('');
  const [duration, setDuration] = React.useState(0);
  const [progress, setProgress] = React.useState(0);
  const rafRef = React.useRef<number>();
  const lastUpdateRef = React.useRef(0);
  const progressPercent = Math.round(progress);
  const remainingSeconds = Math.max(0, Math.ceil(((100 - progressPercent) / 100) * (duration / 1000)));

  useNuiEvent('progressCancel', () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setVisible(false);
    setProgress(0);
  });

  useNuiEvent<ProgressbarProps>('progress', (data) => {
    setVisible(true);
    setLabel(data.label);
    setDuration(data.duration);
    setProgress(0);
  });

  React.useEffect(() => {
    if (!visible || duration <= 0) return;

    const startTime = performance.now();
    lastUpdateRef.current = 0;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const nextProgress = Math.min((elapsed / duration) * 100, 100);

      // Throttle state updates to reduce renders while keeping movement smooth.
      if (now - lastUpdateRef.current >= 33 || nextProgress >= 100) {
        lastUpdateRef.current = now;
        setProgress(nextProgress);
      }

      if (nextProgress >= 100) {
        setVisible(false);
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [visible, duration]);

  return (
    <>
      <Box className={classes.wrapper}>
        <ScaleFade visible={visible} onExitComplete={() => fetchNui('progressComplete')}>
          <Box className={classes.container}>
            <Box className={classes.header}>
              <Text className={classes.label}>{label}</Text>
              <Box className={classes.badges}>
                <Text className={classes.badge}>{remainingSeconds}s</Text>
                <Text className={classes.badge}>{progressPercent}%</Text>
              </Box>
            </Box>
            <Box className={classes.track}>
              <Box className={classes.fill} style={{ width: `${progress}%` }} />
            </Box>
          </Box>
        </ScaleFade>
      </Box>
    </>
  );
};

export default Progressbar;
