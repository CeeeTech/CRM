import PropTypes from 'prop-types';
import { format } from 'date-fns';
import {
  Avatar,
  Box,
  Card,
  Checkbox,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import { getInitials } from 'src/utils/get-initials';

export const LeadsTable = (props) => {
  const {
    count = 0,
    items = [],
    onDeselectAll,
    onDeselectOne,
    onPageChange = () => {},
    onRowsPerPageChange,
    onSelectAll,
    onSelectOne,
    onRowClick,
    page = 0,
    rowsPerPage = 0,
    selected = []
  } = props;

  const selectedSome = (selected.length > 0) && (selected.length < items.length);
  const selectedAll = (items.length > 0) && (selected.length === items.length);

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedAll}
                    indeterminate={selectedSome}
                    onChange={(event) => {
                      if (event.target.checked) {
                        onSelectAll?.();
                      } else {
                        onDeselectAll?.();
                      }
                    }}
                  />
                </TableCell>
                <TableCell>
                  Student
                </TableCell>
                <TableCell>
                  Sheduled At
                </TableCell>
                <TableCell>
                  Sheduled To
                </TableCell>
                <TableCell>
                  Course
                </TableCell>
                <TableCell>
                  Branch
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((lead) => {
                const isSelected = selected.includes(lead.id);
                // const createdAt = format(lead.createdAt, 'dd/MM/yyyy');

                return (
                  <TableRow
                    hover
                    key={lead.id}
                    selected={isSelected}
                    onClick={() => onRowClick?.(lead.id)}
                  >
                    <TableCell padding="checkbox" >
                      <Checkbox
                        checked={isSelected}
                        onChange={(event) => {
                          if (event.target.checked) {
                            onSelectOne?.(lead.id);
                          } else {
                            onDeselectOne?.(lead.id);
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Stack
                        alignItems="center"
                        direction="row"
                        spacing={2}
                      >
                        <Avatar src={lead.avatar}>
                          {getInitials(lead.name)}
                        </Avatar>
                        <Typography variant="subtitle2">
                          {lead.name}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      {lead.scheduled_at}
                    </TableCell>
                    <TableCell>
                      {lead.scheduled_to}
                    </TableCell>
                    <TableCell>
                      {lead.course}
                    </TableCell>
                    <TableCell>
                      {lead.branch}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <TablePagination
        component="div"
        count={count}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

LeadsTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onDeselectAll: PropTypes.func,
  onDeselectOne: PropTypes.func,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  onSelectAll: PropTypes.func,
  onSelectOne: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  selected: PropTypes.array
};
