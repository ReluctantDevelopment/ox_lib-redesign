import { Button, createStyles, Group, Modal, Stack } from '@mantine/core';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { fetchNui } from '../../utils/fetchNui';
import { useLocales } from '../../providers/LocaleProvider';
import remarkGfm from 'remark-gfm';
import type { AlertProps } from '../../typings';
import MarkdownComponents from '../../config/MarkdownComponents';

const useStyles = createStyles(() => ({
  contentStack: {
    color: '#d9edff',
    gap: 10,
    lineHeight: 1.35,
  },
  modalContent: {
    position: 'relative',
    border: '1px solid rgba(104, 176, 255, 0.45)',
    background: 'linear-gradient(180deg, rgba(13, 36, 64, 0.96) 0%, rgba(7, 20, 38, 0.96) 100%)',
    boxShadow: '0 14px 34px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    overflow: 'hidden',
    backdropFilter: 'blur(2px)',
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

const AlertDialog: React.FC = () => {
  const { locale } = useLocales();
  const { classes } = useStyles();
  const [opened, setOpened] = useState(false);
  const [dialogData, setDialogData] = useState<AlertProps>({
    header: '',
    content: '',
  });

  const closeAlert = (button: string) => {
    setOpened(false);
    fetchNui('closeAlert', button);
  };

  useNuiEvent('sendAlert', (data: AlertProps) => {
    setDialogData(data);
    setOpened(true);
  });

  useNuiEvent('closeAlertDialog', () => {
    setOpened(false);
  });

  return (
    <>
      <Modal
        opened={opened}
        centered={dialogData.centered}
        size={dialogData.size || 'md'}
        overflow={dialogData.overflow ? 'inside' : 'outside'}
        closeOnClickOutside={false}
        onClose={() => {
          setOpened(false);
          closeAlert('cancel');
        }}
        withCloseButton={false}
        overlayOpacity={0.5}
        exitTransitionDuration={150}
        transition="fade"
        classNames={{
          modal: classes.modalContent,
          header: classes.modalHeader,
          title: classes.modalTitle,
        }}
        styles={{ body: { color: '#d9edff' } }}
        title={<ReactMarkdown components={MarkdownComponents}>{dialogData.header}</ReactMarkdown>}
      >
        <Stack className={classes.contentStack}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              ...MarkdownComponents,
              img: ({ ...props }) => <img style={{ maxWidth: '100%', maxHeight: '100%' }} {...props} />,
            }}
          >
            {dialogData.content}
          </ReactMarkdown>
          <Group position="right" spacing={10}>
            {dialogData.cancel && (
              <Button uppercase variant="default" className={classes.cancelButton} onClick={() => closeAlert('cancel')} mr={3}>
                {dialogData.labels?.cancel || locale.ui.cancel}
              </Button>
            )}
            <Button
              uppercase
              variant={dialogData.cancel ? 'light' : 'default'}
              className={classes.confirmButton}
              onClick={() => closeAlert('confirm')}
            >
              {dialogData.labels?.confirm || locale.ui.confirm}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
};

export default AlertDialog;
