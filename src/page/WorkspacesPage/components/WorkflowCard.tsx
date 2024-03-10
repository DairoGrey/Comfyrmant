import React, { FC } from 'react';

import { Button, Card, CardActions, CardHeader, CardMedia, Stack } from '@mui/material';

type Props = {
  id: string;
  title: string;
};

export const WorkflowCard: FC<Props> = ({ id, title }) => {
  return (
    <Card component={Stack} sx={{ width: 400 }}>
      <CardHeader title={title} subheader={id} />
      <CardMedia component="img" height="200" image="/static/images/cards/paella.jpg" alt="Paella dish" />
      <CardActions>
        <Button>Activate</Button>
      </CardActions>
    </Card>
  );
};
