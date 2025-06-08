'use client'
import React, { useEffect, useState, useCallback } from "react";
import { styled } from "@mui/system";
import SearchIcon from "@mui/icons-material/Search";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { getUserList } from "../../lib/api";
// import DeleteIcon from "../../assets/images/deleteIcon.svg";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";

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
  // Debounce the searchQuery
//   const debouncedSearchQuery = useDebounce(searchQuery);

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
  paddingBlock:"15px",
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
    { label: "Name", id: "name" },
    { label: "Email address", id: "email" },
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
      <Stack direction="column" spacing={3} sx={{ width: "100%" }}>
        <Box
          sx={{
            width: "100%",
            padding: "16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            // height: "100%",
            // border:'1px solid black'
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
                  router.push("/home/createSubadmin");
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
              // mt: "20px",
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
              {/* <Button
                variant="outlined"
                sx={{
                  width: "200px",
                  height: "40px",
                  textTransform: "none",
                  border: "0.6px solid #777676",
                  borderRadius: "8px",
                  "&:hover": {
                    backgroundColor: "rgba(72, 255, 99, 0.1)",
                    border: "1px solid var(--normal-secondary,rgb(102, 225, 91))",
                    "& .MuiTypography-root": {
                      color: activeButton === "contentManager" ? "#1e1e1e" : "#10B771",
                    },
                  },
                  backgroundColor:
                    activeButton === "contentManager"
                      ? "rgba(84, 255, 72, 0.1)"
                      : "#FFFFFF",
                  border:
                    activeButton === "contentManager"
                      ? "1px solid var(--normal-secondary,rgb(91, 225, 104))"
                      : "0.6px solid #777676",
                  ml: "20px",
                  mt: "10px",
                  mb: "10px",
                }}
                onClick={() => handleRoleButtonClick(3)}
              >
                <Typography
                  sx={{
                    color:
                      activeButton === "contentManager" ? "#1e1e1e" : "#777676",
                    fontFamily: "poppins",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "normal",
                  }}
                >
                  Content Manager
                </Typography>
              </Button> */}
            </Box>
            {/* <Button
              variant="outlined"
              sx={{
                width: "100px",
                height: "40px",
                textTransform: "none",
                border: "0.6px solid #777676",
                borderRadius: "8px",
                "&:hover": {
                  backgroundColor: "rgba(72, 128, 255, 0.10)",
                  border: "1px solid var(--normal-secondary, #5B7EE1)",
                  "& .MuiTypography-root": {
                    color: "#3A63DB",
                  },
                },
                backgroundColor:
                  activeButton === "contentManager"
                    ? "rgba(72, 128, 255, 0.10)"
                    : "#FFFFFF",
                border:
                  activeButton === "contentManager"
                    ? "1px solid var(--normal-secondary, #5B7EE1)"
                    : "0.6px solid #777676",
                ml: "20px",
                mt: "10px",
                mb: "10px",
              }}
              onClick={() => {
                handleExportClick();
              }}
            >
              <img
                src={download_cloud}
                alt="Export Icon"
                style={{ marginRight: "8px" }}
              />
              <Typography
                sx={{
                  color:
                    activeButton === "contentManager" ? "#3A63DB" : "#777676",
                  fontFamily: "poppins",
                  fontSize: "16px",
                  fontStyle: "normal",
                  fontWeight: 400,
                  lineHeight: "normal",
                }}
              >
                Export
              </Typography>
            </Button> */}
          </Stack>

          <Divider />

          <Paper
            sx={{
              paddingBottom: "20px",
              backgroundColor: "#fff",
              borderRadius: "8px 8px 0px 0px",
            }}
          >
            <TableContainer>
              <Table>
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
                <TableBody style={{ borderBottom: "none" }}>
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
                        <StyledTableCell>
                          {`${row.username} ${row.lastName}`}
                        </StyledTableCell>
                        <StyledTableCell>{row.username}</StyledTableCell>
                        <StyledTableCell>
                          {row.user_type}
                        </StyledTableCell>

                          {/* <StyledTableCell
                            sx={{
                              display: "inline-grid",
                              alignItems: "center",
                              justifyContent: "center",
                              padding: "12px",
                            }}
                          >
                            <Box>
                              <Switch
                                checked={row.status}
                                onChange={(e) => handleSwitch(e, row.user_id)}
                                sx={{
                                  mt: "0px",
                                  width: 56,
                                  height: 25,
                                  padding: 0,
                                  // "& .MuiSwitch-switchBase": {
                                  //   padding: 0,
                                  //   marginLeft: "4px",
                                  //   "&.Mui-checked": {
                                  //     transform: "translateX(28px)",
                                  //     color: "#fff",
                                  //   },
                                  //   "& .MuiSwitch-thumb": {
                                  //     width: 24,
                                  //     height: 25,
                                  //     border: "0.6px solidrgb(89, 212, 150)",
                                  //   },
                                  //   "& + .MuiSwitch-track": {
                                  //     backgroundColor: "#10B771",
                                  //     borderRadius: 20,
                                  //   },
                                  // },
                                  "& .MuiSwitch-switchBase": {
                                    padding: 0,
                                    marginLeft: "4px",
                                    "& .MuiSwitch-thumb": {
                                      width: 24,
                                      height: 25,
                                      border: "0.6px solid rgb(89, 212, 150)"
                                    },
                                    "&.Mui-checked": {
                                      transform: "translateX(28px)",
                                      color: "#fff",
                                      "& + .MuiSwitch-track": {
                                        backgroundColor: "#10B771",
                                        opacity: 1,
                                        borderRadius: 20,
                                      },
                                    },
                                  },
                                  "& .MuiSwitch-track": {
                                    backgroundColor: "#10B771",
                                    opacity: 0.5,
                                    borderRadius: 20,
                                    transition: "background-color 0.3s",
                                  },
                                  ".css-1mw4zdz-MuiButtonBase-root-MuiSwitch-switchBase.Mui-checked+.MuiSwitch-track":
                                  {
                                    backgroundColor: "#10B771",
                                    opacity: 1,
                                  },
                                  ".css-z4xcbx-MuiSwitch-root .MuiSwitch-switchBase+.MuiSwitch-track":
                                  {
                                    backgroundColor: "#fff",
                                  },
                                  ".css-1mw4zdz-MuiButtonBase-root-MuiSwitch-switchBase.Mui-checked":
                                  {
                                    backgroundColor: "#fff",
                                  },
                                  ".css-1mw4zdz-MuiButtonBase-root-MuiSwitch-switchBase":
                                  {
                                    color: "#fffff",
                                  },
                                }}
                              />
                            </Box>
                          </StyledTableCell> */}

                          {/* <StyledTableCell>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                borderRadius: "8px",
                                border: "1px solid #ccc",

                                height: "35px",
                                width: "max-content",
                              }}
                            >
                              <IconButton
                                onClick={() => handleDeleteClick(row.user_id)}
                              >
                                <img
                                  src={DeleteIcon}
                                  alt="delete icon"
                                  size="small"
                                />
                              </IconButton>
                            </Box>
                          </StyledTableCell> */}

                          {/* <StyledTableCell>
                            <Box
                              onClick={() => {
                                // router.push("/home/editSubadmin", {
                                //   state: { id: row._id },
                                // });
                              }}
                            >
                              <ArrowForwardIosSharpIcon fontSize="small" />
                            </Box>
                          </StyledTableCell> */}
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
