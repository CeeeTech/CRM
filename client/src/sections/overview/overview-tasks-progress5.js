import PropTypes from 'prop-types';
import ListBulletIcon from '@heroicons/react/24/solid/ListBulletIcon';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  LinearProgress,
  Stack,
  SvgIcon,
  Typography
} from '@mui/material';

export const OverviewTasksProgress5 = (props) => {
  const { value, sx } = props;

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
              color="text.secondary"
              gutterBottom
              variant="overline"
            >
              Fake
            </Typography>
            <Typography variant="h4">
              {value}
            </Typography>
          </Stack>
          
        </Stack>
        <Box sx={{ mt: 3 }}>
          
        </Box>
      </CardContent>
    </Card>
  );
};

OverviewTasksProgress5.propTypes = {
  value: PropTypes.number.isRequired,
  sx: PropTypes.object
};
