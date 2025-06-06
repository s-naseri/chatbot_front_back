import React, { useState } from "react";
import {
  Tabs,
  Tab,
  Box,
  TextField,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  createTheme,
  ThemeProvider,
  CssBaseline,
} from "@mui/material";
import UserCreateForm from "./UserCreateForm";
import UserTransactions from "./UserTransactions";
import ColleaguesManagement from "./ColleaguesManagement";
import SubsetsManagement from "./SubsetsManagement";
import RequestsManagement from "./RequestsManagement";
import UserDetailsModal from "./UserDetailsModal";

// تعریف تم با فونت IRANYekanX
const theme = createTheme({
  typography: {
    fontFamily: "'IRANYekanX', 'Yekan', 'Vazir', sans-serif",
  },
  direction: "rtl",
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: 'IRANYekanX';
          font-style: normal;
          font-weight: 400;
          font-display: swap;
          src: local('IRANYekanX Regular'),
               url('/fonts/IRANYekanX-Regular.woff2') format('woff2'),
               url('/fonts/IRANYekanX-Regular.woff') format('woff');
        }
        @font-face {
          font-family: 'IRANYekanX';
          font-style: normal;
          font-weight: 700;
          font-display: swap;
          src: local('IRANYekanX Bold'),
               url('/fonts/IRANYekanX-Bold.woff2') format('woff2'),
               url('/fonts/IRANYekanX-Bold.woff') format('woff');
        }
        body {
          font-family: 'IRANYekanX', sans-serif !important;
          direction: rtl;
        }
      `,
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: "'IRANYekanX', sans-serif !important",
          fontWeight: 'normal',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontFamily: "'IRANYekanX', sans-serif !important",
          fontWeight: 'normal !important',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          fontFamily: "'IRANYekanX', sans-serif !important",
          '& .MuiInputBase-input': {
            fontFamily: "'IRANYekanX', sans-serif !important",
          },
          '& .MuiInputLabel-root': {
            fontFamily: "'IRANYekanX', sans-serif !important",
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontFamily: "'IRANYekanX', sans-serif !important",
        },
        head: {
          fontWeight: 'bold !important',
          fontFamily: "'IRANYekanX', sans-serif !important",
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: "'IRANYekanX', sans-serif !important",
        },
      },
    },
  },
});

export default function UsersManagement({
  users,
  transactions = [],
  onToggleActive,
  onShowDetails,
  onAddUser,
}) {
  const [tabIndex, setTabIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  const filteredUsers = users.filter((user) =>
    [user.fullName, user.mobile, user.city, user.username].some((field) =>
      field?.toLowerCase()?.includes(searchTerm?.toLowerCase() || '')
    )
  );

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleShowDetails = (user) => {
    setSelectedUser(user);
  };

  const handleCloseModal = () => setSelectedUser(null);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          bgcolor: "#fff",
          borderRadius: 2,
          p: 3,
          boxShadow: "0 2px 8px rgba(113,111,243,0.07)",
          direction: "rtl",
          fontFamily: "'IRANYekanX', sans-serif !important",
          '& *': {
            fontFamily: "'IRANYekanX', sans-serif !important",
          },
        }}
      >
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          aria-label="تب‌های مدیریت کاربران"
          sx={{ mb: 3 }}
        >
          <Tab label="ایجاد کاربر جدید" />
          <Tab label="مدیریت کاربران" />
          <Tab label="تراکنشات کاربران" />
          <Tab label="مدیریت همکاران" />
          <Tab label="مدیریت زیرمجموعه‌ها" />
          <Tab label="مشاهده درخواست‌ها" />
        </Tabs>

        {tabIndex === 0 && <UserCreateForm onSubmit={onAddUser} />}

        {tabIndex === 1 && (
          <>
            <TextField
              label="جستجو بر اساس نام، شماره، شهر یا شناسه"
              variant="outlined"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ mb: 2 }}
            />

            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>نام کامل</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>نام کاربری</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>ایمیل</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>شماره موبایل</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>شهر</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>وضعیت</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>عملیات</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.fullName}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.mobile}</TableCell>
                    <TableCell>{user.city}</TableCell>
                    <TableCell>
                      <Button
                        variant={user.active ? "contained" : "outlined"}
                        color={user.active ? "success" : "error"}
                        onClick={() => onToggleActive(user.id)}
                        sx={{ fontFamily: "'IRANYekanX', sans-serif !important" }}
                      >
                        {user.active ? "فعال" : "غیرفعال"}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="outlined" 
                        onClick={() => handleShowDetails(user)}
                        sx={{ fontFamily: "'IRANYekanX', sans-serif !important" }}
                      >
                        جزئیات
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <UserDetailsModal
              open={!!selectedUser}
              user={selectedUser}
              onClose={handleCloseModal}
            />
          </>
        )}

        {tabIndex === 2 && <UserTransactions transactions={transactions} />}

        {tabIndex === 3 && <ColleaguesManagement />}

        {tabIndex === 4 && <SubsetsManagement />}

        {tabIndex === 5 && <RequestsManagement />}
      </Box>
    </ThemeProvider>
  );
}
