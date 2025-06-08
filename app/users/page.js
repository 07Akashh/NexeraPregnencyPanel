'use client'
import React, { useEffect, useState, useCallback } from "react";
import { styled } from "@mui/system";
import SearchIcon from "@mui/icons-material/Search";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { getUserList } from "../../lib/api";

import {
  Dialog,
  DialogContent,
  Stack,
  Switch,
  Typography,
  Table,
  TextField,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  Skeleton,
  InputAdornment,
  IconButton,
  Divider,
  Select,
  MenuItem,
  Pagination,
} from "@mui/material";
import { useRouter } from "next/navigation";

const Subadmin = () => {
  const router = useRouter();
  const [activeButton, setActiveButton] = useState("subAdmin");
  const [loading, setLoading] = useState(true);
  const [SubadminList, setSubadminList] = useState([]);
  const [activeRoleType, setActiveRoleType] = useState(2);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [subAdminToDelete, setSubAdminToDelete] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);

  const [searchQuery, setSearchQuery] = useState();

  const SkeletonRow = () => (
    <TableRow>
      {Array.from({ length: 6 }).map((_, index) => (
        <TableCell key={index}>
          <Skeleton variant="text" width={100} />
        </TableCell>
      ))}
    </TableRow>
  );

  
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  paddingBlock:"8px",
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#FCFDFD",
    color: "#202224",
    fontFamily: "Nunito Sans",
    fontSize: "16px",
    whiteSpace: "nowrap",
    fontWeight: 800,
    height: "39px",
    borderBottom: "none",
    textAlign: "left",
  },
  [`&.${tableCellClasses.body}`]: {
    fontFamily: "Poppins",
    fontSize: "14px",
    color: "#202224",
    whiteSpace: "nowrap",
    fontWeight: 400,
    height: "36px",
    borderBottom: "none",
    textAlign: "left",
  },
}));

  const StyledTableRow = styled(TableRow)({
    fontFamily: "Poppins",
    alignItems: "left",
    borderBottomStyle: "solid",
    borderBottomWidth: "1px",
    borderColor: "#e9e7fd",
  });

  const columns = [
    { label: "S.NO", id: "sno" },
    { label: "User ID", id: "userId" },
    { label: "User Name", id: "name" },
    // { label: "Email address", id: "email" },
    { label: "Role type", id: "roleType" },
    // Conditionally include the "Status" column
    // ...(teamAccess === 2 || teamAccess === 3 ? [{ label: "Status", id: "status" }] : []),
    // Conditionally include the "Action" column
    // ...(teamAccess === 3 ? [{ label: "Action", id: "action" }] : [])
  ];



  const fetchSubadmins = async (page, limit) => {
    setLoading(true);
    try {
      const data = await getUserList(limit, page);
      console.log(data)
      setSubadminList(data.users);
      setTotal(data.total);
    } catch (error) {
      console.error("Error fetching sub-admins:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSubadmins(page, limit);
  }, [page, limit, activeRoleType]);

  const handleSwitch = (event, id) => {
    const updatedTeamList = SubadminList.map((row) =>
      row._id === id ? { ...row, status: event.target.checked } : row
    );
    setSubadminList(updatedTeamList);
  };

  const handleRoleButtonClick = (roleType) => {
    setActiveRoleType(roleType);
    setActiveButton(roleType === 2 ? "subAdmin" : "contentManager");
    setPage(1);
  };

  const filteredList = activeRoleType
    ? SubadminList.filter((subadmin) => subadmin.roleType === activeRoleType)
    : SubadminList;

  const handleDeleteClick = useCallback((id) => {
    setSubAdminToDelete(id);
    setDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = async () => {
    try {
    //   await deleteSubAdmin(subAdminToDelete);
      setSubadminList((prevList) =>
        prevList.filter((subadmin) => subadmin._id !== subAdminToDelete)
      );
      setDeleteDialogOpen(false);
    //   Swal.fire("Success", "Deleted successfully", "success");
    } catch (error) {
    //   Swal.fire("Error", "Something went wrong", error.message);
    }
  };

  const handleSort = (columnId) => {
    let direction = "asc";
    if (sortConfig.key === columnId && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key: columnId, direction });
  };

  const sortedList = React.useMemo(() => {
    if (sortConfig.key) {
      return [...filteredList].sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (sortConfig.key === "name") {
          aValue = `${a.firstName} ${a.lastName}`;
          bValue = `${b.firstName} ${b.lastName}`;
        }

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return filteredList;
  }, [filteredList, sortConfig]);

  return (
    <Box
      sx={{
        width: "100%",
        borderRadius: "12px",
        backgroundColor: "#FFF",
        height: "85px",
      }}
    >
      <Stack direction="column" spacing={3} sx={{ width: "100%"}}>
        <Box
          sx={{
            width: "100%",
            padding: "16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
            {/* <Box /> */}
          <TextField
            placeholder="Search by first name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{
              width: "300px",
              p:0,
              visibility: 'hidden',
              flexShrink: 0,
              borderRadius: "8px",
              backgroundClip: "#FFF",
              // mt: "26px",
              '& .MuiOutlinedInput-root': {
                // '& fieldset': { borderColor: '#10B771' },
                '&:hover fieldset': { borderColor: '#10B771' },
                '&.Mui-focused fieldset': { borderColor: '#10B771' },
              },
              // '& .MuiInputLabel-root': { color: '#10B771' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#10B771' },
            }}
          />

            <Stack direction="row" spacing={4} >
              <Button
                sx={{
                  backgroundColor: "#10B771",
                  height: "40px",
                  paddingX:'10px',
                  "&:hover": {
                    backgroundColor: "#10B771",
                  },
                }}
                variant="contained"
                onClick={() => {
                  router.push("/users/create");
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "Nunito Sans",
                    fontSize: "14px",
                    fontStyle: "normal",
                    fontWeight: 700,
                    lineHeight: "27px",
                  }}
                >
                  Add New Member
                </Typography>
              </Button>
            </Stack>
        </Box>
        <Stack
          direction="column"
          spacing={1}
          sx={{
            justifyContent: "start",
            backgroundColor: "#ffffff",
            padding: "10px",
          }}
        >
          <Stack
            direction="row"
            spacing={4}
            sx={{
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "#ffffff",
              paddingLeft: "20px",
              paddingRight: "20px",
            }}
          >
            <Box>
              <Button
                variant="outlined"
                sx={{
                  width: "150px",
                  height: "40px",
                  textTransform: "none",
                  border: "0.6px solid #777676",
                  borderRadius: "8px",
                  "&:hover": {
                    backgroundColor: "rgba(72, 255, 105, 0.1)",
                    border: "1px solid var(--normal-secondary,rgba(16, 183, 113, 0.89))",
                    "& .MuiTypography-root": {
                      color: activeButton === "subAdmin" ? "#1e1e1e" : "#10B771",
                    },
                  },
                  backgroundColor:
                    activeButton === "subAdmin"
                      ? "rgba(72, 255, 167, 0.1)"
                      : "#FFFFFF",
                  border:
                    activeButton === "subAdmin"
                      ? "1px solid var(--normal-secondary, #10B771)"
                      : "0.6px solid rgb(118, 119, 118)",
                  mt: "10px",
                  mb: "10px",
                }}
                onClick={() => handleRoleButtonClick(2)}
              >
                <Typography
                  sx={{
                    color: activeButton === "subAdmin" ? "#1e1e1e" : "#777676",
                    fontFamily: "poppins",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "normal",
                  }}
                >
                  Members
                </Typography>
              </Button>
            </Box>
          </Stack>

          <Divider />

          <Paper
            sx={{
              paddingBottom: "20px",
              backgroundColor: "#fff",
              borderRadius: "8px 8px 0px 0px",
            }}
          >
            <TableContainer sx={{ maxHeight: 400, overflowY: 'auto' }}>
              <Table stickyHeader>
                <TableHead >
                  <StyledTableRow>
                    {columns.map((column) => (
                      <StyledTableCell key={column.id} sx={{ py: 0, my: 0 }} >
                        {column.label}
                        {column.id !== "sno" && (
                          <IconButton
                            onClick={() => handleSort(column.id)}
                            size="small"
                          >
                            {sortConfig.key === column.id ? (
                              sortConfig.direction === "asc" ? (
                                <ArrowUpwardIcon fontSize="small" />
                              ) : (
                                <ArrowDownwardIcon fontSize="small" />
                              )
                            ) : (
                              <ArrowDownwardIcon fontSize="small" />
                            )}
                          </IconButton>
                        )}
                      </StyledTableCell>
                    ))}
                  </StyledTableRow>
                </TableHead>
                <TableBody style={{ borderBottom: "none", overflow:'auto' }}>
                  {loading && (
                    <>
                      {Array.from({ length: 6 }).map((_, index) => (
                        <SkeletonRow key={index} />
                      ))}
                    </>
                  )}

                  {!loading &&
                    SubadminList?.map((row, index) => (
                      <StyledTableRow
                        key={row.user_id}
                        sx={{ backgroundColor: "#fff" }}
                      >
                        <StyledTableCell>{index + 1}</StyledTableCell>
                        <StyledTableCell>{row.user_id}</StyledTableCell>
                        {/* <StyledTableCell>
                          {`${row.username}`}
                        </StyledTableCell> */}
                        <StyledTableCell>{row.username}</StyledTableCell>
                        <StyledTableCell>
                          {row.user_type}
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
          {!SubadminList.length && (
            <Box>
              <Typography
                sx={{
                  ml: 5,
                  mt: 10,
                  mb: 10,
                  color: "1e1e1e",
                  fontSize: "20px",
                  fontWeight: 700,
                }}
              >
                No data
              </Typography>
            </Box>
          )}
          <Box display={"flex"} justifyContent={"space-between"} mt={0} pt={0} pb={1}>
            <Box ml={5}>
              <span> Rows per page : </span>
              <Select
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                variant="outlined"
                sx={{
                  // width: "40px",
                  "& .MuiSelect-select": {
                    padding: "8px",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#10B771",
                  },
                }}
              >
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
              </Select>
            </Box>
            <Stack spacing={2}>
              <Pagination
                count={Math.ceil(total / limit)}
                page={page}
                sx={{
                  "& .MuiPaginationItem-page.Mui-selected": {
                    backgroundColor: "#10B771",
                    color: "#FFF",
                  },
                }}
                onChange={(e, value) => { 
                    console.log(value)
                    setPage(value)}}
                variant="outlined"
                shape="rounded"
              />
            </Stack>
          </Box>
        </Stack>
      </Stack>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            Are you sure you want to delete this sub-admin?
          </Typography>
          <Button onClick={handleConfirmDelete}>Yes</Button>
          <Button onClick={() => setDeleteDialogOpen(false)}>No</Button>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Subadmin;
