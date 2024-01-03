import PropTypes from "prop-types";
import PencilSquareIcon from "@heroicons/react/24/solid/PencilSquareIcon";
import { Button, Box, Card, CardContent, Divider, Stack, SvgIcon, Typography } from "@mui/material";

export const CourseCard = (props) => {
  const { courses } = props;

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            pb: 3,
          }}
        ></Box>
        <Typography align="center" gutterBottom variant="h5">
          {courses.name}
        </Typography>
        <Typography align="center" variant="body1">
          {courses.description}
        </Typography>
      </CardContent>
      <Box sx={{ flexGrow: 1 }} />
      <Divider />
      <Stack
        alignItems="center"
        direction="row"
        justifyContent="space-between"
        spacing={2}
        sx={{ p: 2 }}
      >
        <Stack alignItems="center" direction="row" spacing={1}>
          <Button variant="contained" href="/auth/add-new-course">
            Disable
          </Button>
        </Stack>
        <Stack alignItems="center" direction="row" spacing={1}>
          <Button
            href="/auth/add-new-course"
            color="inherit"
            startIcon={
              <SvgIcon fontSize="small">
                <PencilSquareIcon />
              </SvgIcon>
            }
          ></Button>
        </Stack>
      </Stack>
    </Card>
  );
};

CourseCard.propTypes = {
  courses: PropTypes.object.isRequired,
};

