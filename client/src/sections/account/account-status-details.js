import React, { useEffect, useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import {
    Avatar,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Divider,
    Typography
} from '@mui/material';

export const StatusDetails = ({ selectedLeadId, lead }) => {

    const [data, setData] = useState([
        {
            user_name: 'Amal Perera',
            status: 'Registered',
            date: '2023-12-22',
            comment: 'Test comment 12345'
        },
        {
            user_name: 'Amal Perera',
            status: 'Registered',
            date: '2023-12-22',
            comment: 'Test comment 12345'
        },
        {
            user_name: 'Amal Perera',
            status: 'Registered',
            date: '2023-12-22',
            comment: 'Test comment 12345'
        }
    ]);

    function formatDate(inputDate) {
        const date = new Date(inputDate);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();
        const formattedD = `${year}-${month}-${day}`;
        return formattedD;
    }

    useEffect(() => {
        const fetchFollowUpHistory = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/followups/by-lead/${selectedLeadId}`);
                if (response.ok) {
                    const followUp = await response.json();

                    const fetchAdditionalInfo = async (followUp) => {
                        const userResponse = await fetch(`http://localhost:8080/api/users/${followUp.user_id}`);
                        const usertData = await userResponse.json();

                        const statusResponse = await fetch(`http://localhost:8080/api/status/${followUp.status_id}`);
                        const statusData = await statusResponse.json();

                        return {
                            user_name: usertData.name,
                            status: statusData.name,
                            comment: followUp.comment,
                            date: formatDate(followUp.date),
                        };
                    };

                    // Fetch additional information for all leads concurrently
                    const additionalInfoPromises = followUp.map(fetchAdditionalInfo);
                    const additionalInfo = await Promise.all(additionalInfoPromises);

                    setData(additionalInfo);

                } else {
                    console.error('Error fetching followup:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching followup:', error.message);
            }
        }
        fetchFollowUpHistory();
    }, [])





    return (
        <Card>
            <CardContent>
                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                    {data.map((item, index) => (
                        <React.Fragment key={index}>
                            <ListItem alignItems="flex-start">
                                <ListItemText
                                    primary={item.user_name}
                                    secondary={
                                        <React.Fragment>
                                            <Typography
                                                sx={{ display: 'inline' }}
                                                component="span"
                                                variant="body2"
                                                color="text.primary"
                                            >
                                                {item.status}
                                            </Typography>
                                            {" - "}{item.date}
                                            <br />
                                            <Typography
                                                sx={{ display: 'inline' }}
                                                component="span"
                                                variant="body2"
                                                color="text.gr"
                                            >
                                                {item.comment}
                                            </Typography>
                                        </React.Fragment>
                                    }
                                />
                            </ListItem>
                            {index < data.length - 1 && <Divider variant="middle" component="li" />}
                        </React.Fragment>
                    ))}
                </List>
            </CardContent>
        </Card>
    );
};