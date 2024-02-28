import React, { useCallback } from 'react';
import { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Alert, Slide, Snackbar, Stack } from '@mui/material';

import * as notificationsSel from '_state/features/notifications/selector';
import * as notificationsAct from '_state/features/notifications/slice';

type Props = Record<string, unknown>;

export const Notifications: FC<Props> = () => {
  const dispatch = useDispatch();

  const notifications = useSelector(notificationsSel.getNotifications);

  const handleClose = useCallback((id: string) => {
    dispatch(notificationsAct.remove(id));
  }, []);

  return (
    <Stack gap={1}>
      {Object.entries(notifications).map(([key, notification]) => (
        <Snackbar
          key={key}
          open={Object.values(notifications).length > 0}
          onClose={() => handleClose(notification.id)}
          TransitionComponent={Slide}
          TransitionProps={
            {
              direction: 'up',
            } as any
          }
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity={notification.severity} variant="filled">
            {notification.text}
          </Alert>
        </Snackbar>
      ))}
    </Stack>
  );
};
