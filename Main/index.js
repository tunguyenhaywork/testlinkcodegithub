import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Typography,
} from '@mui/material';
import PublishIcon from '@mui/icons-material/Publish';

import { fetchInstance } from '@/utils/fetchInstance';

import LoadingTable from '../LoadingTable';
import ModalImport from '../ModalImport';

import styles from './main.module.css';

const Main = () => {
  const router = useRouter();

  const authKeys = useSelector((state) => state.login?.authKeys);
  const isUnleashedUser = useSelector((state) => state?.login?.isUnleashedUser);
  const authToken = localStorage.getItem('authToken');

  const [isLoading, setIsLoading] = useState(false);
  const [dataAzureDevOps, setDataAzureDevOps] = useState([]);
  const [orderBy, setOrderBy] = useState('projectName');
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [isOpenModal, setIsOpenModal] = useState(false);

  useLayoutEffect(() => {
    if (!isUnleashedUser) {
      router.push('/');
    }
  }, [isUnleashedUser, router]);

  useEffect(() => {
    setIsLoading(true);
    (async () => {
      try {
        const response = await fetchInstance('/api/getAzureDevOps', {
          method: 'POST',
          variables: {
            formData: {
              userID: authKeys?.userid,
            },
          },
        });

        const tempData = response?.body?.items;
        setDataAzureDevOps(tempData || []);
      } catch (error) {
        return error;
      } finally {
        setIsLoading(false);
      }
    })();
  }, [authToken, authKeys?.userid]);

  const handleFormatDate = (date) => {
    const originalDate = new Date(date);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return originalDate?.toLocaleDateString('en-US', options);
  };

  const createSortHandler = (property) => {
    const compareDates = (a, b, isAsc) => {
      const dateA = new Date(a?.createdDate)?.getTime();
      const dateB = new Date(b?.createdDate)?.getTime();
      return isAsc ? dateB - dateA : dateA - dateB;
    };

    const isAsc = orderBy === property && order === 'asc';
    const newData = dataAzureDevOps?.sort((a, b) => compareDates(a, b, isAsc));
    setDataAzureDevOps(newData);
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    setPage(0);
  };

  const handleClick = (id) => {
    const selectedIndex = selected?.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected?.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected?.concat(selected?.slice(1));
    } else if (selectedIndex === selected?.length - 1) {
      newSelected = newSelected?.concat(selected?.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected?.concat(
        selected?.slice(0, selectedIndex),
        selected?.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const handleSelectAllClick = (event) => {
    if (event?.target?.checked) {
      const newSelected = dataAzureDevOps?.map((item) => item?.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const isSelected = (id) => selected?.indexOf(id) !== -1;

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event?.target?.value, 10));
    setPage(0);
  };

  const visibleRows = useMemo(() => {
    return dataAzureDevOps?.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataAzureDevOps, page, rowsPerPage, order]);

  const handleImport = () => {
    if (selected?.length > 50) {
      toast.warning(`You can only select up to 50 items!`);
      return;
    }
    setIsOpenModal(true);
  };

  return (
    <section className={styles.mainWrap}>
      <div className={styles.header}>
        Azure DevOps
        <button
          className={
            selected?.length
              ? 'button-primary-common'
              : 'disabled-button-common'
          }
          disabled={!selected?.length}
          onClick={() => handleImport()}
        >
          <PublishIcon />
          Import
        </button>
      </div>
      <div className={styles.contentWrap}>
        {isLoading ? (
          <LoadingTable />
        ) : (
          <>
            <TableContainer>
              <Table aria-label="simple table">
                <TableHead sx={{ backgroundColor: '#EFF8FF' }}>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        indeterminate={
                          selected?.length > 0 &&
                          selected?.length < dataAzureDevOps?.length
                        }
                        checked={
                          dataAzureDevOps?.length > 0 &&
                          selected?.length === dataAzureDevOps?.length
                        }
                        onChange={handleSelectAllClick}
                        inputProps={{
                          'aria-label': 'select all desserts',
                        }}
                      />
                    </TableCell>
                    <TableCell width={'10%'}>ID</TableCell>
                    <TableCell width={'30%'}>Title</TableCell>
                    <TableCell width={'45%'}>Description</TableCell>
                    <TableCell width={'15%'}>
                      <TableSortLabel
                        active={orderBy === 'createdDate'}
                        direction={orderBy === 'createdDate' ? order : 'asc'}
                        onClick={() => createSortHandler('createdDate')}
                      >
                        Created Date
                      </TableSortLabel>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dataAzureDevOps?.length ? (
                    visibleRows?.map((item, index) => {
                      const isItemSelected = isSelected(item?.id);
                      const labelId = `enhanced-table-checkbox-${index}`;
                      return (
                        <TableRow
                          hover
                          key={item?.id}
                          aria-checked={isItemSelected}
                          selected={isItemSelected}
                          sx={{ cursor: 'pointer' }}
                          onClick={() => handleClick(item?.id)}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              color="primary"
                              checked={isItemSelected}
                              inputProps={{
                                'aria-labelledby': labelId,
                              }}
                            />
                          </TableCell>
                          <TableCell component="td" scope="row" width={'10%'}>
                            {item?.id || '--/--'}
                          </TableCell>
                          <TableCell width={'30%'}>
                            {item?.title || '--/--'}
                          </TableCell>
                          <TableCell width={'44%'}>
                            {item?.description?.length <= 60
                              ? item?.description || '--/--'
                              : `${item?.description?.slice(0, 60)}...`}
                          </TableCell>
                          <TableCell width={'15%'}>
                            {handleFormatDate(item?.createdDate) || '--/--'}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        align="center"
                        sx={{ textAlign: 'center !important' }}
                      >
                        <Typography variant="body1">
                          No Azure DevOps data to show.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 20, 30, 50, 70, 100]}
              component="div"
              count={dataAzureDevOps?.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(_, newPage) => setPage(newPage)}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </div>

      {isOpenModal && (
        <ModalImport
          isOpen={isOpenModal}
          onRequestClose={() => setIsOpenModal(false)}
          selectedWorkItemIds={selected}
        />
      )}
    </section>
  );
};

export default Main;
