import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid';
import { Log, Level } from '../../components/Logs';



interface LogTableProps {
    logs: Log[];
}

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const milliseconds = String(date.getMilliseconds()).padStart(3, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds},${milliseconds}`;
}


const LogTable: React.FC<LogTableProps> = ({
    logs
}) => {
    const logsWithId = logs.map((log, index) => ({ ...log, id: index.toString() }));
    const formattedLogs = logsWithId.map((log) => ({
            ...log,
            timestamp: formatDate(log.timestamp),
    }))
    .sort((a, b) => parseInt(b.id) - parseInt(a.id));;
    const columns: GridColDef<(typeof formattedLogs)[number]>[] = [
        { 
          field: 'timestamp', 
            headerName: 'Timestamp', 
            type: 'string',
            width: 150 },
        {
            field: 'logger',
            headerName: 'Logger',
            type: 'string',
            width: 150,
        },
        {
            field: 'level',
            headerName: 'Level',
            type: 'string',
            width: 100,
        },
        {
            field: 'source',
            headerName: 'Source',
            type: 'string',
            width: 200,
        },
        {
            field: 'message',
            headerName: 'Message',
            width: 400,
        },
  ];
  const getRowClassName = (params: GridRowParams) => {
    if (params.row.level === Level.ERROR) {
      return 'error-row';
    }
    if (params.row.level === Level.WARNING) {
      return 'warning-row';
    }
    return '';
  };

  return (
    <Box sx={{ height: 400, width: 'inherit' }}>
      <DataGrid
        rows={formattedLogs}
        columns={columns}
        getRowClassName={getRowClassName}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
        sx={{
          '& .error-row': {
            backgroundColor: '#330000',
          },
          '& .warning-row': {
            backgroundColor: '#e75b1e',
          },
        }}
      />
    </Box>
  )
}

export default LogTable