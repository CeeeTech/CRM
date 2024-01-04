import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Button,
  Divider,
  CardActions,
  TextField,
  Unstable_Grid2 as Grid,
} from "@mui/material";

export const CourseDetails = ({ selectedCourseId }) => {
  const router = useRouter();

  // initialize values and title
  const [values, setValues] = useState({
    name: "",
    description: "",
  });
  const [formTitle, setFormTitle] = useState("Add New Course");

  useEffect(() => {
    console.log("selectedCourseId:", selectedCourseId);
    // Fetch existing course details if selectedCourseId is provided
    if (selectedCourseId) {
      // Fetch course details based on selectedCourseId and update the form values
      fetchCourseDetails(selectedCourseId);
      setFormTitle("Update Course");
    } else {
      // Reset form values if selectedCourseId is not provided
      setValues({
        name: "",
        description: "",
      });
      setFormTitle("Add New Course");
    }
  }, [selectedCourseId]);

  // fetch selected course details function
  const fetchCourseDetails = async (id) => {
    try {
      const res = await fetch(`http://localhost:8080/api/courses/${id}`);

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();
      console.log(data);
      setValues(data);
    } catch (error) {
      console.log("Error fetching course details:", error);
    }
  };

  // handle change function
  const handleChange = (event) => {
    // implement handle change
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  // handle submit function
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Use different API endpoints for add and update based on selectedCourseId
      const apiUrl = selectedCourseId
        ? `http://localhost:8080/api/course-form-update/${selectedCourseId}`
        : "http://localhost:8080/api/course-form-add-new";

      const res = await fetch(apiUrl, {
        method: selectedCourseId ? "PUT" : "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();
      console.log(data);

      // Clear form values after successful submission
      setValues({
        name: "",
        description: "",
      });

      // Navigate to courses page after successful submission
      router.push("/courses");
    } catch (error) {
      console.log("Error:", error);
    }
  };

  return (
    <form autoComplete="off" noValidate onSubmit={handleSubmit}>
      <Card>
        <CardHeader title={formTitle} />
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ m: -1.5 }}>
            <Grid container spacing={4}>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Course Name"
                  name="name"
                  onChange={handleChange}
                  required
                  value={values.name}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  onChange={handleChange}
                  required
                  type="text"
                  value={values.description}
                />
              </Grid>
            </Grid>
          </Box>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: "flex-end" }}>
          <Button variant="contained" type="submit">
            {selectedCourseId ? "Update Course" : "Add Course"}
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};
