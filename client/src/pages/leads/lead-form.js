import Head from "next/head";
import { Box, Container, Stack, Typography, Unstable_Grid2 as Grid } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { LeadDetails } from "src/sections/leads/lead-details";
import { StatusDetails } from "src/sections/leads/lead-status-details";
import { useRouter } from "next/router";

const Page = () => {
  const router = useRouter();
  const { leadId } = router.query;

  return (
    <>
      <Head>
        <title>Lead Form | Devias Kit</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={3}>
            <div>
              <Typography variant="h4">Lead Form</Typography>
            </div>
            <div>
              <Grid container spacing={3}>
                <Grid xs={12} md={6} lg={15}>
                  <LeadDetails selectedLeadId={leadId} />
                </Grid>
              </Grid>
            </div>
            <div>
              {leadId && (
                <Grid container spacing={3}>
                  <Grid xs={12} md={6} lg={15}>
                    <StatusDetails selectedLeadId={leadId} />
                  </Grid>
                </Grid>
              )}
            </div>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
