import React, { useEffect, useState } from 'react';
import { Box, createStyles, Text } from '@mantine/core';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { useNuiEvent } from '../../../hooks/useNuiEvent';
import { fetchNui } from '../../../utils/fetchNui';
import { isIconUrl } from '../../../utils/isIconUrl';
import type { RadialMenuItem } from '../../../typings';
import { useLocales } from '../../../providers/LocaleProvider';
import LibIcon from '../../../components/LibIcon';

const useStyles = createStyles(() => ({
  wrapper: {
    position: 'fixed',
    inset: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'transparent',
    pointerEvents: 'none',
  },
  radialContainer: {
    position: 'relative',
    width: 400,
    height: 400,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'auto',
  },
  menuItem: {
    position: 'absolute',
    width: 78,
    height: 78,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    cursor: 'pointer',
    transition: 'transform 0.14s ease, background 0.14s ease, border-color 0.14s ease, box-shadow 0.14s ease',
    borderRadius: 10,
    background: 'linear-gradient(180deg, rgba(8, 16, 28, 0.96) 0%, rgba(16, 47, 84, 0.94) 100%)',
    border: '1px solid rgba(117, 186, 255, 0.5)',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
    '&:hover': {
      transform: 'scale(1.06)',
      background: 'linear-gradient(180deg, rgba(22, 66, 118, 0.98) 0%, rgba(43, 112, 191, 0.96) 100%)',
      borderColor: 'rgba(169, 217, 255, 0.85)',
      boxShadow: '0 6px 12px rgba(0, 0, 0, 0.36)',
    },
  },
  menuIcon: {
    fontSize: 24,
    color: '#e6f5ff',
  },
  menuLabel: {
    fontSize: 10,
    fontWeight: 700,
    color: '#eaf7ff',
    textAlign: 'center',
    lineHeight: 1.15,
    maxWidth: '92%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.6)',
    letterSpacing: 0.2,
    textTransform: 'uppercase',
  },
  centerButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 68,
    height: 68,
    borderRadius: '50%',
    background: 'linear-gradient(180deg, rgba(8, 16, 28, 0.97) 0%, rgba(18, 54, 96, 0.95) 100%)',
    border: '2px solid rgba(127, 196, 255, 0.75)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'transform 0.16s ease, border-color 0.16s ease, box-shadow 0.16s ease',
    boxShadow: '0 8px 18px rgba(0, 0, 0, 0.42)',
    '&:hover': {
      transform: 'translate(-50%, -50%) scale(1.05)',
      borderColor: 'rgba(171, 219, 255, 0.9)',
      boxShadow: '0 10px 22px rgba(0, 0, 0, 0.46)',
    },
  },
  closeIcon: {
    fontSize: 24,
    color: '#e9f7ff',
  },
  paginationIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, 58px)',
    display: 'flex',
    gap: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.3)',
    transition: 'all 0.16s ease',
  },
  paginationDotActive: {
    background: '#8fd2ff',
    transform: 'scale(1.25)',
    boxShadow: '0 0 8px rgba(143, 210, 255, 0.85)',
  },
}));

const ITEMS_PER_PAGE = 8;

const getPageItems = (items: RadialMenuItem[], page: number, moreLabel: string) => {
  if (!items || items.length <= ITEMS_PER_PAGE) return items || [];

  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  let pageItems = items.slice(startIndex, endIndex);

  if (endIndex < items.length) {
    pageItems = pageItems.slice(0, ITEMS_PER_PAGE - 1);
    pageItems.push({ icon: 'ellipsis-h', label: moreLabel, isMore: true });
  }

  return pageItems;
};

const RadialMenu: React.FC = () => {
  const { classes } = useStyles();
  const { locale } = useLocales();
  const [visible, setVisible] = useState(false);
  const [radialMenu, setRadialMenu] = useState<{ items: RadialMenuItem[]; sub?: boolean; page: number }>({
    items: [],
    sub: false,
    page: 1,
  });
  const [menuItems, setMenuItems] = useState<RadialMenuItem[]>([]);
  const closeRadial = () => {
    setVisible(false);
    setMenuItems([]);
    fetchNui('radialClose');
  };

  const changePage = async (increment?: boolean) => {
    const didTransition: boolean = await fetchNui('radialTransition');
    if (!didTransition) return;
    setRadialMenu((prev) => {
      const nextPage = increment ? prev.page + 1 : prev.page - 1;
      setMenuItems(getPageItems(prev.items, nextPage, locale.ui.more));
      return { ...prev, page: nextPage };
    });
  };

  const handleBackButton = () => {
    if (radialMenu.page > 1) changePage(false);
    else if (radialMenu.sub) fetchNui('radialBack');
    else closeRadial();
  };

  const totalPages = Math.ceil((radialMenu.items?.length || 0) / ITEMS_PER_PAGE);

  useEffect(() => {
    setMenuItems(getPageItems(radialMenu.items, radialMenu.page, locale.ui.more));
  }, [radialMenu.items, radialMenu.page, locale.ui.more]);

  useNuiEvent('openRadialMenu', async (data: { items: RadialMenuItem[]; sub?: boolean; option?: string } | false) => {
    if (!data) {
      setVisible(false);
      setMenuItems([]);
      return;
    }

    let initialPage = 1;
    if (data.option) {
      const optionIndex = data.items.findIndex((item) => item.menu === data.option);
      if (optionIndex !== -1) initialPage = Math.floor(optionIndex / ITEMS_PER_PAGE) + 1;
    }

    setMenuItems(getPageItems(data.items, initialPage, locale.ui.more));
    setRadialMenu({ ...data, page: initialPage });
    setVisible(true);
  });

  useNuiEvent('refreshItems', (data: RadialMenuItem[]) => {
    setRadialMenu((prev) => ({ ...prev, items: data }));
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && visible) {
        event.preventDefault();
        closeRadial();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [visible]);

  const handleItemClick = async (item: RadialMenuItem, index: number) => {
    if (item.isMore) {
      await changePage(true);
      return;
    }

    const clickIndex = radialMenu.page === 1 ? index : (radialMenu.page - 1) * ITEMS_PER_PAGE + index;
    fetchNui('radialClick', clickIndex);
  };

  const handleRightClick = async (event: React.MouseEvent) => {
    event.preventDefault();
    if (radialMenu.page > 1) await changePage(false);
    else if (radialMenu.sub) fetchNui('radialBack');
  };

  const getCircularPosition = (index: number, total: number, radius = 138) => {
    if (total === 1) return { x: 0, y: -radius * 0.7 };
    const angle = (2 * Math.PI * index) / total - Math.PI / 2;
    return { x: radius * Math.cos(angle), y: radius * Math.sin(angle) };
  };

  return (
    <>
      {visible && (
        <Box className={classes.wrapper} onContextMenu={handleRightClick}>
          <Box className={classes.radialContainer}>
            {menuItems.map((item, index) => {
              const position = getCircularPosition(index, menuItems.length);
              return (
                <Box
                  key={`radial-item-${index}`}
                  className={classes.menuItem}
                  style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
                  onClick={() => handleItemClick(item, index)}
                >
                  <Box className={classes.menuIcon}>
                    {typeof item.icon === 'string' && isIconUrl(item.icon) ? (
                      <img
                        src={item.icon}
                        width={Math.min(Math.max(item.iconWidth || 24, 16), 32)}
                        height={Math.min(Math.max(item.iconHeight || 24, 16), 32)}
                        alt={item.label}
                      />
                    ) : (
                      <LibIcon icon={item.icon as IconProp} fontSize={24} fixedWidth />
                    )}
                  </Box>
                  <Text className={classes.menuLabel}>{item.label}</Text>
                </Box>
              );
            })}

            <Box className={classes.centerButton} onClick={handleBackButton}>
              <LibIcon
                icon={radialMenu.page > 1 || radialMenu.sub ? 'arrow-left' : 'xmark'}
                className={classes.closeIcon}
              />
            </Box>

            {totalPages > 1 && (
              <Box className={classes.paginationIndicator}>
                {Array.from({ length: totalPages }, (_, i) => (
                  <Box
                    key={i}
                    className={`${classes.paginationDot} ${
                      i + 1 === radialMenu.page ? classes.paginationDotActive : ''
                    }`}
                  />
                ))}
              </Box>
            )}
          </Box>
        </Box>
      )}
    </>
  );
};

export default RadialMenu;
