import { Chip } from '@mui/material';
import { Circle } from '@mui/icons-material';

type Status = 'active' | 'warning' | 'critical';

interface StatusBadgeProps {
  status: Status;
  showIcon?: boolean;
}

const statusConfig = {
  active: {
    label: 'Activo',
    color: '#4caf50',
    bgcolor: '#e8f5e9',
    description: 'Alto rendimiento'
  },
  warning: {
    label: 'En Riesgo',
    color: '#ff9800',
    bgcolor: '#fff3e0',
    description: 'Riesgo medio'
  },
  critical: {
    label: 'Crítico',
    color: '#f44336',
    bgcolor: '#ffebee',
    description: 'Alto riesgo'
  }
};

export function StatusBadge({ status, showIcon = true }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Chip
      icon={showIcon ? <Circle sx={{ fontSize: 12, color: config.color + ' !important' }} /> : undefined}
      label={config.label}
      size="small"
      sx={{
        bgcolor: config.bgcolor,
        color: config.color,
        fontWeight: 600,
        border: `1px solid ${config.color}`,
        '& .MuiChip-icon': {
          color: config.color
        }
      }}
    />
  );
}
