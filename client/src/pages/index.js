import Head from "next/head";
import { subDays, subHours } from "date-fns";
import { Box, Container, Unstable_Grid2 as Grid, darken } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { OverviewCard } from "src/sections/overview/overview-card";
import { OverviewLatestOrders } from "src/sections/overview/overview-latest-orders";
import { OverviewLatestProducts } from "src/sections/overview/overview-latest-products";
import { OverviewSales } from "src/sections/overview/overview-sales";
import { OverviewTraffic } from "src/sections/overview/overview-traffic";
import React, { useState, useEffect, use } from "react";
import { get } from "http";

const now = new Date();

const Page = () => {
  const [data, setData] = useState([]);
  const [courseData, setCourseData] = useState([]);
  const [leadData, setLeadData] = useState([]);
  const [leadsCountByMonth, setLeadsCountByMonth] = useState({});
  const [counsellorData, setCounsellorData] = useState([]);
  const [isTrue, setIsTrue] = useState(false);


  //fetch status details

  async function fetchStatusDetails() {
    try {
      const response = await fetch("http://localhost:8080/api/followupsdate");
      const data = await response.json();
      setData(data);
      setIsTrue(true);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  }

  //fetch course details

  async function fetchCourseDetails() {
    try {
        const response = await fetch("http://localhost:8080/api/courses");
        const allCourses = await response.json();

        // Filter courses where status is true
        const filteredCourses = allCourses.filter(course => course.status === true);

        setCourseData(filteredCourses);
        setIsTrue(true);
    } catch (error) {
        console.error("Error fetching data:", error.message);
    }
}


//  frech leads details 

async function fetchLeads() {
  try {
    const response = await fetch("http://localhost:8080/api/leads");
    const leadData = await response.json();

    // Group leads by month
    const groupedLeads = groupLeadsByMonth(leadData);

    // Get the count of leads for each month
    const leadsCountByMonth = getLeadsCountByMonth(groupedLeads);

    // // Do something with the leads count, for example:
    // console.log(leadsCountByMonth);

    // Set the leads count and update state
    setLeadsCountByMonth(leadsCountByMonth);
    setIsTrue(true);

  } catch (error) {
    console.error("Error fetching data:", error.message);
  }
}

function groupLeadsByMonth(leadData) {
  const groupedLeads = {};

  leadData.forEach(lead => {
    const date = new Date(lead.date);
    const monthYear = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(date);

    if (!groupedLeads[monthYear]) {
      groupedLeads[monthYear] = [];
    }

    groupedLeads[monthYear].push(lead);
  });

  return groupedLeads;
}

function getLeadsCountByMonth(groupedLeads) {
  const leadsCountByMonth = {};

  // Calculate the count of leads for each month
  for (const monthYear in groupedLeads) {
    const leadsCount = groupedLeads[monthYear].length;
    leadsCountByMonth[monthYear] = leadsCount;
  }

  return leadsCountByMonth;
}


  // Use useEffect to fetch data when the component mounts
  useEffect(() => {
    fetchStatusDetails();
  }, []);

  useEffect(() => {
    fetchCourseDetails();
  }, []);

  useEffect(() => {
    fetchLeads();
  }, []);

  




  const cardData1 = [
    { heading: "Ring No Answer", value: data?.ringNoAnswerCount, difference: 12, positive: true, sx: { height: "100%" } },
    { heading: "REGISTERED", value: data?.registeredCount, difference: 16, positive: false, sx: { height: "100%" } },
    { heading: "SEND EMAIL", value: data?.emailCount, sx: { height: "100%" } },
    { heading: "WHATSAPP & SMS", value: data?.whatsappCount, sx: { height: "100%" } },
  
];

const cardData2 = [
  { heading: "SCHEDULE MEETINGS", value: data?.meetingCount, difference: 12, positive: true, sx: { height: "100%" } },
  { heading: "COUSE DETAILS SENT", value: data?.cousedetailsCount, difference: 16, positive: false, sx: { height: "100%" } },
  { heading: "NEXT INTAKE", value: data?.nextintakeCount, sx: { height: "100%" } },
  { heading: "DROPPED", value: data?.droppedCount, sx: { height: "100%" } },
  { heading: "NEW", value: data?.NewCount, sx: { height: "100%" } },
];

  

  return (
    <>
      <Head>
        <title>Overview | Devias Kit</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          {isTrue && (
            <Grid container spacing={3}>

              {cardData1.map((card, index) => (
                              <Grid key={index} xs={12} sm={6} lg={3}>
                                  <OverviewCard {...card} />
                              </Grid>
                          ))}

              <Grid xs={12} lg={8}>

                {cardData2.map((card, index) => (
                                <Grid key={index} xs={12} sm={6} lg={3}>
                                    <OverviewCard {...card} />
                                </Grid>
                            ))}
               
                <OverviewSales
                  chartSeries={[
                  {name: "This year",
                   data: Object.values(leadsCountByMonth)},
                  ]}
                  sx={{ height: "100%" }}
                />
  
              </Grid>

              <Grid xs={12} md={6} lg={4}>
                <OverviewTraffic
                  chartSeries={[data?.ringNoAnswerCount, data?.registeredCount, data?.emailCount, data?.whatsappCount, data?.meetingCount, data?.cousedetailsCount, data?.nextintakeCount, data?.droppedCount, data?.NewCount]}
                  labels={["Ring No Answer", "REGISTERED", "SEND EMAIL", "WHATSAPP & SMS", "SCHEDULE MEETINGS", "COUSE DETAILS SENT", "NEXT INTAKE", "DROPPED", "NEW"]}
                  sx={{ height: "100%" }}
                />
              </Grid>
              <Grid xs={12} md={6} lg={4}>

              <OverviewLatestProducts
                    products={courseData.map(course => ({
                        name: course.name,
                        description: course.description,
                    }))}
                    sx={{ height: "100%" }}
                />
                
              </Grid>
              <Grid xs={12} md={12} lg={8}>
                <OverviewLatestOrders
                  orders={[
                    {
                      id: "f69f88012978187a6c12897f",
                      ref: "DEV1049",
                      amount: 30.5,
                      customer: {
                        name: "Ekaterina Tankova",
                      },
                      createdAt: 1555016400000,
                      status: "pending",
                    },
                    {
                      id: "9eaa1c7dd4433f413c308ce2",
                      ref: "DEV1048",
                      amount: 25.1,
                      customer: {
                        name: "Cao Yu",
                      },
                      createdAt: 1555016400000,
                      status: "delivered",
                    },
                    {
                      id: "01a5230c811bd04996ce7c13",
                      ref: "DEV1047",
                      amount: 10.99,
                      customer: {
                        name: "Alexa Richardson",
                      },
                      createdAt: 1554930000000,
                      status: "refunded",
                    },
                    {
                      id: "1f4e1bd0a87cea23cdb83d18",
                      ref: "DEV1046",
                      amount: 96.43,
                      customer: {
                        name: "Anje Keizer",
                      },
                      createdAt: 1554757200000,
                      status: "pending",
                    },
                    {
                      id: "9f974f239d29ede969367103",
                      ref: "DEV1045",
                      amount: 32.54,
                      customer: {
                        name: "Clarke Gillebert",
                      },
                      createdAt: 1554670800000,
                      status: "delivered",
                    },
                    {
                      id: "ffc83c1560ec2f66a1c05596",
                      ref: "DEV1044",
                      amount: 16.76,
                      customer: {
                        name: "Adam Denisov",
                      },
                      createdAt: 1554670800000,
                      status: "delivered",
                    },
                  ]}
                  sx={{ height: "100%" }}
                />
              </Grid>
            </Grid>
          )}
        </Container>
      </Box>
    </>
  );
};



Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);


export default Page;
