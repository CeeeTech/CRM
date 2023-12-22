import { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Unstable_Grid2 as Grid
} from '@mui/material';

export const AccountProfileDetails = ({ selectedLeadId, lead }) => {

  // console.log("Selected Lead  in AccountProfileDetails:", lead);

  const [branches, setBranches] = useState(null);
  const [statuses, setStatuses] = useState(null);
  const [courses, setCourses] = useState(null);
  const [update, setUpdate] = useState(false);

  const date = new Date();
  const formattedDate = date.toISOString().split('T')[0];

  function formatDate(inputDate) {
    const date = new Date(inputDate);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  }

  const [values, setValues] = useState({
    name: '',
    dob: formattedDate,
    email: '',
    phone: '',
    address: '',
    date: formattedDate,
    scheduled_to: formattedDate,
    course: 'Computer Science',
    branch: 'Colombo',
    status: 'Registered',
    comment: ''
  });


  useEffect(() => {
    const fetchLeadData = async () => {
      try {
        const leadResponse = await fetch(`http://localhost:8080/api/leads/${selectedLeadId}`);
        const leadJson = await leadResponse.json();

        if (leadResponse.ok) {
          setUpdate(true);
          setValues({
            name: lead.name,
            dob: formatDate(lead.dob),
            email: lead.email,
            phone: lead.mobile,
            address: lead.address,
            date: formatDate(lead.date),
            scheduled_to: formatDate(lead.scheduled_to),
            course: lead.course,
            branch: lead.branch,
            status: lead.status,
            comment: lead.comment
          })
          console.log("update true");
        }
      } catch (error) {
        console.log(error);
      }
    };
    const fetchData = async () => {
      await fetchLeadData();
    };
    fetchData();
    const fetchBranches = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/branches');
        if (response.ok) {
          const json = await response.json();
          setBranches(json);
        } else {
          console.error('Error fetching branches:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching branches:', error.message);
      }
    };
    const fetchStatuses = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/status');
        if (response.ok) {
          const json = await response.json();
          setStatuses(json);
        } else {
          console.error('Error fetching  status:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching status:', error.message);
      }
    };
    const fetchCourses = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/courses');
        if (response.ok) {
          const json = await response.json();
          setCourses(json);
        } else {
          console.error('Error fetching courses:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching courses:', error.message);
      }
    };
    fetchBranches()
    fetchStatuses()
    fetchCourses()
  }, [selectedLeadId, update])




  const handleChange = useCallback(
    (event) => {
      setValues((prevState) => ({
        ...prevState,
        [event.target.name]: event.target.value
      }));
    },
    [selectedLeadId, update]
  );

  // useEffect(() => {
  //   console.log('Updated values', values);
  // }, [values, update]);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      try {
        if (!update) {
          //insert student data
          const studentResponse = await fetch('http://localhost:8080/api/students', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: values.name,
              dob: values.dob,
              contact_no: values.phone,
              email: values.email,
              address: values.address
            })
          });
          if (!studentResponse.ok) {
            console.error("Error inserting data to the student table", studentResponse.statusText)
            return
          }
          const studentData = await studentResponse.json();
          const { _id: student_id } = studentData;
          console.log("Student ID:", student_id);
          //insert lead data
          const leadResponse = await fetch('http://localhost:8080/api/leads', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              "date": values.date,
              "sheduled_to": values.scheduled_to,
              "course_name": values.course,
              "branch_name": values.branch,
              "student_id": student_id
            })
          })
          if (!leadResponse.ok) {
            console.error("Error inserting data to the lead table", leadResponse.statusText);
            return
          }
          const leadData = await leadResponse.json();
          const { _id: lead_id } = leadData;
          console.log("Lead ID:", lead_id);
          //insert follow-up data
          const followUpResponse = await fetch('http://localhost:8080/api/followUps', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(
              {
                "lead_id": lead_id,
                "user": 'Hana Amaily',
                "status": values.status,
                "comment": values.comment
              }
            )
          });
          if (!followUpResponse.ok) {
            console.error("Error inserting followup data", followUpResponse.statusText);
            return
          }
          console.log('Data inserted successfully!');
        } else {
          //update code
          const selectedStatusId = statuses.find((option) => option.name === values.status)?._id;
          const updateFollowup = await fetch(`http://localhost:8080/api/followUps/${lead.followUp_id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              "status_id": selectedStatusId,
              "comment": values.comment
            })
          })
          if (!updateFollowup.ok) {
            console.error("Error updating followup data", updateFollowup.statusText);
            return
          }
          console.log('Data updated successfully!');
        }
        setValues({
          name: '',
          dob: formattedDate,
          email: '',
          phone: '',
          address: '',
          date: formattedDate,
          scheduled_to: formattedDate,
          course: 'Computer Science',
          branch: 'Colombo',
          status: 'Registered',
          comment: ''
        })
      } catch (error) {
        console.error('Error during data insertion:', error.message);
      }
    },
    [values, update]
  );

  return (
    <form
      autoComplete="off"
      noValidate
      onSubmit={handleSubmit}
    >
      <Card>
        {update ? (<CardHeader
          title="Update Lead"
        />) : (<CardHeader
          title=" Add New Lead"
        />)}
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ m: -1.5 }}>
            <Grid
              container
              spacing={3}
            >
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  helperText="Please specify the student name"
                  label="Name"
                  name="name"
                  onChange={handleChange}
                  required
                  value={values.name}
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="Date of Birth"
                  name="dob"
                  onChange={handleChange}
                  required
                  type='date'
                  value={values.dob}
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  onChange={handleChange}
                  required
                  value={values.email}
                />
              </Grid>

              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  onChange={handleChange}
                  type="number"
                  value={values.phone}
                  required
                />
              </Grid>

              <Grid
                xs={12}
                md={12}
              >
                <TextField
                  fullWidth
                  label="Address"
                  name="address"
                  onChange={handleChange}
                  type="text"
                  value={values.address}
                  required
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="Date"
                  name="date"
                  onChange={handleChange}
                  type="text"
                  value={values.date}
                  required
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="Scheduled to"
                  name="scheduled_to"
                  onChange={handleChange}
                  type="date"
                  value={values.scheduled_to}
                  required
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="Select Course"
                  name="course"
                  onChange={handleChange}
                  required
                  select
                  SelectProps={{ native: true }}
                  value={values.course}
                >
                  {courses && courses.length > 0 ? (
                    courses.map((option) => (
                      <option key={option._id} value={option.name}>
                        {option.name}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      No Statuses available
                    </option>
                  )}
                </TextField>
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="Select Branch"
                  name="branch"
                  onChange={handleChange}
                  required
                  select
                  SelectProps={{ native: true }}
                  value={values.branch}
                >
                  {/* Ensure branches is an array and has elements */}
                  {branches && branches.length > 0 ? (
                    branches.map((option) => (
                      // Ensure each option has a unique key
                      <option key={option._id} value={option.name}>
                        {option.name}
                      </option>
                    ))
                  ) : (
                    // Provide a default option if branches is empty or not available
                    <option value="" disabled>
                      No branches available
                    </option>
                  )}
                </TextField>
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="Select Status"
                  name="status"
                  onChange={handleChange}
                  required
                  select
                  SelectProps={{ native: true }}
                  value={values.status}
                >
                  {/* Ensure statuses is an array and has elements */}
                  {statuses && statuses.length > 0 ? (
                    statuses.map((option) => (
                      // Ensure each option has a unique key
                      <option key={option._id} value={option.name}>
                        {option.name}
                      </option>
                    ))
                  ) : (
                    // Provide a default option if statuses is empty or not available
                    <option value="" disabled>
                      No Statuses available
                    </option>
                  )}
                </TextField>
              </Grid>
              <Grid
                xs={12}
                md={12}
              >
                <TextField
                  fullWidth
                  label="Comment"
                  name="comment"
                  onChange={handleChange}
                  type="text"
                  value={values.comment}
                  required
                />
              </Grid>
            </Grid>
          </Box>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          {update ? (
            <Button variant="contained" type='submit'>
              Update
            </Button>
          ) : (
            <Button variant="contained" type='submit'>
              Add Lead
            </Button>
          )}
        </CardActions>
      </Card>
    </form>
  );
};