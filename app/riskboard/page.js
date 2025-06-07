"use client"

import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  IconButton,
  Tooltip,
  CssBaseline,
  ThemeProvider,
  createTheme,
  Divider,
  TextField,
  InputAdornment,
  Skeleton
} from "@mui/material"
import SearchIcon from '@mui/icons-material/Search'
import RefreshIcon from "@mui/icons-material/Refresh"
import { useEffect, useState } from "react";
import { predictRiskByPateintId } from "../../lib/api";
import { useRouter } from "next/navigation"

const RiskColumnSkeleton = () => (
  <Grid item xs={12} sm={6} md={3} sx={{ minWidth: { xs: '100%', sm: '300px' } }}>
    <Paper
      elevation={0}
      sx={{
        height: '100%',
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        border: "1px solid #f0f0f0",
        bgcolor: "white",
        p: "20px 0",
      }}
    >
      <Box sx={{ px: 2, py: 1, mx: 2 }}>
        <Skeleton variant="text" width={120} height={24} />
      </Box>

      <Box my={2}>
        <Divider />
      </Box>

      <Box sx={{ px: 2, flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
        {[1, 2, 3, 4, 5].map((item) => (
          <Box key={item} sx={{ p: 2 }}>
            <Skeleton variant="text" width="40%" height={20} />
            <Skeleton variant="text" width="60%" height={20} />
          </Box>
        ))}
      </Box>
    </Paper>
  </Grid>
);

const RiskColumn = ({ title, color, bgColor, patients, isLoading }) => {
  if (isLoading) {
    return <RiskColumnSkeleton />;
  }

  return (
    <Grid item xs={12} sm={6} md={2} sx={{ minWidth: { xs: '100%', sm: '300px' } }}>
      <Paper
        elevation={0}
        sx={{
          height: { xs: 'auto', sm: '75vh' },
          minHeight: { xs: '200px', sm: '75vh' },
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          border: "1px solid #f0f0f0",
          bgcolor: "white",
          p: "20px 0",
        }}
      >
        {/* Card Header */}
        <Box
          sx={{
            px: 2,
            py: 1,
            display: "inline-block",
            bgcolor: bgColor,
            borderRadius: "8px",
            mx: 2,
          }}
        >
          <Typography variant="subtitle1" fontWeight={600} sx={{ color }}>
            {title}
          </Typography>
        </Box>

        <Box my={2}>
          <Divider />
        </Box>

        <Box
          sx={{
            px: 2,
            flex: 1,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <PatientList patients={patients} />
        </Box>
      </Paper>
    </Grid>
  );
};

function PatientList({ patients }) {
  const router = useRouter()
console.log(patients)
  const handlePatientClick = (patient) => {
    router.push(`/patient/${patient.MOTHER_ID}`)
  }

  return (
    <Box sx={{ overflowY: "auto", height: "100%", scrollbarWidth: 0 }}>
      {patients.map((patient, index) => (
        <Box
          key={index}
          onClick={() => handlePatientClick(patient)}
          sx={{
            p: 2,
            "&:hover": {
              bgcolor: "#fafafa",
              cursor: "pointer",
              transform: "translateX(4px)",
              transition: "all 0.2s ease-in-out",
            },
            "&:last-child": {
              borderBottom: "none",
            },
            "&:active": {
              bgcolor: "#f5f5f5",
            }
          }}
        >
          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            BP {patient.BP}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Patient ID {patient.MOTHER_ID}
          </Typography>
        </Box>
      ))}
    </Box>
  )
}

export default function RiskBoard() {
  const [patientSearchQuery, setPatientSearchQuery] = useState('');
  const [allPatients, setAllPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const response = await predictRiskByPateintId(patientSearchQuery)
        const parsedData = JSON.parse(response.response.body)

        // Check for error messages or empty data
        if ((typeof parsedData?.message === 'string' &&
          (parsedData.message.includes('No valid data found after cleaning.') ||
            parsedData.message.includes('No data found') ||
            parsedData.message.includes('not found'))) ||
          parsedData.message) {
          setAllPatients([])
          return
        }

        let formattedPatients = []

        // Handle single patient object response
        if (patientSearchQuery && !Array.isArray(parsedData)) {
          const patient = parsedData
          formattedPatients = [{
            ...patient,
            riskLevel: patient.risk_score > 0.5 ? 'high' : 'low',
            lastVisit: 'Recent',
            avatarColor: patient.risk_score > 0.5 ? '#DD6B20' : '#2E7D32'
          }]
        }
        // Handle multiple patients response
        else {
          formattedPatients = [
            ...(parsedData['High-Risk'] || []).map(patient => ({
              ...patient,
              riskLevel: 'high',
              lastVisit: 'Recent',
              avatarColor: '#DD6B20'
            })),
            ...(parsedData['Low-Risk'] || []).map(patient => ({
              ...patient,
              riskLevel: 'low',
              lastVisit: 'Recent',
              avatarColor: '#2E7D32'
            }))
          ]
        }

        setAllPatients(formattedPatients)
      } catch (error) {
        console.error('Error fetching patient data:', error)
        setAllPatients([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [patientSearchQuery])

  const handleRefresh = () => {
    console.log("Refreshing data...")
    window.location.reload()
  }

  // Filter patients by risk level
  const highRiskPatients = allPatients.filter(patient => patient.riskLevel === 'high')
  const moderateRiskPatients = allPatients.filter(patient => patient.riskLevel === 'moderate')
  const lowRiskPatients = allPatients.filter(patient => patient.riskLevel === 'low')
  const followUpPatients = allPatients.filter(patient => patient.needsFollowUp)

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f5f7fa", overflow: 'auto' }}>
      <Box sx={{ 
        flexGrow: 1, 
        p: { xs: 1, sm: 2, md: 3 }, 
        mx: { xs: 0, sm: "2vw", md: "2vw" },
        width: '100%',
        paddingBottom: 10,
        marginBottom: 20
      }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: "space-between",
            alignItems: { xs: 'stretch', sm: 'center' },
            gap: { xs: 2, sm: 2 },
            mb: 3,
            backgroundColor: "#fff",
            borderRadius: 2,
            px: { xs: 2, sm: 3 },
            py: 2,
            boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
          }}
        >
          <Box>
            <Typography variant="h5" fontWeight={600} color="#333" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
              Patient Risk Board
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
              Displays up to 50 high-priority records per risk level. Use the search box to find a specific patient by ID
            </Typography>
          </Box>
          <Box sx={{
            display: 'flex', 
            gap: 2,
            flexDirection: { xs: 'column', sm: 'row' },
            width: { xs: '100%', sm: 'auto' },
            alignItems: 'center'
          }}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              size="small"
              sx={{
                borderRadius: 1.5,
                textTransform: "none",
                px: 2,
                py: 1,
                borderColor: "#ddd",
                color: "#666",
                minWidth: 'auto',
                "&:hover": {
                  borderColor: "#bbb",
                  bgcolor: "#f9f9f9",
                },
              }}
              onClick={handleRefresh}
            >
              Refresh
            </Button>
            <TextField
              size="small"
              variant="outlined"
              placeholder="Search by Patient ID..."
              value={patientSearchQuery}
              onChange={(e) => setPatientSearchQuery(e.target.value)}
              sx={{
                width: { xs: '100%', sm: '180px' },
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                  height: '36px',
                  backgroundColor: '#f5f5f5',
                  '&:hover': {
                    backgroundColor: '#eeeeee',
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
                    borderColor: '#1976d2',
                  },
                },
                '& .MuiInputBase-input': {
                  fontSize: '0.875rem',
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ fontSize: '1.2rem', color: '#666' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Box>
        <Grid container spacing={2}>
          {isLoading ? (
            <Grid container mb={10} spacing={2}>
              <RiskColumnSkeleton />
              <RiskColumnSkeleton />
              <RiskColumnSkeleton />
              <RiskColumnSkeleton />
            </Grid>
          ) : (
            <>
              {highRiskPatients.length > 0 && (
                <Grid item xs={12} sm={6} md={3}>
                  <RiskColumn
                    title="High-Risk Patients"
                    color="#ED6C02"
                    bgColor="#FFF4E5"
                    patients={highRiskPatients}
                    isLoading={isLoading}
                  />
                </Grid>
              )}

              {moderateRiskPatients.length > 0 && (
                <Grid item xs={12} sm={6} md={3}>
                  <RiskColumn
                    title="Moderate Risk"
                    color="#2E7D32"
                    bgColor="#E8F5E9"
                    patients={moderateRiskPatients}
                    isLoading={isLoading}
                  />
                </Grid>
              )}

              {lowRiskPatients.length > 0 && (
                <Grid item xs={12} sm={6} md={3}>
                  <RiskColumn
                    title="Low-Risk"
                    color="#0277BD"
                    bgColor="#E3F2FD"
                    patients={lowRiskPatients}
                    isLoading={isLoading}
                  />
                </Grid>
              )}

              {followUpPatients.length > 0 && (
                <Grid item xs={12} sm={6} md={3}>
                  <RiskColumn
                    title="Needs Follow-Up / Review"
                    color="#616161"
                    bgColor="#F5F5F5"
                    patients={followUpPatients}
                    isLoading={isLoading}
                  />
                </Grid>
              )}
            </>
          )}
        </Grid>
      </Box>
    </Box>
  )
}
