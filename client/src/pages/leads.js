import { useCallback, useMemo, useState } from 'react';
import Head from 'next/head';
import { subDays, subHours } from 'date-fns';
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import ArrowUpOnSquareIcon from '@heroicons/react/24/solid/ArrowUpOnSquareIcon';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import { Box, Button, Container, Link, Stack, SvgIcon, Typography } from '@mui/material';
import { useSelection } from 'src/hooks/use-selection';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { LeadsTable } from 'src/sections/account/lead-table';
import { LeadsSearch } from 'src/sections/account/lead-search';
import { applyPagination } from 'src/utils/apply-pagination';
import { useEffect } from 'react';
import Form from 'src/sections/account/leadForm';
// import AddNewLead from '../pages/leads/addNewLead';
import { useRouter } from 'next/router';

const now = new Date();

const useLeads = (page, rowsPerPage) => {
  const [data, setData] = useState([]);

  const applyPagination = (page, rowsPerPage) => {
    return data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  };

  const leads = useMemo(() => {
    // console.log('Processed Leads:', applyPagination(page, rowsPerPage));
    return applyPagination(page, rowsPerPage);
  }, [page, rowsPerPage, data]);

  return {
    data,
    setData,
    leads,
    applyPagination,
  };
};

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
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const router = useRouter();

  const handlePageChange = useCallback(
    (event, value) => {
      setPage(value);
    },
    []
  );

  const handleRowsPerPageChange = useCallback(
    (event) => {
      setRowsPerPage(event.target.value);
    },
    []
  );

  const handleRowClick = useCallback(
    async (id, event) => {
      if (event) {
        event.preventDefault();
      }
  
      console.log('Row clicked. Lead ID:', id);
      setSelectedLeadId(id);
  
      if (router) {
        await router.push(`/leads/lead-form?leadId=${id}`);
        // setShowUpdateForm(true);
      }
    },
    [setSelectedLeadId, router]
  );

  const handleSelectOne = useCallback(
    (id) => {
      leadsSelection.handleSelectOne(id);
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
  }, [leadsSelection]
  );

  const handleDeselectAll = useCallback(() => {
    leadsSelection.handleDeselectAll();
  }, [leadsSelection]
  );

  const selectedLead = useMemo(() => {
    return data.find((lead) => lead.id === selectedLeadId);
  }, [selectedLeadId]
  );

  useEffect(() => {

    const fetchLeads = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/leads');
        const leadData = await response.json();
        // console.log(leadData);

        const fetchAdditionalInfo = async (lead) => {
          const studentResponse = await fetch(`http://localhost:8080/api/students/${lead.student_id}`);
          const studentData = await studentResponse.json();

          const courseResponse = await fetch(`http://localhost:8080/api/courses/${lead.course_id}`);
          const courseData = await courseResponse.json();

          const branchResponse = await fetch(`http://localhost:8080/api/branches/${lead.branch_id}`);
          const branchData = await branchResponse.json();

          const followUpResponse = await fetch(`http://localhost:8080/api/followups/by-lead/${lead._id}`);
          const followUpData = await followUpResponse.json();

          const statusResponse = await fetch(`http://localhost:8080/api/status/${followUpData[0].status_id}`);
          const statusDta = await statusResponse.json();

          return {
            id: lead._id,
            scheduled_at: lead.sheduled_at,
            scheduled_to: lead.sheduled_to,
            date: lead.date,
            name: studentData.name,
            dob: studentData.dob,
            email: studentData.email,
            mobile: studentData.contact_no,
            address: studentData.address,
            course: courseData.name,
            branch: branchData.name,
            comment: followUpData[0].comment,
            status: statusDta.name,
            followUp_id: followUpData[0]._id
          };
        };

        // Fetch additional information for all leads concurrently
        const additionalInfoPromises = leadData.map(fetchAdditionalInfo);
        const additionalInfo = await Promise.all(additionalInfoPromises);


        setData(additionalInfo);

        // console.log("Additional info data", additionalInfo);
      } catch (error) {
        console.error('Error fetching leads:', error);
      }
    };

    fetchLeads();

  }, [setData, page, rowsPerPage]);

  // Separate useEffect for handling selectedLeadId changes
  useEffect(() => {
    if (selectedLeadId) {
      // console.log('Selected Lead Details:', selectedLeadId, selectedLead);
    }
  }, [selectedLeadId]);

  return (
    <>
      {/* {selectedLead ? (
        <Form
          lead={selectedLead} selectedLeadId={selectedLeadId}
        />
      ) : ( */}
        <>
          <Head>
            <title>
              Leads | Devias Kit
            </title>
          </Head>
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              py: 8
            }}
          >
            <Container maxWidth="xl">
              <Stack spacing={3}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  spacing={4}
                >
                  <Stack spacing={1}>
                    <Typography variant="h4">
                      Leads
                    </Typography>
                    <Stack
                      alignItems="center"
                      direction="row"
                      spacing={1}
                    >
                      <Button
                        color="inherit"
                        startIcon={(
                          <SvgIcon fontSize="small">
                            <ArrowUpOnSquareIcon />
                          </SvgIcon>
                        )}
                      >
                        Import
                      </Button>
                      <Button
                        color="inherit"
                        startIcon={(
                          <SvgIcon fontSize="small">
                            <ArrowDownOnSquareIcon />
                          </SvgIcon>
                        )}
                      >
                        Export
                      </Button>
                    </Stack>
                  </Stack>
                  <div>

                    <Link href="/leads/addLead" >
                      <Button
                        startIcon={(
                          <SvgIcon fontSize="small">
                            <PlusIcon />
                          </SvgIcon>
                        )}
                        variant="contained"
                      >
                        Add
                      </Button>
                    </Link>

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
          </Box></>
       {/* )
      } */}

    </>
  );
};


Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;