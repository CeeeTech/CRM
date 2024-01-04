import React, { useState } from "react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import PencilSquareIcon from "@heroicons/react/24/solid/PencilSquareIcon";
import { Button, Box, Card, CardContent, Divider, Stack, SvgIcon, Typography } from "@mui/material";

export const CourseCard = (props) => {
  const { courses } = props;
  const router = useRouter();
  const [isCourseEnabled, setIsCourseEnabled] = useState(courses.status);

  // handle enable/disable course function should pass the course id and current status
  const handleEnableDisable = async (event) => {
    event.preventDefault();
    try {
      const apiUrl = `http://localhost:8080/api/disable-enable-course/${courses._id}`;
      const res = await fetch(apiUrl, {
        method: "PUT",
        body: JSON.stringify({ status: !isCourseEnabled }),
        headers: {
          "Content-type": "application/json",
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      // Update the state without reloading the page
      setIsCourseEnabled(!isCourseEnabled);
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleUpdateClick = () => {
    router.push(`/courses/course-form?courseId=${courses._id}`);
  };

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
          <Button
            variant="contained"
            href="/courses/course-form"
            style={{ backgroundColor: isCourseEnabled ? "red" : "green" }}
            onClick={handleEnableDisable}
          >
            {isCourseEnabled ? "Disable" : "Enable"}
          </Button>
        </Stack>
        <Stack alignItems="center" direction="row" spacing={1}>
          <Button
            onClick={handleUpdateClick}
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
