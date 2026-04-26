import { useNuiEvent } from '../../hooks/useNuiEvent';
import { toast, Toaster } from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import { Box, createStyles, keyframes, Stack, Text } from '@mantine/core';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCircleInfo, faTriangleExclamation, faXmark } from '@fortawesome/free-solid-svg-icons';
import type { NotificationProps } from '../../typings';
import MarkdownComponents from '../../config/MarkdownComponents';

const useStyles = createStyles(() => ({
  container: {
    width: 'fit-content',
    maxWidth: 'min(420px, calc(100vw - 40px))',
    minHeight: 52,
    color: '#fff',
    padding: '9px 12px 9px 10px',
    borderRadius: 4,
    fontFamily: 'Montserrat, Roboto, sans-serif',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    position: 'relative',
    overflow: 'hidden',
    pointerEvents: 'auto',
    '--b': '2px',
    '--w': '14px',
    border: 'var(--b) solid transparent',
    '--_g': '#0000 90deg, var(--accent) 0',
    '--_p': 'var(--w) var(--w) border-box no-repeat',
    background:
      'conic-gradient(from 90deg at top var(--b) left var(--b), var(--_g)) 0 0 / var(--_p),' +
      'conic-gradient(from 180deg at top var(--b) right var(--b), var(--_g)) 100% 0 / var(--_p),' +
      'conic-gradient(from 0deg at bottom var(--b) left var(--b), var(--_g)) 0 100% / var(--_p),' +
      'conic-gradient(from -90deg at bottom var(--b) right var(--b), var(--_g)) 100% 100% / var(--_p),' +
      'linear-gradient(90deg, var(--bgStart), var(--bgEnd))',
    backgroundOrigin: 'border-box',
    backgroundClip: 'border-box',
    boxShadow: '0 8px 18px rgba(0, 0, 0, 0.28)',
  },
  icon: {
    width: 22,
    height: 20,
    borderRadius: 0,
    clipPath: 'polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%)',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
    color: '#f4f9ff',
    background: 'var(--iconBg)',
    boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.24), 0 1px 3px rgba(0, 0, 0, 0.38)',
    position: 'relative',
    zIndex: 1,
  },
  iconGlyph: {
    filter: 'drop-shadow(0 1px 1px rgba(0, 0, 0, 0.4))',
    width: 10,
    height: 10,
    display: 'block',
  },
  body: {
    minWidth: 0,
    position: 'relative',
    zIndex: 1,
  },
  itemError: {
    '--stroke': 'rgba(241, 120, 120, 0.8)',
    '--bgStart': 'rgba(20, 14, 16, 0.94)',
    '--bgEnd': 'rgba(32, 18, 21, 0.94)',
    '--accent': '#ff9f9f',
    '--iconBg': 'linear-gradient(180deg, rgba(251, 176, 176, 0.95), rgba(217, 97, 97, 0.95))',
  },
  itemInfo: {
    '--stroke': 'rgba(127, 196, 255, 0.82)',
    '--bgStart': 'rgba(14, 19, 25, 0.94)',
    '--bgEnd': 'rgba(17, 28, 38, 0.94)',
    '--accent': '#9dd8ff',
    '--iconBg': 'linear-gradient(180deg, rgba(181, 224, 255, 0.95), rgba(82, 159, 230, 0.95))',
  },
  itemSuccess: {
    '--stroke': 'rgba(120, 224, 171, 0.8)',
    '--bgStart': 'rgba(14, 22, 18, 0.94)',
    '--bgEnd': 'rgba(16, 31, 23, 0.94)',
    '--accent': '#94efc0',
    '--iconBg': 'linear-gradient(180deg, rgba(180, 242, 212, 0.95), rgba(72, 178, 130, 0.95))',
  },
  itemWarning: {
    '--stroke': 'rgba(245, 200, 115, 0.82)',
    '--bgStart': 'rgba(22, 19, 14, 0.94)',
    '--bgEnd': 'rgba(36, 29, 17, 0.94)',
    '--accent': '#ffda93',
    '--iconBg': 'linear-gradient(180deg, rgba(248, 223, 160, 0.95), rgba(206, 151, 63, 0.95))',
  },
  title: {
    marginTop: 1,
    fontSize: 12,
    fontWeight: 700,
    color: '#f4f8ff',
    opacity: 0.98,
    textShadow: '0 1px 3px #0008',
    letterSpacing: 0.15,
    lineHeight: 'normal',
  },
  description: {
    marginTop: 1,
    fontSize: 11,
    color: '#fff',
    opacity: 0.94,
    textShadow: '0 1px 4px #000a, 0 0 1px #000',
    letterSpacing: 0.15,
    lineHeight: 'normal',
    fontWeight: 600,
  },
  descriptionOnly: {
    marginTop: 1,
    fontSize: 11,
    color: '#fff',
    opacity: 0.94,
    textShadow: '0 1px 4px #000a, 0 0 1px #000',
    letterSpacing: 0.15,
    lineHeight: 'normal',
    fontWeight: 600,
  },
}));

const createAnimation = (from: string, to: string, visible: boolean) =>
  keyframes({
    from: {
      opacity: visible ? 0 : 1,
      transform: from,
    },
    to: {
      opacity: visible ? 1 : 0,
      transform: to,
    },
  });

const getAnimation = (visible: boolean, position: string) => {
  const animationOptions = visible ? '0.2s ease-out forwards' : '0.4s ease-in forwards';
  let animation: { from: string; to: string };

  if (visible) {
    animation = position.includes('bottom')
      ? { from: 'translateY(30px)', to: 'translateY(0px)' }
      : { from: 'translateY(-30px)', to: 'translateY(0px)' };
  } else {
    if (position.includes('right')) {
      animation = { from: 'translateX(0px)', to: 'translateX(100%)' };
    } else if (position.includes('left')) {
      animation = { from: 'translateX(0px)', to: 'translateX(-100%)' };
    } else if (position === 'top-center') {
      animation = { from: 'translateY(0px)', to: 'translateY(-100%)' };
    } else if (position === 'bottom') {
      animation = { from: 'translateY(0px)', to: 'translateY(100%)' };
    } else {
      animation = { from: 'translateX(0px)', to: 'translateX(100%)' };
    }
  }

  return `${createAnimation(animation.from, animation.to, visible)} ${animationOptions}`;
};

const Notifications: React.FC = () => {
  const { classes } = useStyles();

  useNuiEvent<NotificationProps>('notify', (data) => {
    if (!data.title && !data.description) return;

    const toastId = data.id?.toString();
    const duration = data.duration || 3000;

    let position = data.position || 'top-right';
    const variant =
      data.type === 'error'
        ? 'error'
        : data.type === 'success'
        ? 'success'
        : data.type === 'warning'
        ? 'warning'
        : 'info';
    const title =
      data.title && data.title.trim().length > 0
        ? data.title
        : variant === 'info'
        ? 'System Info'
        : variant === 'success'
        ? 'Success'
        : variant === 'warning'
        ? 'Warning'
        : 'Error';
    const icon =
      variant === 'success'
        ? faCheck
        : variant === 'warning'
        ? faTriangleExclamation
        : variant === 'error'
        ? faXmark
        : faCircleInfo;

    // Backwards compat with old notifications
    switch (position) {
      case 'top':
        position = 'top-center';
        break;
      case 'bottom':
        position = 'bottom-center';
        break;
    }

    toast.custom(
      (t) => (
        <Box
          sx={{
            animation: getAnimation(t.visible, position),
            ...data.style,
          }}
          className={`${classes.container} ${
            variant === 'error'
              ? classes.itemError
              : variant === 'success'
              ? classes.itemSuccess
              : variant === 'warning'
              ? classes.itemWarning
              : classes.itemInfo
          }`}
        >
          <Box className={classes.icon}>
            <FontAwesomeIcon icon={icon} className={classes.iconGlyph} fixedWidth />
          </Box>
          <Stack spacing={0} className={classes.body}>
            <Text className={classes.title}>{title}</Text>
            {data.description && (
              <ReactMarkdown
                components={MarkdownComponents}
                className={`${data.description && title ? classes.description : classes.descriptionOnly} description`}
              >
                {data.description}
              </ReactMarkdown>
            )}
          </Stack>
        </Box>
      ),
      {
        id: toastId,
        duration: duration,
        position: position,
      }
    );
  });

  return (
    <Toaster
      containerStyle={{
        position: 'absolute',
        top: '5%',
        right: 12,
        height: 560,
        maxWidth: 'calc(100vw - 24px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 10,
        pointerEvents: 'none',
        zIndex: 200,
        filter: 'drop-shadow(0 0 14px #a46bff00)',
      }}
    />
  );
};

export default Notifications;
