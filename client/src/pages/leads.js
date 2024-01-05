import { useCallback, useMemo, useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Box, Button, Container, Link, Stack, SvgIcon, Typography } from "@mui/material";
import ArrowDownOnSquareIcon from "@heroicons/react/24/solid/ArrowDownOnSquareIcon";
import ArrowUpOnSquareIcon from "@heroicons/react/24/solid/ArrowUpOnSquareIcon";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import { useSelection } from "src/hooks/use-selection";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { LeadsTable } from "src/sections/leads/lead-table";
import { LeadsSearch } from "src/sections/leads/lead-search";

const now = new Date();

// Custom hook for managing leads data
const useLeads = (page, rowsPerPage) => {
  const [data, setData] = useState([]);

  // Function to apply pagination to leads data
  const applyPagination = (page, rowsPerPage) => {
    return data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  };

  const leads = useMemo(() => {
    return applyPagination(page, rowsPerPage);
  }, [page, rowsPerPage, data]);

  return { data, setData, leads, applyPagination };
};

// Custom hook for extracting lead ids from leads data
const useLeadIds = (leads) => {
  return leads.map((lead) => lead.id);
};

const Page = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { data, setData, leads, applyPagination } = useLeads(page, rowsPerPage);
  const leadsIds = useLeadIds(leads);
  const leadsSelection = useSelection(leadsIds);
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const router = useRouter();

  // Handlers for page change and rows per page change
  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value);
  }, []);

  // Handler for row click
  const handleRowClick = useCallback(
    async (id, event) => {
      setSelectedLeadId(id);
      await router.push(`/leads/lead-form?leadId=${id}`);
    },
    [setSelectedLeadId, router]
  );

  // Handlers for lead selection/deselection
  const handleSelectOne = useCallback(
    (id) => {
      leadsSelection.handleSelectOne(id);
      console.log("Selected Lead Id:", id);
    },
    [leadsSelection]
  );

  const handleDeselectOne = useCallback(
    (id) => {
      leadsSelection.handleDeselectOne(id);
    },
    [leadsSelection]
  );

  const handleSelectAll = useCallback(() => {
    leadsSelection.handleSelectAll();
  }, [leadsSelection]);

  const handleDeselectAll = useCallback(() => {
    leadsSelection.handleDeselectAll();
  }, [leadsSelection]);

  useEffect(() => {
    fetchLeads();
  }, [page, rowsPerPage]);

  // function to fetch lead details from server
  async function fetchLeads() {
    // try {
    //   const response = await fetch("http://localhost:8080/api/leads");
    //   const leadData = await response.json();
    //   // console.log(leadData);

    //   const fetchAdditionalInfo = async (lead) => {
    //     const studentResponse = await fetch(
    //       `http://localhost:8080/api/students/${lead.student_id}`
    //     );
    //     const studentData = await studentResponse.json();

    //     const courseResponse = await fetch(`http://localhost:8080/api/courses/${lead.course_id}`);
    //     const courseData = await courseResponse.json();

    //     const branchResponse = await fetch(`http://localhost:8080/api/branches/${lead.branch_id}`);
    //     const branchData = await branchResponse.json();

    //     const followUpResponse = await fetch(
    //       `http://localhost:8080/api/followups/by-lead/${lead._id}`
    //     );
    //     const followUpData = await followUpResponse.json();

    //     const statusResponse = await fetch(
    //       `http://localhost:8080/api/status/${followUpData[0].status_id}`
    //     );
    //     const statusDta = await statusResponse.json();

    //     return {
    //       id: lead._id,
    //       scheduled_at: lead.sheduled_at,
    //       scheduled_to: lead.sheduled_to,
    //       date: lead.date,
    //       name: studentData.name,
    //       dob: studentData.dob,
    //       email: studentData.email,
    //       mobile: studentData.contact_no,
    //       address: studentData.address,
    //       course: courseData.name,
    //       branch: branchData.name,
    //       comment: followUpData[0].comment,
    //       status: statusDta.name,
    //       followUp_id: followUpData[0]._id,
    //       counsellor: lead.counsellor_id,
    //     };
    //   };

    //   // Fetch additional information for all leads concurrently
    //   const additionalInfoPromises = leadData.map(fetchAdditionalInfo);
    //   const additionalInfo = await Promise.all(additionalInfoPromises);

    //   setData(additionalInfo);

    //   // console.log("Additional info data", additionalInfo);
    // } catch (error) {
    //   console.error("Error fetching leads:", error);
    // }
    try {
      const res = await fetch("http://localhost:8080/api/leads-details");
      const data = await res.json();

      console.log(data);
      setData(data);
    } catch (error) {
      console.log("Error fetching courses:", error);
    }
  };

  // Separate useEffect for handling selectedLeadId changes
  useEffect(() => {
    if (selectedLeadId) {
      // console.log('Selected Lead Details:', selectedLeadId, selectedLead);
    }
  }, [selectedLeadId]);

  const handleAddNewLead = () => {
    router.push(`/leads/lead-form`);
  };

  return (
    <>
      {/* {selectedLead ? (
        <Form
          lead={selectedLead} selectedLeadId={selectedLeadId}
        />
      ) : ( */}
      <>
        <Head>
          <title>Leads | Devias Kit</title>
        </Head>
        <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
          <Container maxWidth="xl">
            <Stack spacing={3}>
              <Stack direction="row" justifyContent="space-between" spacing={4}>
                <Stack spacing={1}>
                  <Typography variant="h4">Leads</Typography>
                  <Stack alignItems="center" direction="row" spacing={1}>
                    <Button
                      color="inherit"
                      startIcon={
                        <SvgIcon fontSize="small">
                          <ArrowUpOnSquareIcon />
                        </SvgIcon>
                      }
                    >
                      Import
                    </Button>
                    <Button
                      color="inherit"
                      startIcon={
                        <SvgIcon fontSize="small">
                          <ArrowDownOnSquareIcon />
                        </SvgIcon>
                      }
                    >
                      Export
                    </Button>
                  </Stack>
                </Stack>
                <div>
                  <Button
                    startIcon={
                      <SvgIcon fontSize="small">
                        <PlusIcon />
                      </SvgIcon>
                    }
                    variant="contained"
                    onClick={handleAddNewLead}
                  >
                    Add
                  </Button>
                </div>
              </Stack>
              <LeadsSearch />
              <LeadsTable
                count={data.length}
                items={leads}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                onRowClick={(id, event) => handleRowClick(id, event)}
                onDeselectAll={handleDeselectAll}
                onDeselectOne={handleDeselectOne}
                onSelectAll={handleSelectAll}
                onSelectOne={handleSelectOne}
                page={page}
                rowsPerPage={rowsPerPage}
                selected={leadsSelection.selected}
              />
            </Stack>
          </Container>
        </Box>
      </>
      {/* )
      } */}
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
