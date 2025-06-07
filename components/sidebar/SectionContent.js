import {
  Box, List, ListItem, ListItemText, Typography, Divider, Avatar,
  ListItemButton, TextField, InputAdornment, Chip,
  Tooltip, Skeleton
} from "@mui/material"
import { useSearchParams, useRouter } from "next/navigation"
import SearchIcon from '@mui/icons-material/Search'
import { useState, useEffect } from "react"
import WarningIcon from '@mui/icons-material/Warning'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import InfoIcon from '@mui/icons-material/Info'
import { predictRiskByPateintId} from '../../lib/api'


const demoPatientData = [
  {
    id: '2223433',
    riskLevel: 'high',
    lastVisit: '12m ago',
    avatarColor: '#DD6B20'
  },
  {
    id: '2223434',
    riskLevel: 'low',
    lastVisit: '2m ago',
    avatarColor: '#2E7D32'
  },
  {
    id: '2223435',
    riskLevel: 'medium',
    lastVisit: '1m ago',
    avatarColor: '#ED6C02'
  },
  {
    id: '2223436',
    riskLevel: 'high',
    lastVisit: '3m ago',
    avatarColor: '#DD6B20'
  },
  {
    id: '2223437',
    riskLevel: 'low',
    lastVisit: '5m ago',
    avatarColor: '#2E7D32'
  },
  {
    id: '2223438',
    riskLevel: 'high',
    lastVisit: '2d ago',
    avatarColor: '#DD6B20'
  },
  {
    id: '2223439',
    riskLevel: 'medium',
    lastVisit: '1d ago',
    avatarColor: '#ED6C02'
  },
  {
    id: '2223440',
    riskLevel: 'low',
    lastVisit: '4h ago',
    avatarColor: '#2E7D32'
  },
  {
    id: '2223441',
    riskLevel: 'high',
    lastVisit: '6h ago',
    avatarColor: '#DD6B20'
  },
  {
    id: '2223442',
    riskLevel: 'medium',
    lastVisit: '8h ago',
    avatarColor: '#ED6C02'
  },
  {
    id: '2223443',
    riskLevel: 'low',
    lastVisit: '1h ago',
    avatarColor: '#2E7D32'
  },
  {
    id: '2223444',
    riskLevel: 'high',
    lastVisit: '30m ago',
    avatarColor: '#DD6B20'
  },
  {
    id: '2223445',
    riskLevel: 'medium',
    lastVisit: '45m ago',
    avatarColor: '#ED6C02'
  },
  {
    id: '2223446',
    riskLevel: 'low',
    lastVisit: '15m ago',
    avatarColor: '#2E7D32'
  },
  {
    id: '2223447',
    riskLevel: 'high',
    lastVisit: '5m ago',
    avatarColor: '#DD6B20'
  }
]

export default function SectionContent({ activeSection, chatList, onChatSelect }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const chatId = searchParams.get('chat');


  switch (activeSection) {
    case "chats":
      return (
        <List>
          {chatList.map((chat) => (
            <ListItemButton
              key={chat.id}
              onClick={() => onChatSelect(chat.id)}
              sx={{
                borderRadius: 2,
                py: 0.2,
                my: 0.1,
                backgroundColor: chat.id === chatId ? 'rgba(1, 7, 39, 0.05)' : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(1, 7, 39, 0.05)',
                  '& .chat-title': {
                    color: 'customGreen.main',
                  }
                },
                '& .chat-title': {
                  color: chat.id === chatId ? 'customGreen.main' : 'inherit',
                }
              }}
            >
              <ListItemText
                primary={
                  <Typography
                    className="chat-title"
                    noWrap
                    sx={{
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {chat.title}
                  </Typography>
                }
              />
            </ListItemButton>
          ))}
        </List>
      )
    case "user":
      return (
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Avatar sx={{ mr: 2 }}>U</Avatar>
            <Typography variant="subtitle1">User Name</Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            user@example.com
          </Typography>
          <Divider sx={{ my: 2 }} />
          <List>
            <ListItem button={true} >
              <ListItemText primary="Profile" />
            </ListItem>
            <ListItem button={true}>
              <ListItemText primary="Account" />
            </ListItem>
            <ListItem button={true}>
              <ListItemText primary="Sign Out" />
            </ListItem>
          </List>
        </Box>
      )
    case "settings":
      return (
        <List>
          <ListItem button>
            <ListItemText primary="General" />
          </ListItem>
          <ListItem button>
            <ListItemText primary="Appearance" />
          </ListItem>
          <ListItem button>
            <ListItemText primary="Privacy" />
          </ListItem>
          <ListItem button>
            <ListItemText primary="Notifications" />
          </ListItem>
        </List>
      )
    case "files":
      return (
        <Box sx={{ p: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Your uploaded files
          </Typography>
          <List>
            <ListItem button>
              <ListItemText primary="Document1.pdf" secondary="May 20, 2025" />
            </ListItem>
            <ListItem button>
              <ListItemText primary="Image.jpg" secondary="May 19, 2025" />
            </ListItem>
            <ListItem button>
              <ListItemText primary="Spreadsheet.xlsx" secondary="May 18, 2025" />
            </ListItem>
          </List>
        </Box>
      )
    case "staff":
      const [patientSearchQuery, setPatientSearchQuery] = useState('')
      const [allPatients, setAllPatients] = useState([])
      const [isLoading, setIsLoading] = useState(true)

      const handlePatientClick = (motherId) => {
        router.push(`/patient/${motherId}`)
      }

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
      
      const getRiskBadge = (riskLevel) => {
        const baseChipStyles = {
          fontSize: '0.65rem',
          height: 24,
          px: 1.2,
          fontWeight: 500,
          '& .MuiChip-icon': { fontSize: '1rem', ml: '-4px' },
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: 2,
          },
        }
      
        switch (riskLevel) {
          case 'high':
            return (
              <Tooltip title="This patient is at high risk" arrow>
                <Chip
                  icon={<WarningIcon />}
                  label="High Risk"
                  size="small"
                  sx={{
                    bgcolor: '#FFF4E5',
                    color: '#DD6B20',
                    border: '1px solid #F6AD55',
                    ...baseChipStyles,
                    '& .MuiChip-icon': { color: '#DD6B20' }
                  }}
                />
              </Tooltip>
            )
          case 'medium':
            return (
              <Tooltip title="This patient is at medium risk" arrow>
                <Chip
                  icon={<InfoIcon />}
                  label="Medium Risk"
                  size="small"
                  sx={{
                    bgcolor: '#FFF3E0',
                    color: '#ED6C02',
                    border: '1px solid #FFB74D',
                    ...baseChipStyles,
                    '& .MuiChip-icon': { color: '#ED6C02' }
                  }}
                />
              </Tooltip>
            )
          case 'low':
            return (
              <Tooltip title="This patient is at low risk" arrow>
                <Chip
                  icon={<CheckCircleIcon />}
                  label="Low Risk"
                  size="small"
                  sx={{
                    bgcolor: '#E8F5E9',
                    color: '#2E7D32',
                    border: '1px solid #81C784',
                    ...baseChipStyles,
                    '& .MuiChip-icon': { color: '#2E7D32' }
                  }}
                />
              </Tooltip>
            )
          default:
            return null
        }
      }

      const LoadingSkeleton = () => (
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
          {[1, 2, 3, 4, 5].map((item) => (
            <ListItemButton
              key={item}
              sx={{
                mb: 0.5,
                borderRadius: 1,
              }}
            >
              <Box sx={{ width: '100%' }}>
                <Skeleton variant="text" width="30%" height={20} />
                <Skeleton variant="text" width="60%" height={24} />
                <Skeleton variant="rectangular" width={100} height={24} sx={{ mt: 1, borderRadius: 1 }} />
              </Box>
            </ListItemButton>
          ))}
        </List>
      )

      return (
        <Box sx={{ p: 0 }}>
          {/* Search Bar */}
          <TextField
            fullWidth
            size="small"
            variant="outlined"
            placeholder="Search by Patient ID..."
            value={patientSearchQuery}
            onChange={(e) => setPatientSearchQuery(e.target.value)}
            sx={{ 
              mb: 2,
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

          {/* Patient List */}
          {isLoading ? (
            <LoadingSkeleton />
          ) : allPatients.length === 0 ? (
            <Box sx={{ 
              p: 3, 
              textAlign: 'center',
              color: 'text.secondary'
            }}>
              <Typography variant="body1" sx={{ mb: 1 }}>
                No patients found
              </Typography>
              <Typography variant="body2">
                {patientSearchQuery ? 
                  'No patients match your search criteria' : 
                  'No patient data available'}
              </Typography>
            </Box>
          ) : (
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
              {allPatients.map((patient) => (
                <ListItemButton
                  key={patient.MOTHER_ID}
                  onClick={() => handlePatientClick(patient.MOTHER_ID)}
                  sx={{
                    mb: 0.5,
                    borderRadius: 1,
                    '&:hover': {
                      bgcolor: 'rgba(0, 0, 0, 0.04)'
                    }
                  }}
                >
                  <Box sx={{
                    alignItems: 'center',
                    width: '100%',
                  }}>
                    <Typography variant="body6" color="text.secondary" sx={{
                      fontSize: '0.75rem',
                    }}>
                      {patient.lastVisit}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      #{patient.MOTHER_ID}
                    </Typography>
                    {getRiskBadge(patient.riskLevel)}
                  </Box>
                </ListItemButton>
              ))}
            </List>
          )}
        </Box>
      )
    default:
      return null
  }
}
