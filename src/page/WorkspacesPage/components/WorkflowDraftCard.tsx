import React, { FC } from 'react';
import { useSelector } from 'react-redux';

import { Avatar, Box, Button, Card, CardActions, CardContent, CardHeader, Stack } from '@mui/material';

import * as workflowSel from '_state/features/workflow/selector';

export const WorkflowDraftCard: FC = () => {
  const id = useSelector(workflowSel.getId);
  const title = useSelector(workflowSel.getTitle);

  return (
    <Card component={Stack} sx={{ width: 400 }}>
      <CardHeader avatar={<Avatar>R</Avatar>} title={title || 'Untitled'} subheader={id} />
      <CardContent component={Box} flex={1} height={200}></CardContent>
      <CardActions>
        <Button color="success">Save</Button>
      </CardActions>
    </Card>
  );
};
