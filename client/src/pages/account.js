import { useCallback, useMemo, useState } from 'react';
import Head from 'next/head';
import { subDays, subHours } from 'date-fns';
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import ArrowUpOnSquareIcon from '@heroicons/react/24/solid/ArrowUpOnSquareIcon';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import { Box, Button, Container, Stack, SvgIcon, Typography } from '@mui/material';
import { useSelection } from 'src/hooks/use-selection';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { LeadsTable } from 'src/sections/account/lead-table';
import { LeadsSearch } from 'src/sections/account/lead-search';
import { applyPagination } from 'src/utils/apply-pagination';
import { useEffect } from 'react';
import Form from 'src/sections/account/leadForm';

const now = new Date();

const data = [
  {
    id: '5e887ac47eed253091be10cb',
    name: 'Hiranya Semindi',
    scheduled_at: '2023-02-12',
    avatar: '/assets/avatars/avatar-carson-darrin.png',
    scheduled_to: '2023-10-20',
    course: 'Computer Science',
    branch: 'Colombo',
  },
  {
    id: '5e887b209c28ac3dd97f6db5',
    name: 'Hiranya Semindi',
    scheduled_at: '2023-02-12',
    avatar: '/assets/avatars/avatar-fran-perez.png',
    scheduled_to: '2023-10-20',
    course: 'Computer Science',
    branch: 'Colombo',
  },
  {
    id: '5e887b7602bdbc4dbb234b27',
    name: 'Hiranya Semindi',
    scheduled_at: '2023-02-12',
    avatar: '/assets/avatars/avatar-jie-yan-song.png',
    scheduled_to: '2023-10-20',
    course: 'Computer Science',
    branch: 'Colombo',
  },
  {
    id: '5e86809283e28b96d2d38537',
    name: 'Hiranya Semindi',
    scheduled_at: '2023-02-12',
    avatar: '/assets/avatars/avatar-anika-visser.png',
    scheduled_to: '2023-10-20',
    course: 'Computer Science',
    branch: 'Colombo',
  },
  {
    id: '5e86805e2bafd54f66cc95c3',
    name: 'Hiranya Semindi',
    scheduled_at: '2023-02-12',
    avatar: '/assets/avatars/avatar-miron-vitold.png',
    scheduled_to: '2023-10-20',
    course: 'Computer Science',
    branch: 'Colombo',
  },
  {
    id: '5e887a1fbefd7938eea9c981',
    name: 'Hiranya Semindi',
    scheduled_at: '2023-02-12',
    avatar: '/assets/avatars/avatar-penjani-inyene.png',
    scheduled_to: '2023-10-20',
    course: 'Computer Science',
    branch: 'Colombo',
  },
  {
    id: '5e887d0b3d090c1b8f162003',
    name: 'Hiranya Semindi',
    scheduled_at: '2023-02-12',
    avatar: '/assets/avatars/avatar-omar-darboe.png',
    scheduled_to: '2023-10-20',
    course: 'Computer Science',
    branch: 'Colombo',
  },
  {
    id: '5e88792be2d4cfb4bf0971d9',
    name: 'Hiranya Semindi',
    scheduled_at: '2023-02-12',
    avatar: '/assets/avatars/avatar-siegbert-gottfried.png',
    scheduled_to: '2023-10-20',
    course: 'Computer Science',
    branch: 'Colombo',
  },
  {
    id: '5e8877da9a65442b11551975',
    name: 'Hiranya Semindi',
    scheduled_at: '2023-02-12',
    avatar: '/assets/avatars/avatar-iulia-albu.png',
    scheduled_to: '2023-10-20',
    course: 'Computer Science',
    branch: 'Colombo',
  },
  {
    id: '5e8680e60cba5019c5ca6fda',
    name: 'Hiranya Semindi',
    scheduled_at: '2023-02-12',
    avatar: '/assets/avatars/avatar-nasimiyu-danai.png',
    scheduled_to: '2023-10-20',
    course: 'Computer Science',
    branch: 'Colombo',
  }
];

const useLeads = (page, rowsPerPage) => {
  return useMemo(
    () => {
      return applyPagination(data, page, rowsPerPage);
    },
    [page, rowsPerPage]
  );
};

const useLeadIds = (leads) => {
  return useMemo(
    () => {
      return leads.map((lead) => lead.id);
    },
    [leads]
  );
};

const Page = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const leads = useLeads(page, rowsPerPage);
  const leadsIds = useLeadIds(leads);
  const leadsSelection = useSelection(leadsIds);
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);

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
    (id) => {
      console.log('Row clicked. Lead ID:', id);
      setSelectedLeadId(id);
      setShowUpdateForm(true);
    },
    [setSelectedLeadId, setShowUpdateForm]
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
  }, [leadsSelection]);

  const handleDeselectAll = useCallback(() => {
    leadsSelection.handleDeselectAll();
  }, [leadsSelection]);

  const selectedLead = useMemo(() => {
    return data.find((lead) => lead.id === selectedLeadId);
  }, [selectedLeadId]);

  useEffect(() => {
    // Fetch customer details based on the selected email here
    // You can use an API call or any other method to get the details
    // For now, let's just log the details to the console
    console.log('useEffect triggered');
    if (selectedLead) {
      console.log('Selected Lead Details:', selectedLead);

    }
  }, [selectedLead]);

  console.log('Page component rendering');

  return (
    <>
      {showUpdateForm && selectedLead ? (
        <Form
          lead={selectedLead}
        />
      ) : (
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
                  </div>
                </Stack>
                <LeadsSearch />
                <LeadsTable
                  count={data.length}
                  items={leads}
                  onPageChange={handlePageChange}
                  onRowsPerPageChange={handleRowsPerPageChange}
                  onRowClick={handleRowClick}
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
      )}

    </>
  );
};


Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
