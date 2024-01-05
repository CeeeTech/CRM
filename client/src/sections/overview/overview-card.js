import PropTypes from 'prop-types';
import { Card, CardContent, Stack, Typography } from '@mui/material';

export const OverviewCard = (props) => {
  const { difference, positive = false, sx, value,heading } = props;

  return (
    <Card sx={sx}>
      <CardContent>
        <Stack
          alignItems="flex-start"
          direction="row"
          justifyContent="space-between"
          spacing={3}
        >
          <Stack spacing={1}>
            <Typography
              variant="overline"
              color="text.primary"
            >
              {heading}
            </Typography>
            <Typography variant="h4">
              {value}
            </Typography>
          </Stack>
        </Stack>
        {difference && (
          <Stack
            alignItems="center"
            direction="row"
            spacing={2}
            sx={{ mt: 2 }}
          >
            <Stack
              alignItems="center"
              direction="row"
              spacing={0.5}
            >
              
              
            </Stack>
            
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};

OverviewCard.prototypes = {
  difference: PropTypes.number,
  positive: PropTypes.bool,
  sx: PropTypes.object,
  value: PropTypes.string.isRequired
};
