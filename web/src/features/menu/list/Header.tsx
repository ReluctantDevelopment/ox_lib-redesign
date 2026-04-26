import { Box, createStyles, Text } from '@mantine/core';
import React from 'react';

const useStyles = createStyles(() => ({
  container: {
    textAlign: 'center',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    background: 'linear-gradient(180deg, rgba(13, 42, 78, 0.92) 0%, rgba(8, 25, 48, 0.92) 100%)',
    border: '1px solid rgba(91, 162, 255, 0.45)',
    height: 60,
    width: 384,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    transform: 'rotateY(11deg) skewY(1deg)',
    transformOrigin: 'left center',
    boxShadow: '0 8px 18px rgba(0, 0, 0, 0.35)',
  },
  heading: {
    fontSize: 24,
    textTransform: 'uppercase',
    fontWeight: 700,
    color: '#d9edff',
    letterSpacing: 0.4,
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.45)',
  },
}));

const Header: React.FC<{ title: string }> = ({ title }) => {
  const { classes } = useStyles();

  return (
    <Box className={classes.container}>
      <Text className={classes.heading}>{title}</Text>
    </Box>
  );
};

export default React.memo(Header);
