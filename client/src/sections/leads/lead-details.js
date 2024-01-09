import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  SvgIcon,
  Unstable_Grid2 as Grid
} from '@mui/material';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import { useAuth } from "src/hooks/use-auth";
// import { localeData } from 'numeral';


export const LeadDetails = ({ selectedLeadId }) => {

  // console.log("Selected Lead  in LeadDetails:", lead);

  const [branches, setBranches] = useState(null);
  const [statuses, setStatuses] = useState(null);
  const [courses, setCourses] = useState(null);
  const [update, setUpdate] = useState(false);
  const [statusForm, setStatusForm] = useState(false);

  const date = new Date();
  const formattedDate = date.toISOString().split('T')[0];

  function formatDate(inputDate) {
    const date = new Date(inputDate);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    const formattedD = `${year}-${month}-${day}`;
    return formattedD;
  }

  const [values, setValues] = useState({
    name: '',
    dob: '',
    email: '',
    contact_no: '',
    address: '',
    date: formattedDate,
    scheduled_to: '',
    course: 'Computer Science',
    branch: 'Colombo',
    status: 'Registered',
    comment: '',
    // updateDate: formattedDate,
    followupId: ''
  });

  const [selectedBranchId, setSelectedBranchId] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [selectedStatusId, setselectedStatusId] = useState('');
  const { user } = useAuth();
  const [changedFields, setChangedFields] = useState({});
  const [studentId, setStudentId] = useState('');
  const router = useRouter();

  useEffect(() => {


    const fetchLeadData = async () => {
      try {
        const leadResponse = await fetch(`http://localhost:8080/api/leads/${selectedLeadId}`);
        const leadData = await leadResponse.json();

        if (leadResponse.ok) {
          setUpdate(true);
          const studentResponse = await fetch(`http://localhost:8080/api/students/${leadData.student_id}`);
          const studentData = await studentResponse.json();

          if (studentResponse.ok) {
            console.log("ok");

            console.log("fs1", selectedLeadId)
            const courseResponse = await fetch(`http://localhost:8080/api/courses/${leadData.course_id}`);
            const courseData = await courseResponse.json();

            if (courseResponse.ok) {
              console.log("fs2", selectedLeadId)
              const branchResponse = await fetch(`http://localhost:8080/api/branches/${leadData.branch_id}`);
              const branchData = await branchResponse.json();

              if (branchResponse.ok) {
                console.log("fs3", selectedLeadId)
                const followUpResponse = await fetch(`http://localhost:8080/api/followups/by-lead/${selectedLeadId}`);

                if (followUpResponse.ok) {
                  const followUpData = await followUpResponse.json();

                  const statusResponse = await fetch(`http://localhost:8080/api/status/${followUpData[0].status_id}`);
                  const statusDta = await statusResponse.json();

                  console.log("fs5", studentData.email)
                  setValues({
                    name: studentData.name,
                    dob: formatDate(studentData.dob),
                    email: studentData.email,
                    contact_no: studentData.contact_no,
                    address: studentData.address,
                    date: formatDate(leadData.date),
                    scheduled_to: formatDate(leadData.sheduled_to),
                    course: courseData.name,
                    branch: branchData.name,
                    status: statusDta.name,
                    comment: followUpData[0].comment,
                    // updateDate: formatDate(followUpData[0].date),
                    followupId: followUpData[0]._id
                  })

                  console.log(formatDate(followUpData[0].date))

                }

              }

            }
          }


          // console.log("update true");
        }
      } catch (error) {
        console.log(error);
      }
    };
    const fetchData = async () => {
      await fetchLeadData();
    };
    if (selectedLeadId != null) {
      fetchData();
      console.log('okldsd');
    }
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
    console.log(formattedDate)
  }, [selectedLeadId, update])


  const handleChange = useCallback(
    (event) => {
      const { name, value } = event.target;
      setValues((prevState) => ({
        ...prevState,
        [name]: value
      }));

      setChangedFields((prevChangedFields) => ({
        ...prevChangedFields,
        [name]: value
      }));

      if (name === 'branch') {
        const selectedBranch = branches.find((branch) => branch.name === value);
        setSelectedBranchId(selectedBranch ? selectedBranch._id : '');
      } else if (name === 'course') {
        const selectedCourse = courses.find((course) => course.name === value);
        setSelectedCourseId(selectedCourse ? selectedCourse._id : '');
      } else if (name === 'status') {
        const selectedStatus = statuses.find((status) => status.name === value);
        setselectedStatusId(selectedStatus ? selectedStatus._id : '');
      }
    },
    [branches, courses, selectedLeadId, update, statuses]
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
              contact_no: values.contact_no,
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
              "student_id": student_id,
              "user_id": user.userId
            })
          })
          if (!leadResponse.ok) {
            console.error("Error inserting data to the lead table", leadResponse.statusText);
            return
          }
          const LeadData = await leadResponse.json();
          const { _id: lead_id } = LeadData;
          console.log("Lead ID:", lead_id);
          //insert followup
          const followUpResponse = await fetch('http://localhost:8080/api/followUps', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(
              {
                "lead_id": lead_id,
                "user_id": user.userId,
                "status": "New",
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
          console.log("update code");
          console.log("update code", changedFields.scheduled_to);

          console.log("Debugging - scheduled_to:", changedFields.scheduled_to);
          console.log("Debugging - selectedCourseId:", selectedCourseId);
          console.log("Debugging - selectedStatusId:", selectedStatusId);
          console.log("Debugging - selectedBranchId:", selectedBranchId);
          console.log("Debugging - email:", changedFields.email);
          console.log("Debugging - address:", changedFields.address);
          console.log("Debugging - name:", changedFields.name);
          console.log("Debugging - dob:", changedFields.dob);
          console.log("Debugging - contact_no:", changedFields.contact_no);


          //update student data
          if (changedFields.email != null || changedFields.address != null || changedFields.name != null || changedFields.dob != null || changedFields.contact_no != null) {

            console.log("third", changedFields.scheduled_to);
            const Lead = await fetch(`http://localhost:8080/api/leads/${selectedLeadId}`);
            if (!Lead.ok) {
              console.error("Error fetching lead data", Lead.statusText);
              return
            }

            const LeadData = await Lead.json();
            const { student_id: sid } = LeadData;
            console.log("sid2", sid)

            console.log("sid3", studentId)

            if (Object.keys(changedFields).length > 0) {
              console.log(changedFields)
              console.log(studentId)
              // Only send the changed fields to the server for update
              const updateStudentData = {
                ...changedFields
              };
              console.log(updateStudentData)
              const updatestudent = await fetch(`http://localhost:8080/api/students/${sid}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updateStudentData)
              })

              if (!updatestudent.ok) {
                console.error("Error updating student data", updatestudent.statusText);
                return
              }
              console.log("only student updated")

            }
          }

          //update lead data
          if (changedFields.scheduled_to != null || selectedCourseId !== "" || selectedBranchId !== "") {

            console.log("first");

            const updateLeadData = {
              // scheduled_at: formattedDate
            };

            if (selectedCourseId != "") {
              updateLeadData.course_id = selectedCourseId;
            }
            if (selectedBranchId != "") {
              updateLeadData.branch_id = selectedBranchId;
            }
            if (changedFields.scheduled_to != null) {
              updateLeadData.scheduled_to = changedFields.scheduled_to;
              updateLeadData.scheduled_at = changedFields.scheduled_at;
            }
            console.log(changedFields)
            const updateLead = await fetch(`http://localhost:8080/api/leads/${selectedLeadId}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(updateLeadData)
            })
            if (!updateLead.ok) {
              console.error("Error updating lead data", updateLead.statusText);
              return
            }
            console.log("only lead updated")

          }

          //followup add
          console.log(values.followupId);


          console.log("stsid", selectedStatusId);

          if (selectedStatusId != "" || changedFields.comment != null) {

            const updateFollowupData = {
              user_id: user.userId,
              lead_id: selectedLeadId
            };

            if (values.comment != "") {
              updateFollowupData.comment = values.comment;
            }
            if (selectedStatusId != "") {
              updateFollowupData.status = values.status;
            }

            const addFollowup = await fetch(`http://localhost:8080/api/followUps`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(updateFollowupData)
            })

            if (!addFollowup.ok) {

              console.error("Error adding followup data", addFollowup.statusText);
              return
            }
            console.log("update followup")
          }




          // console.log(selectedCourseId, selectedBranchId);
          console.log('Data updated successfully!');
        }
        setChangedFields({});
        setValues({
          name: '',
          dob: '',
          email: '',
          contact_no: '',
          address: '',
          date: formattedDate,
          scheduled_to: '',
          course: 'Computer Science',
          branch: 'Colombo',
          status: 'Registered',
          comment: '',
          updateDate: formattedDate,
          followupId: ''
        })
        // navigate to the leads page
        router.push('/leads');
      } catch (error) {
        console.error('Error during data insertion:', error.message);
      }
    },
    [values, update, changedFields, user.userId, studentId]
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
                  name="contact_no"
                  onChange={handleChange}
                  type="number"
                  value={values.contact_no}
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
            </Grid>
            {update == true ? (<Box sx={{ textAlign: 'center', mt: 2, mb: 2 }}>
              <Button onClick={() => { setStatusForm(true) }} variant="outlined">
                <PlusIcon />
              </Button>
            </Box>) : (<></>)}

            {statusForm == true ? (<Grid container spacing={3}>
              {/* ............................ */}
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
              {/* <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="Update Date"
                  name="updateDate"
                  onChange={handleChange}
                  type="date"
                  value={values.updateDate}
                  required
                />
              </Grid> */}
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
            </Grid>) : (<></>)}

            {/* ............................ */}
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