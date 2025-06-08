'use client'
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
// import Swal from "sweetalert2";
import Button from "@mui/material/Button";
import {
    Paper,
    Stack,
    Tab,
    Typography,
    Grid,
    IconButton,
    TextField,
    Checkbox,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    InputAdornment,
    Alert,
    CircularProgress,
} from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";


import personalinfo from "../../../assets/personalinfo.svg";
import assignRoles from "../../../assets/assignRoles.svg";
import success from "../../../assets/success.svg";

import { addUsers } from "../../../lib/api";
import FormButtons from "./FormButton";


export default function AddSubadminForm() {
    const router = useRouter();
    const [value, setValue] = useState("1");
    const [AllModules, setGetAllModules] = useState();
    const [accessLevels, setAccessLevels] = useState({});
    const [selectedButtons, setSelectedButtons] = useState({});
    const [isAccessLevelSelected, setIsAccessLevelSelected] = useState(false);
    const [validationMessage, setValidationMessage] = useState("");
    const [roleType, setRoleType] = useState("");
    const [roleValidationMessage, setRoleValidationMessage] = useState("");
    const [personalInfo, setPersonalInfo] = useState({
        username: "",
        password: "",
        mother_id: "",
    });
    const [profilePicture, setProfilePicture] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleProfilePictureUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Update personalInfo with the file
            setPersonalInfo((prevDetails) => ({
                ...prevDetails,
                admn_img: file,
            }));

            const reader = new FileReader();
            reader.onload = () => {

                setProfilePicture(reader.result); // Store the data URL
            };
            reader.readAsDataURL(file);
        } else {
            console.log("No file selected");
        }
    };



    const handleAccessChange = (event) => {
        const updatedAccessLevels = {
            ...accessLevels,
            [event.target.name]: event.target.checked,
        };
        setAccessLevels(updatedAccessLevels);
        const anySelected = Object.values(updatedAccessLevels).includes(true);
        setIsAccessLevelSelected(anySelected);
        if (anySelected) {
            setValidationMessage("");
        }
    };

    const handleButtonClick = (label, button) => {
        setSelectedButtons((prevState) => ({
            ...prevState,
            [label]: button,
        }));
    };

    const AccessRow = ({ label }) => {
        const selectedButton = selectedButtons[label] || null;

        return (
            <Box
                key={label}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "10px",
                    border: "1px solid #1e1e1e",
                    borderRadius: "8px",
                    padding: "15.5px 15px 15.5px 19px",
                    justifyContent: "flex-end",
                    flex: "1 0 0",
                    width: "100%",
                }}
            >
                <CustomCheckbox
                    name={label}
                    checked={accessLevels[label]}
                    onChange={handleAccessChange}
                />
                <Typography
                    sx={{
                        flex: 1,
                        fontFamily: "Poppins",
                        fontSize: "16px",
                        fontWeight: 400,
                        color: "#060505",
                    }}
                >
                    {label}
                </Typography>
                <Box sx={{ display: "flex", gap: "10px" }}>
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={
                            <img
                                // src={view}
                                alt="Read"
                                style={{ width: "24px", height: "24px" }}
                            />
                        }
                        sx={{
                            textTransform: "none",
                            padding: "10px",
                            borderRadius: "11px",
                            border:
                                selectedButton === "read"
                                    ? "1px solid #10B771"
                                    : "1px solid #959595",
                            color: selectedButton === "read" ? "#1e1e1e" : "#1e1e1e",
                            fontSize: "16px",
                            fontWeight: 400,
                            fontFamily: "Poppins",
                            backgroundColor:
                                selectedButton === "read"
                                    ? "rgba(72, 255, 136, 0.1)"
                                    : "transparent",
                            "& img": {
                                filter:
                                    selectedButton === "read"
                                        ? "invert(50%) sepia(100%) saturate(5000%) hue-rotate(130deg) brightness(90%) contrast(95%)"
                                        : "none",
                            },
                            "&:hover": {
                                border: '1px solid #10B771',
                                backgroundColor: "rgba(72, 255, 173, 0.1)",
                                color: selectedButton === "read" ? "#1e1e1e" : "#10B771",
                                "& img": {
                                    filter:
                                        "invert(50%) sepia(100%) saturate(5000%) hue-rotate(130deg) brightness(90%) contrast(95%)",
                                },
                            },
                        }}
                        onClick={() => handleButtonClick(label, "read")}
                    >
                        Read
                    </Button>
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={
                            <Box className="icon-hover">
                                <img
                                    //   src={edit}
                                    alt="Write"
                                    style={{ width: "24px", height: "24px" }}
                                />
                            </Box>
                        }
                        sx={{
                            textTransform: "none",
                            padding: "10px",
                            borderRadius: "11px",
                            border:
                                selectedButton === "write"
                                    ? "1px solid #10B771"
                                    : "1px solid #959595",
                            color: selectedButton === "write" ? "#1e1e1e" : "#1e1e1e",
                            fontSize: "16px",
                            fontWeight: 400,
                            fontFamily: "Poppins",
                            backgroundColor:
                                selectedButton === "write"
                                    ? "rgba(72, 255, 160, 0.1)"
                                    : "transparent",
                            "& img": {
                                filter:
                                    selectedButton === "write"
                                        ? "invert(50%) sepia(100%) saturate(5000%) hue-rotate(130deg) brightness(90%) contrast(95%)"
                                        : "none",
                            },
                            "&:hover": {
                                backgroundColor: "rgba(72, 255, 182, 0.1)",
                                border: '1px solid #10B771',
                                color: selectedButton === "write" ? "#1e1e1e" : "#10B771",
                                "& img": {
                                    filter:
                                        "invert(50%) sepia(100%) saturate(5000%) hue-rotate(130deg) brightness(90%) contrast(95%)",
                                },
                            },
                        }}
                        onClick={() => handleButtonClick(label, "write")}
                    >
                        Write
                    </Button>
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={
                            <img
                                // src={noAccess}
                                alt="No Access"
                                style={{ width: "24px", height: "24px" }}
                            />
                        }
                        sx={{
                            textTransform: "none",
                            padding: "10px",
                            borderRadius: "11px",
                            border:
                                selectedButton === "allaccess"
                                    ? "1px solid #10B771"
                                    : "1px solid #959595",
                            color: selectedButton === "allaccess" ? "#1e1e1e" : "#1e1e1e",
                            fontSize: "16px",
                            fontWeight: 400,
                            fontFamily: "Poppins",
                            backgroundColor:
                                selectedButton === "allaccess"
                                    ? "rgba(72, 255, 115, 0.1)"
                                    : "transparent",
                            "& img": {
                                filter:
                                    selectedButton === "allaccess"
                                        ? "invert(50%) sepia(100%) saturate(5000%) hue-rotate(130deg) brightness(90%) contrast(95%)"
                                        : "none",
                            },
                            "&:hover": {
                                border: '1px solid #10B771',
                                backgroundColor: "rgba(72, 255, 163, 0.1)",
                                color: selectedButton === "allaccess" ? "#1e1e1e" : "#10B771",
                                "& img": {
                                    filter:
                                        "invert(50%) sepia(100%) saturate(5000%) hue-rotate(130deg) brightness(90%) contrast(95%)",
                                },
                            },
                        }}
                        onClick={() => handleButtonClick(label, "allaccess")}
                    >
                        All Access
                    </Button>
                </Box>
            </Box>
        );
    };

    const AccessControl = () => {
        return (
            <Box>
                {AllModules?.map((module) => (
                    <AccessRow key={module._id} label={module.title} />
                ))}
            </Box>
        );
    };



    const finalSubmission = async () => {
        setIsLoading(true);
        const formData = new FormData();
        formData.append("username", personalInfo.username);
        formData.append("password", personalInfo.password);
        formData.append("mother_id", personalInfo.mother_id);
        formData.append("role_id", roleType);

        try {
            const data = await addUsers(formData);
            const response = data.response
            if (response.user_id) {
                setSuccessMessage(response.message || "User created successfully");
                setTimeout(() => {
                    router.push("/users");
                }, 2000);
            }
        } catch (error) {
            console.log(error)
            setErrorMessage(error.detail || "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (event, newValue) => {
        if (["1", "2", "3", "4"].includes(newValue)) {
            setValue(newValue);
        }
    };

    const iconStyles = (index) => ({
        filter: value === String(index + 1) ? "brightness(0) saturate(100%) invert(51%) sepia(83%) saturate(362%) hue-rotate(86deg) brightness(93%) contrast(98%)" : "brightness(0) saturate(100%) invert(0%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(0%) contrast(100%)",
    });

    const validationSchema = Yup.object().shape({
        username: Yup.string().required("User Name is required"),
        password: Yup.string().required("Password is required"),
        mother_id: Yup.string().optional()
    });

    const clearProfilePicture = () => {
        setProfilePicture(null);
    };

    const handleReset = (resetForm) => {
        if (value === "1") {
            clearProfilePicture();
            resetForm();
            setPersonalInfo({
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                // admn_img: null,
            });
        } else if (value === "2") {
            setAccessLevels({});
            setSelectedButtons({});
            setIsAccessLevelSelected(false);
            setValidationMessage("");
        } else if (value === "3") {
            setRoleType("");
            setRoleValidationMessage("");
        }
    };

    const handleNext = async (submitForm, validateForm) => {
        // const errors = await validateForm();
        // console.log(errors)
        // if (Object.keys(errors).length === 0) {
        //     submitForm();
        //     setValue("2");
        // }
        submitForm();
        setValue("2");
    };

    const handleAccessNext = async () => {
        if (isAccessLevelSelected) {
            setValue("3");
        } else {
            setValidationMessage("Please select an access level.");
        }
    };
    const handleRoleChange = (event) => {
        setRoleType(event.target.value);
        setRoleValidationMessage("");
    };

    const handleRoleNext = () => {
        if (roleType) {
            setValue("2");
        } else {
            setRoleValidationMessage("Please select a role.");
        }
    };
    const CustomRadio = styled(Radio)(({ theme }) => ({
        "&.Mui-checked": {
            color: "#10B771",
        },
    }));
    const CustomCheckbox = styled(Checkbox)(({ theme }) => ({
        "&.Mui-checked": {
            color: "#10B771",
        },
    }));

    return (
        <Box
            sx={{
                width: "100%",
                height: "85px",
                borderRadius: "12px",
                backgroundColor: "#FFF",
                position: "relative"
            }}
        >
            {errorMessage && (
                <Alert 
                    severity="error" 
                    sx={{ 
                        position: "fixed",
                        top: "20px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        zIndex: 9999,
                        minWidth: "300px",
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)"
                    }}
                >
                    {errorMessage}
                </Alert>
            )}
            {successMessage && (
                <Alert 
                    severity="success" 
                    sx={{ 
                        position: "fixed",
                        top: "20px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        zIndex: 9999,
                        minWidth: "300px",
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)"
                    }}
                >
                    {successMessage}
                </Alert>
            )}
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
                    <Typography
                        sx={{
                            height: "30px",
                            flexShrink: 0,
                            borderRadius: "8px",
                            display: "flex",
                            alignItems: "center",
                            fontFamily: "Poppins",
                            fontSize: "18px",
                            fontWeight: 600,
                            lineHeight: "20px",
                            color: "#05004E",
                        }}
                    >
                        Add New Member
                    </Typography>
                    <TextField
                        placeholder="Search by first name"
                        // value={searchQuery}
                        // onChange={(e) => setSearchQuery(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    {/* <SearchIcon /> */}
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            width: "300px",
                            visibility: 'hidden',
                            p: 0,
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
                    <Button
                        sx={{
                            "&.my-button-container .MuiButton-root": {
                                display: "inline-flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "40px",
                                paddingX: '10px',
                            },
                            backgroundColor: "#ff0011",
                            "&:hover": {
                                backgroundColor: "#ff0011",
                            },
                        }}
                        variant="contained"
                        onClick={() => {
                            router.push("/users");
                        }}
                    >
                        <Typography
                            sx={{
                                fontFamily: "Nunito Sans",
                                fontSize: "16px",
                                fontWeight: 700,
                                lineHeight: "27px",
                            }}
                        >
                            Exit
                        </Typography>
                    </Button>
                </Box>

                <Stack>
                    <Paper
                        sx={{
                            backgroundColor: "#fff",
                            borderRadius: "8px 8px 0px 0px",
                        }}
                    >

                        <TabContext value={value}>
                            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                                <TabList onChange={handleChange} aria-label="navigation tabs" sx={{
                                    "& .MuiTabs-indicator": {
                                        backgroundColor: "#10B771",
                                    },
                                }} >
                                    {[
                                        // { label: "Manage Access", icon: 'manageAccess' },
                                        { label: "Assign Roles", icon: assignRoles },
                                        { label: "Personal Information", icon: personalinfo },
                                        { label: "Success", icon: success },
                                    ]?.map((tab, index) => (
                                        <Tab
                                            key={index}
                                            // icon={
                                            //     <img
                                            //         src={tab.icon}
                                            //         alt={tab.label}
                                            //         style={iconStyles(index)}
                                            //     />
                                            // }
                                            iconPosition="start"
                                            label={
                                                <span
                                                    style={{
                                                        color: '#1e1e1e',
                                                        // color: value === String(index + 1) ? "#10B771" : "#16151C",
                                                        fontWeight: value === String(index + 1) ? 600 : 500,
                                                        fontFamily: "General Sans",
                                                        fontSize: "16px",
                                                        fontStyle: "normal",
                                                        lineHeight: "24px",
                                                    }}
                                                >
                                                    {tab.label}
                                                </span>
                                            }
                                            value={String(index + 1)}
                                            sx={{
                                                color: value === String(index + 1) ? "#10B771" : "#1e1e1e",
                                            }}
                                            TouchRippleProps={{
                                                sx: {
                                                    "& .MuiTouchRipple-child": {
                                                        backgroundColor: "#10B771",
                                                    },
                                                },
                                            }}
                                        />
                                    ))}
                                </TabList>
                            </Box>
                            <Box
                                sx={{
                                    width: "100%",
                                    display: "flex",
                                    justifyContent: "center",
                                }}
                            >
                                <Paper sx={{ padding: "2%", width: "95%" }}>
                                    <TabPanel value="2">
                                        <Formik
                                            initialValues={personalInfo}
                                            validationSchema={validationSchema}
                                            onSubmit={(values) => {
                                                console.log(values)
                                                setPersonalInfo((prevDetails) => ({
                                                    ...prevDetails,
                                                    ...values,
                                                }));
                                                setValue("3");
                                            }}
                                        >
                                            {({
                                                errors,
                                                touched,
                                                resetForm,
                                                submitForm,
                                                setFieldValue,
                                                validateForm,
                                            }) => (
                                                <Form>
                                                    <Box mt={2}>
                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12} md={6}>
                                                                <Field
                                                                    as={TextField}
                                                                    label="User Name"
                                                                    name="username"
                                                                    variant="outlined"
                                                                    fullWidth
                                                                    error={
                                                                        touched.username && Boolean(errors.username)
                                                                    }
                                                                    helperText={<ErrorMessage name="firstName" />}
                                                                    value={personalInfo.username}
                                                                    onChange={(e) => {
                                                                        setFieldValue("username", e.target.value);
                                                                        setPersonalInfo((prevDetails) => ({
                                                                            ...prevDetails,
                                                                            username: e.target.value,
                                                                        }));
                                                                    }}
                                                                    sx={{
                                                                        "& label.Mui-focused": {
                                                                            color: "#10B771",
                                                                        },
                                                                        "& .MuiOutlinedInput-root": {
                                                                            "& fieldset": {
                                                                                borderColor: "#1e1e1e",
                                                                            },
                                                                            "&:hover fieldset": {
                                                                                borderColor: "#10B771",
                                                                            },
                                                                            "&.Mui-focused fieldset": {
                                                                                borderColor: "#10B771",
                                                                            },
                                                                        },
                                                                    }}
                                                                />
                                                            </Grid>
                                                            <Grid item xs={12} md={6}>
                                                                <Field
                                                                    as={TextField}
                                                                    label="Password"
                                                                    name="password"
                                                                    variant="outlined"
                                                                    fullWidth
                                                                    error={
                                                                        touched.password && Boolean(errors.password)
                                                                    }
                                                                    helperText={<ErrorMessage name="lastName" />}
                                                                    value={personalInfo.password}
                                                                    onChange={(e) => {
                                                                        setFieldValue("password", e.target.value);
                                                                        setPersonalInfo((prevDetails) => ({
                                                                            ...prevDetails,
                                                                            password: e.target.value,
                                                                        }));
                                                                    }}
                                                                    sx={{
                                                                        "& label.Mui-focused": {
                                                                            color: "#10B771",
                                                                        },
                                                                        "& .MuiOutlinedInput-root": {
                                                                            "& fieldset": {
                                                                                borderColor: "#1e1e1e",
                                                                            },
                                                                            "&:hover fieldset": {
                                                                                borderColor: "#10B771",
                                                                            },
                                                                            "&.Mui-focused fieldset": {
                                                                                borderColor: "#10B771",
                                                                            },
                                                                        },
                                                                    }}
                                                                />
                                                            </Grid>
                                                            {roleType === "2" && (
                                                                <Grid item xs={12} md={6}>
                                                                    <Field
                                                                        as={TextField}
                                                                        label="Patient Id"
                                                                        name="mother_id"
                                                                        variant="outlined"
                                                                        fullWidth
                                                                        inputProps={{ maxLength: 10 }}
                                                                        error={touched.mother_id && Boolean(errors.mother_id)}
                                                                        helperText={<ErrorMessage name="mother_id" />}
                                                                        value={personalInfo.mother_id}
                                                                        onChange={(e) => {
                                                                            setFieldValue("mother_id", e.target.value);
                                                                            setPersonalInfo((prevDetails) => ({
                                                                                ...prevDetails,
                                                                                mother_id: e.target.value,
                                                                            }));
                                                                        }}
                                                                        sx={{
                                                                            "& label.Mui-focused": {
                                                                                color: "#10B771",
                                                                            },
                                                                            "& .MuiOutlinedInput-root": {
                                                                                "& fieldset": {
                                                                                    borderColor: "#1e1e1e",
                                                                                },
                                                                                "&:hover fieldset": {
                                                                                    borderColor: "#10B771",
                                                                                },
                                                                                "&.Mui-focused fieldset": {
                                                                                    borderColor: "#10B771",
                                                                                },
                                                                            },
                                                                        }}
                                                                    />
                                                                </Grid>
                                                            )}
                                                        </Grid>
                                                        <FormButtons
                                                            onReset={() => handleReset(resetForm)}
                                                            onSubmit={() => {
                                                                handleNext(submitForm, validateForm);
                                                            }}
                                                            disabled={isLoading}
                                                        />
                                                    </Box>
                                                </Form>
                                            )}
                                        </Formik>
                                    </TabPanel>
                                    <TabPanel value="1">
                                        <FormControl component="fieldset" sx={{ width: "100%" }}>
                                            <RadioGroup
                                                row
                                                aria-label="role"
                                                name="role"
                                                value={roleType}
                                                onChange={handleRoleChange}
                                                sx={{
                                                    color: "#9D9B9B",
                                                    width: "100%",
                                                    justifyContent: "space-between",
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        border:
                                                            roleType === "2"
                                                                ? "1px solid #1e1e1e"
                                                                : "1px solid var(--Outline-stroke, #9D9B9B)",
                                                        borderRadius: "10px",
                                                        padding: "16px 0px 16px 19px",
                                                        marginRight: "10px",
                                                        display: "flex",
                                                        justifyContent: "flex-start",
                                                        alignItems: "center",
                                                        flex: "0 1 calc(50% - 10px)",
                                                        "@media (max-width: 600px)": {
                                                            flex: "0 1 100%",
                                                            marginBottom: "10px",
                                                        },
                                                    }}
                                                >
                                                    <FormControlLabel
                                                        value="2"
                                                        control={<CustomRadio />}
                                                        label="Patient"
                                                        sx={{
                                                            "& .MuiTypography-root": {
                                                                color: roleType === "2" ? "#1e1e1e000" : "#9D9B9B",
                                                                fontFamily: "Poppins",
                                                                fontWeight: 400,
                                                                fontSize: "16px",
                                                            },
                                                        }}
                                                    />
                                                </Box>
                                                <Box
                                                    sx={{
                                                        border:
                                                            roleType === "3"
                                                                ? "1px solid #1e1e1e;"
                                                                : "1px solid var(--Outline-stroke, #9D9B9B)",
                                                        borderRadius: "10px",
                                                        padding: "16px 0px 16px 19px",
                                                        display: "flex",
                                                        justifyContent: "flex-start",
                                                        alignItems: "center",
                                                        flex: "0 1 calc(50% - 10px)",
                                                        "@media (max-width: 600px)": {
                                                            flex: "0 1 100%",
                                                        },
                                                    }}
                                                >
                                                    <FormControlLabel
                                                        value="3"
                                                        control={<CustomRadio />}
                                                        label="Doctor"
                                                        sx={{
                                                            "& .MuiTypography-root": {
                                                                color: roleType === "3" ? "#1e1e1e000" : "#9D9B9B",
                                                                fontFamily: "Poppins",
                                                                fontWeight: 400,
                                                                fontSize: "16px",
                                                            },
                                                        }}
                                                    />
                                                </Box>
                                            </RadioGroup>
                                            {roleValidationMessage && (
                                                <Typography sx={{ color: "red", mt: 2 }}>
                                                    {roleValidationMessage}
                                                </Typography>
                                            )}
                                        </FormControl>
                                        <FormButtons
                                            onReset={() => handleReset(() => setRoleType(""))}
                                            onSubmit={handleRoleNext}
                                        />
                                    </TabPanel>

                                    <TabPanel value="3">
                                        <Box
                                            display="flex"
                                            alignItems="center"
                                            flexDirection="column"
                                            mb={4}
                                        >
                                            {profilePicture && (
                                                <img
                                                    src={profilePicture}
                                                    alt="Profile"
                                                    style={{
                                                        width: "100px",
                                                        height: "100px",
                                                        borderRadius: "50%",
                                                        marginBottom: "20px",
                                                    }}
                                                />
                                            )}
                                            <Grid container spacing={2}>
                                                <Grid item xs={12} md={6}>
                                                    <TextField
                                                        label="User Name"
                                                        variant="outlined"
                                                        fullWidth
                                                        value={personalInfo.username}
                                                        InputProps={{
                                                            readOnly: true,
                                                        }}
                                                        sx={{
                                                            "& label.Mui-focused": {
                                                                color: "#10B771",
                                                            },
                                                            "& .MuiOutlinedInput-root": {
                                                                "& fieldset": {
                                                                    borderColor: "#1e1e1e",
                                                                },
                                                                "&:hover fieldset": {
                                                                    borderColor: "#10B771",
                                                                },
                                                                "&.Mui-focused fieldset": {
                                                                    borderColor: "#10B771",
                                                                },
                                                            },
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                    <TextField
                                                        label="Password"
                                                        variant="outlined"
                                                        fullWidth
                                                        value={personalInfo.password}
                                                        InputProps={{
                                                            readOnly: true,
                                                        }}
                                                        sx={{
                                                            "& label.Mui-focused": {
                                                                color: "#10B771",
                                                            },
                                                            "& .MuiOutlinedInput-root": {
                                                                "& fieldset": {
                                                                    borderColor: "#1e1e1e",
                                                                },
                                                                "&:hover fieldset": {
                                                                    borderColor: "#10B771",
                                                                },
                                                                "&.Mui-focused fieldset": {
                                                                    borderColor: "#10B771",
                                                                },
                                                            },
                                                        }}
                                                    />
                                                </Grid>
                                                {roleType === "2" && (
                                                    <Grid item xs={12} md={6}>
                                                        <TextField
                                                            label="Patient Id"
                                                            variant="outlined"
                                                            fullWidth
                                                            value={personalInfo.mother_id}
                                                            InputProps={{
                                                                readOnly: true,
                                                            }}
                                                            sx={{
                                                                "& label.Mui-focused": {
                                                                    color: "#10B771",
                                                                },
                                                                "& .MuiOutlinedInput-root": {
                                                                    "& fieldset": {
                                                                        borderColor: "#1e1e1e",
                                                                    },
                                                                    "&:hover fieldset": {
                                                                        borderColor: "#10B771",
                                                                    },
                                                                    "&.Mui-focused fieldset": {
                                                                        borderColor: "#10B771",
                                                                    },
                                                                },
                                                            }}
                                                        />
                                                    </Grid>
                                                )}
                                            </Grid>
                                        </Box>
                                        <Box mt={2}>
                                            {Object.keys(accessLevels)?.map((label) => (
                                                <AccessRow key={label} label={label} />
                                            ))}
                                        </Box>
                                        <Box mt={4}>
                                            {roleType === "2" && (
                                                <Box
                                                    sx={{
                                                        border: "1px solid #1e1e1e",
                                                        borderRadius: "10px",
                                                        padding: "16px 0px 16px 19px",
                                                        marginBottom: "10px",
                                                        display: "flex",
                                                        justifyContent: "flex-start",
                                                        alignItems: "center",
                                                    }}
                                                >
                                                    <FormControlLabel
                                                        value="2"
                                                        control={<CustomRadio checked />}
                                                        label="Pateint"
                                                        sx={{
                                                            "& .MuiTypography-root": {
                                                                color: "#1e1e1e000",
                                                                fontFamily: "Poppins",
                                                                fontWeight: 400,
                                                                fontSize: "16px",
                                                            },
                                                        }}
                                                    />
                                                </Box>
                                            )}
                                            {roleType === "3" && (
                                                <Box
                                                    sx={{
                                                        border: "1px solid #1e1e1e",
                                                        borderRadius: "10px",
                                                        padding: "16px 0px 16px 19px",
                                                        marginBottom: "10px",
                                                        display: "flex",
                                                        justifyContent: "flex-start",
                                                        alignItems: "center",
                                                    }}
                                                >
                                                    <FormControlLabel
                                                        value="3"
                                                        control={<CustomRadio checked />}
                                                        label="Doctor"
                                                        sx={{
                                                            "& .MuiTypography-root": {
                                                                color: "#1e1e1e000",
                                                                fontFamily: "Poppins",
                                                                fontWeight: 400,
                                                                fontSize: "16px",
                                                            },
                                                        }}
                                                    />
                                                </Box>
                                            )}
                                        </Box>
                                        <Box mt={4} display="flex" justifyContent="flex-end">
                                            <Button
                                                variant="outlined"
                                                sx={{
                                                    bgcolor: "#FFFFFF",
                                                    height: "50px",
                                                    borderRadius: "10px",
                                                    border: "1px solid var(--gray-gray-20, rgba(162, 161, 168, 0.20))",
                                                    padding: "20px",
                                                    gap: "10px",
                                                    "&:hover": {
                                                        bgcolor: "#10B771",
                                                        border: "1px solid var(--gray-gray-20, #10B771)",
                                                        "& .MuiTypography-root": {
                                                            color: "#FFFFFF",
                                                        },
                                                    },
                                                    mr: "20px",
                                                }}
                                                onClick={() => finalSubmission()}
                                                disabled={isLoading}
                                            >
                                                {isLoading ? (
                                                    <CircularProgress size={24} color="inherit" />
                                                ) : (
                                                    <Typography
                                                        sx={{
                                                            color: " var(--Dark-500, #16151C)",
                                                            fontFamily: "Poppins",
                                                            fontSize: "16px",
                                                            fontStyle: "normal",
                                                            fontWeight: 400,
                                                            lineHeight: "24px",
                                                        }}
                                                    >
                                                        Submit
                                                    </Typography>
                                                )}
                                            </Button>
                                        </Box>
                                    </TabPanel>
                                </Paper>
                            </Box>
                        </TabContext>
                    </Paper>
                </Stack>
            </Stack>
        </Box>
    );
}
