'use client';
import GroupsIcon from '@mui/icons-material/Groups';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import GradeRoundedIcon from '@mui/icons-material/GradeRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';

import { Box, Grid, Typography, Skeleton, colors } from '@mui/material';
import StatsCard from './StatsCard';
import { useEffect, useState } from 'react';
import { getStatsDetails } from '../../lib/api';

export default function ProfilePage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await getStatsDetails();
      setStats(data.response);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const dashboardStats = [
    {
      value: stats?.total_pregnancies ?? '-',
      title: 'Total Pregnancies',
      Icon: GroupsIcon,
      color:'#FE8235D9'
    },
    {
      value: stats?.high_risk_pregnancies ?? '-',
      title: 'High-Risk Pregnancies',
      Icon: InfoRoundedIcon,
      color:'#FFC327'
    },
    {
      value: stats?.total_deliveries ?? '-',
      title: 'Total Deliveries',
      Icon: GradeRoundedIcon,
      color:'#FE8235D9'
    },
    {
      value: `${stats?.high_risk_percentage}%` ?? '-',
      title: 'High Risk (%)',
      Icon: GroupsIcon,
      color:'#FE8235D9'
    },
  ];

  const clinicalIndicators = [
    {
      value: stats?.high_bp_count ?? '-',
      title: 'Pregnant Women with High BP',
      Icon: GroupsIcon,
      color:'#FE8235D9'
    },
    {
      value: stats?.anemia_count ?? '-',
      title: 'Patient with Anemia',
      Icon: SportsEsportsIcon,
      Icon: GroupsIcon,
      color:'#FE8235D9'
    },
    {
      value: stats?.low_weight_count ?? '-',
      title: 'Low Weight Gain',
      Icon: GroupsIcon,
      color:'#FE8235D9'
    },
    {
      value: `${stats?.average_risk_score_10_scale}/10` ?? '-',
      title: 'Avg. Risk Score (out of 10)',
      Icon: GroupsIcon,
      color:'#FE8235D9'
    },
  ];

  const renderCards = (dataArr) =>
    loading
      ? Array(4)
          .fill(0)
          .map((_, i) => (
            <Grid key={i} item xs={12} sm={6} md={3}>
              <Skeleton
                variant="rounded"
                height={100}
                sx={{ borderRadius: '10px' }}
              />
            </Grid>
          ))
      : dataArr.map((card, idx) => (
          <Grid key={idx} item xs={12} sm={6} md={3} display="flex">
            <StatsCard
              value={card.value}
              title={card.title}
              Icon={card.Icon}
              color={card.color}
            />
          </Grid>
        ));

  return (
    <Box sx={{ width: '100%', maxWidth: '1440px', px: 5, py: 4,overflow:'auto' }}>
      {/* Dashboard Section */}
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
        Dashboard details
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {renderCards(dashboardStats)}
      </Grid>

      {/* Clinical Indicators */}
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
        Clinical Red Flag Indicators
      </Typography>
      <Grid container spacing={2}>
        {renderCards(clinicalIndicators)}
      </Grid>
    </Box>
  );
}
