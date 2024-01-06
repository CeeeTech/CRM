import Head from 'next/head';
import { Box, Container, Stack, Typography, Unstable_Grid2 as Grid } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { AccountProfile } from 'src/sections/account/account-profile';
import { AccountProfileDetails } from 'src/sections/account/account-profile-details';
import { StatusDetails } from 'src/sections/account/account-status-details';

const Form = ({ selectedLeadId }) => (
    <>
        <Head>
            <title>
                Account | Devias Kit
            </title>
        </Head>

        <Box
            component="main"
            sx={{
                flexGrow: 1,
                py: 8
            }}
        >
            <Container maxWidth="lg">
                <Stack spacing={3}>
                    <div>
                        <Typography variant="h4">
                            Lead
                        </Typography>
                    </div>
                    <div>
                        <Grid
                            container
                            spacing={3}
                        >
                            <Grid
                                xs={12}
                                md={6}
                                lg={4}
                            >
                                <AccountProfile />
                            </Grid>
                            <Grid
                                xs={12}
                                md={6}
                                lg={8}
                            >
                                <AccountProfileDetails selectedLeadId={selectedLeadId} />
                            </Grid>

                        </Grid>
                    </div>
                    <div>
                        <Grid container
                        >
                            <Grid xs={0} lg={4} md={6} >

                            </Grid>
                            <Grid
                                xs={12}
                                md={6}
                                lg={8}
                            >
                                <StatusDetails selectedLeadId={selectedLeadId}  />
                            </Grid>
                        </Grid>
                    </div>
                </Stack>
            </Container>
        </Box>
    </>
);




Form.getLayout = (form) => (
    <DashboardLayout>
        {form}
    </DashboardLayout>
);

export default Form;
