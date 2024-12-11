import { Link as RouterLink, Link } from 'react-router-dom';
// material
import {
  Card,
  Table,
  Stack,
  Avatar,
  Box,
  Grid,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  Button
} from '@material-ui/core';
// components
import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { sentenceCase } from 'change-case';
import { useState } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import SearchNotFound from '../components/SearchNotFound';
// components
import {
  AppProjectsNum,
  AppWorkedThisWeek,
  AppOrderTimeline,
  AppCurrentVisits,
  AppActivityRate,
  AppUserWorked,
  AppWebsiteVisits,
  AppCurrentSubject,
  AppConversionRates
} from '../components/_dashboard/app';
import avaLogo from '../static/mock-images/avatars/avatar_default.jpg';
import { TeamListHead, TeamListToolbar, TeamListMoreMenu } from '../components/_dashboard/app/team';
// ----------------------------------------------------------------------
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(
      array,
      (_user) => _user.nickname.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}
const TABLE_HEAD = [
  { id: 'nickname', label: 'Nickname', alignRight: false },
  { id: 'firstName', label: 'First name', alignRight: false },
  { id: 'lastName', label: 'Last name', alignRight: false },
  { id: 'role', label: 'Role', alignRight: false },
  { id: '' }
];
export default function ProjectInfo() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = team.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };
  const getTeam = (id, setTeam, setLoading) => {
    const token = localStorage.getItem('token').replace(/['"]+/g, '');

    const auth = `Bearer ${token}`;
    const requestOptions = {
      method: 'GET',
      headers: {
        Authorization: auth
      }
    };
    fetch(`http://localhost:8080/projects/${id}/users`, requestOptions)
      .then(async (response) => {
        const data = await response.json();

        // check for error response
        if (!response.ok) {
          // get error message from body or default to response statusText
          const error = (data && data.message) || response.statusText;
          return Promise.reject(error);
        }
        setTeam(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('There was an error!', error);
      });
  };
  const [team, setTeam] = useState([]);
  console.log(localStorage.getItem('role').replace(/['"]+/g, '') !== 'Developer');
  const [loading, setLoading] = useState(true);
  const filteredUsers = applySortFilter(team, getComparator(order, orderBy), filterName);
  const isUserNotFound = filteredUsers.length === 0;
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - team.length) : 0;
  const val = parseInt(window.location.href.split('/')[5], 10);
  const project = JSON.parse(localStorage.getItem('projects')).find((value, index, array) => {
    if (value.id === val) return true;
    return false;
  });
  if (loading) getTeam(project.id, setTeam, setLoading);
  return (
    <Page title={`Project ${project.name} | Minimal-UI`}>
      <Container maxWidth="xl">
        <Box sx={{ pb: 5 }}>
          <Typography variant="h4">Project "{project.name}"</Typography>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4} md={4}>
            <AppWorkedThisWeek id={project.id} isProject="true" />
          </Grid>

          <Grid item xs={12} sm={4} md={4}>
            <AppUserWorked id={project.id} />
          </Grid>

          <Grid item xs={12} sm={4} md={4}>
            <AppActivityRate id={project.id} isProject="true" />
          </Grid>

          <Grid item xs={12} md={12} lg={12}>
            <Card>
              <TeamListToolbar
                numSelected={selected.length}
                filterName={filterName}
                onFilterName={handleFilterByName}
                id={project.id}
              />

              <Scrollbar>
                <TableContainer sx={{ minWidth: 800 }}>
                  <Table>
                    <TeamListHead
                      order={order}
                      orderBy={orderBy}
                      headLabel={TABLE_HEAD}
                      rowCount={team.length}
                      numSelected={selected.length}
                      onRequestSort={handleRequestSort}
                      onSelectAllClick={handleSelectAllClick}
                    />
                    <TableBody>
                      {filteredUsers
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row) => {
                          const { id, nickname, _, firstName, lastName, email, phone, role } = row;
                          const isItemSelected = selected.indexOf(nickname) !== -1;

                          return (
                            <TableRow
                              hover
                              key={id}
                              tabIndex={-1}
                              role="checkbox"
                              selected={isItemSelected}
                              aria-checked={isItemSelected}
                              onclick={() => alert(nickname)}
                            >
                              <TableCell padding="checkbox">
                                {localStorage.getItem('role').replace(/['"]+/g, '') !==
                                  'Developer' && (
                                  <Checkbox
                                    checked={isItemSelected}
                                    onChange={(event) => handleClick(event, nickname)}
                                  />
                                )}
                              </TableCell>
                              <TableCell component="th" scope="row" padding="none">
                                <Stack direction="row" alignItems="center" spacing={2}>
                                  <Avatar alt={nickname} src={avaLogo} />
                                  {localStorage.getItem('role').replace(/['"]+/g, '') !==
                                  'Developer' ? (
                                    <Typography variant="subtitle2" noWrap>
                                      <Link to={`/dashboard/user/${id}`}>{nickname}</Link>
                                    </Typography>
                                  ) : (
                                    <Typography variant="subtitle2" noWrap>
                                      {nickname}
                                    </Typography>
                                  )}
                                </Stack>
                              </TableCell>
                              <TableCell align="left">
                                {firstName === null ? '-' : firstName}
                              </TableCell>
                              <TableCell align="left">
                                {lastName === null ? '-' : lastName}
                              </TableCell>
                              <TableCell align="left">{role}</TableCell>
                              <TableCell align="right">
                                {localStorage.getItem('role').replace(/['"]+/g, '') !==
                                  'Developer' &&
                                  { role } !== 'Admin' && (
                                    <TeamListMoreMenu id={project.id} userId={id} />
                                  )}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      {emptyRows > 0 && (
                        <TableRow style={{ height: 53 * emptyRows }}>
                          <TableCell colSpan={6} />
                        </TableRow>
                      )}
                    </TableBody>
                    {isUserNotFound && (
                      <TableBody>
                        <TableRow>
                          <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                            <SearchNotFound searchQuery={filterName} />
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    )}
                  </Table>
                </TableContainer>
              </Scrollbar>

              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={team.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Card>
          </Grid>

          <Grid item xs={12} md={12} lg={12}>
            <AppWebsiteVisits id={project.id} isProject="true" />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
