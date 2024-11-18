import React from 'react';
import {
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

const LoadingTable = () => {
  return (
    <TableContainer>
      <Table aria-label="simple table">
        <TableHead sx={{ backgroundColor: '#EFF8FF' }}>
          <TableRow>
            <TableCell width={'10%'}>
              <Skeleton variant="rectangular" sx={{ width: '100%' }} />
            </TableCell>
            <TableCell width={'30%'}>
              <Skeleton variant="rectangular" sx={{ width: '100%' }} />
            </TableCell>
            <TableCell width={'45%'}>
              <Skeleton variant="rectangular" sx={{ width: '100%' }} />
            </TableCell>
            <TableCell width={'15%'}>
              <Skeleton variant="rectangular" sx={{ width: '100%' }} />
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {new Array(10)?.fill(0)?.map((_, index) => (
            <TableRow key={index}>
              <TableCell width={'10%'}>
                <Skeleton variant="rectangular" sx={{ width: '100%' }} />
              </TableCell>
              <TableCell width={'30%'}>
                <Skeleton variant="rectangular" sx={{ width: '100%' }} />
              </TableCell>
              <TableCell width={'44%'}>
                <Skeleton variant="rectangular" sx={{ width: '100%' }} />
              </TableCell>
              <TableCell width={'15%'}>
                <Skeleton variant="rectangular" sx={{ width: '100%' }} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default LoadingTable;
