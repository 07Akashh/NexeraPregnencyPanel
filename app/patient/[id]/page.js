'use client';

import {
    Box,
    Container,
    Typography,
    Paper,
    Grid,
    Button,
    TextField,
    Card,
    CardContent,
    CircularProgress,
} from '@mui/material';
import { use, useEffect, useState } from 'react';
import { getPatientDetails } from '../../../lib/api';
import { useRouter } from 'next/navigation';


const calculateRiskScore = (ancDetails, deliveryDetails) => {
    let score = 0;

    // Hemoglobin check
    const hb = parseFloat(ancDetails?.HEMOGLOBIN);
    if (hb >= 11) score += 2;
    else if (hb >= 9) score += 1;

    // Blood sugar
    const sugar = parseFloat(ancDetails?.BLOOD_SUGAR);
    if (sugar >= 70 && sugar <= 110) score += 2;

    // BP check
    const systolic = parseInt(ancDetails?.BP);
    const diastolic = parseInt(ancDetails?.BP1);
    if (systolic >= 90 && systolic <= 140 && diastolic >= 60 && diastolic <= 90) score += 2;

    // Weight
    const weight = parseFloat(ancDetails?.WEIGHT);
    if (weight >= 50) score += 1;

    // IFA compliance
    if (ancDetails?.IFA_TABLET === 'Yes') score += 1;

    // Delivery outcome check
    if (deliveryDetails?.DELIVERY_OUTCOME === 'Live') score += 2;

    return score; // Max = 10
};

const calculateProbability = (riskScore) => {
    // Map score to probability (simple linear scaling)
    return Math.min(Math.max(Math.round((10 - riskScore) * 10 + 40), 40), 100);
};


export default function PatientDetailsPage({ params }) {
    const { id } = use(params);
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getPatientDetails(id);
                const data = res.response;
                if (data?.message || !data) {
                    throw new Error('Not found');
                } else {
                    setPatient(data);
                }
                // Using demo data for now
                // setPatient({
                //   PATIENT_ID: `#${id}`,
                //   pregnancy_details: {
                //     AGE: 28,
                //     LMP_DT: '2025-03-10',
                //   },
                // });

            } catch (e) {
                setError('API failed. Showing demo data.');
                // setPatient({
                //   PATIENT_ID: `#${id}`,
                //   pregnancy_details: {
                //     AGE: 28,
                //     LMP_DT: '2025-03-10',
                //   },
                // });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const formatDate = (date) =>
        date ? new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : '';



    const renderInputDisplay = (label, value) => (
        <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                {label}
            </Typography>
            <TextField
                value={value || '-'}
                fullWidth
                disabled
                size="small"
                sx={{
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 1,
                        backgroundColor: '#fcfcfc',
                        '&:hover': {
                            backgroundColor: '#f9f9f9',
                        },
                        '&.Mui-focused': {
                            backgroundColor: '#ffffff',
                        },
                        '& fieldset': {
                            borderColor: 'transparent',
                        },
                        '&:hover fieldset': {
                            borderColor: '#e0e0e0',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: 'transparent',
                        },
                    },
                    '& .MuiInputBase-input': {
                        color: '#000000',
                        WebkitTextFillColor: '#000000 !important',
                        opacity: 1,
                    }
                }}
            />
        </Box>
    );

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error && !patient) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    // Use demo data if patient is null after loading/error
    const currentPatientData = patient || {
        PATIENT_ID: `#${id}`,
        pregnancy_details: {
            AGE: 'N/A',
            LMP_DT: null,
        },
    };

    const ancDetails = patient.anc_details;
    const deliveryDetails = patient.delivery_details;

    const riskScore = calculateRiskScore(ancDetails, deliveryDetails); // e.g., 8
    const probabilityScore = calculateProbability(riskScore);

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Header Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Button variant="text" onClick={() => router.back()} size="small">← Back to previous page</Button>
                <Box>
                    {/* <Button variant="outlined" sx={{ mr: 2 }}>Override</Button> */}
                    {/* <Button variant="contained">Accept Recommendation</Button> */}
                </Box>
            </Box>

            <Grid container spacing={3}>
                {/* Left Content */}
                <Grid item xs={12} md={8}>
                    {/* Basic details */}
                    <Paper elevation={1} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
                        <Typography variant="h6" fontWeight={600} mb={2}>Basic details</Typography>

                        {/* Patient ID as simple text */}
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            Patient ID {currentPatientData?.pregnancy_details?.MOTHER_ID || '-'}
                        </Typography>

                        {/* Age, LMP, and empty third part in a 3-part grid */}
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={4}> {/* Part 1: Age */}
                                {renderInputDisplay("Age", currentPatientData?.pregnancy_details?.AGE)}
                            </Grid>
                            <Grid item xs={12} sm={4}> {/* Part 2: LMP */}
                                {renderInputDisplay("Last Menstrual Period (LMP)", formatDate(currentPatientData?.pregnancy_details?.LMP_DT))}
                            </Grid>
                            <Grid item xs={12} sm={4}> {/* Part 3: Empty */}
                                {/* This grid item remains empty to divide the space */}
                            </Grid>
                        </Grid>
                    </Paper>

                    {/* Risk Assessment Panels */}
                    
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Card elevation={1} sx={{ borderRadius: 2, height: '100%' }}>
                                <CardContent>
                                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>AI Risk Assessment Panel</Typography>
                                    <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                                        {/* AI Risk Assessment Indicator */}
                                        <Box
                                            sx={{
                                                width: 70,
                                                height: 70,
                                                borderRadius: '50%',
                                                border: '6px solid #3fbf73', // Green color from image
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                mr: 2,
                                                fontWeight: 600,
                                                fontSize: '1.2rem'
                                            }}
                                        >
                                            {riskScore}/10
                                        </Box>
                                        <Typography variant="body2">
                                            Average score on the platform<br />{riskScore}/10
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Card elevation={1} sx={{ borderRadius: 2, height: '100%' }}>
                                <CardContent>
                                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>Probability Score</Typography>
                                    <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                                        {/* Probability Score Indicator */}
                                        <Box
                                            sx={{
                                                width: 70,
                                                height: 70,
                                                borderRadius: '50%',
                                                border: '6px solid #e57373', // Red color from image
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                mr: 2,
                                                fontWeight: 600,
                                                fontSize: '1.2rem'
                                            }}
                                        >
                                            {probabilityScore}%
                                        </Box>
                                        <Typography variant="body2">
                                            Risk Probability score on the platform<br />{probabilityScore}%
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>

                {/* Right Side - AI Suggestions - Ensure this section takes full height */}
                <Grid item xs={12} md={4} sx={{ height: '100%' }}>
                    {/* Paper component needs to be a flex container to manage content height */}
                    <Paper elevation={1} sx={{ p: 2, borderRadius: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="subtitle1" fontWeight={600} gutterBottom>AI Assistant</Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>Suggestions</Typography>
                        {/* AI Suggestions Box - this box will grow to fill available space and be scrollable */}
                        <Box sx={{ p: 2, backgroundColor: '#f0fdf4', borderRadius: 2, flexGrow: 1, overflowY: 'auto' }}>
                            <Typography variant="body2" sx={{ mb: 1 }}>• Patient shows 3 high-risk indicators: Recommend referral.</Typography>
                            <Typography variant="body2" sx={{ mb: 1 }}>• BP has increased over last 2 visits. Flag for escalation?</Typography>
                            <Typography variant="body2" sx={{ mb: 1 }}>• No weight gain in last 4 weeks. Monitor nutrition.</Typography>
                            <Typography variant="body2">• Follow-up was due 2 days ago. Would you like to reschedule?</Typography>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}
