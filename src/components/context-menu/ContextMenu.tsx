import { Children, cloneElement, FC, isValidElement, useCallback, useRef, useState } from 'react';
import React from 'react';

import { Menu, MenuItem, MenuItemProps, MenuProps } from '@mui/material';

import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

type SubMenuItemProps = Omit<MenuItemProps, 'onClick'> & {
  MenuProps: Omit<MenuProps, 'open'>;
};

export const SubMenuItem: FC<SubMenuItemProps> = ({
  MenuProps: { onClose, children: items, ...menuProps },
  children,
  ...props
}) => {
  const ref = useRef<HTMLLIElement>(null);

  const [open, setOpen] = useState(false);

  const handleOpen = useCallback(() => {
    setOpen((v) => !v);
  }, [setOpen]);

  const handleClose = useCallback(
    (e: React.MouseEvent<HTMLLIElement>, reason: 'backdropClick' | 'escapeKeyDown') => {
      setOpen(false);
      onClose?.(e, reason);
    },
    [onClose],
  );

  return (
    <>
      <MenuItem {...props} ref={ref} selected={open} onClick={handleOpen}>
        {children}
        <KeyboardArrowRightIcon />
      </MenuItem>
      <Menu
        {...menuProps}
        open={open}
        onClose={handleClose}
        anchorEl={ref.current}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        {Children.map(items, (element) =>
          isValidElement<MenuItemProps>(element)
            ? cloneElement<MenuItemProps>(element, {
                onClick: element.props.onClick
                  ? (...args: [any]) => {
                      setOpen(false);
                      element.props.onClick?.(...args);
                    }
                  : undefined,
              })
            : element,
        )}
      </Menu>
    </>
  );
};

type Props = MenuProps;

export const ContextMenu: FC<Props> = (props) => {
  return (
    <Menu
      {...props}
      disableAutoFocus
      MenuListProps={{
        autoFocus: false,
        autoFocusItem: false,
        disabledItemsFocusable: false,
        variant: 'menu',
        sx: { minWidth: '320px' },
      }}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    ></Menu>
  );
};
