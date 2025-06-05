import React, { useState } from "react";
import {
  TextField,
  Button,
  Grid,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  FormControl,
  Box,
  createTheme,
  ThemeProvider,
  Typography,
  Chip
} from "@mui/material";

// تعریف تم با فونت ایران یکان
const theme = createTheme({
  typography: {
    fontFamily: "'IRANYekanX', sans-serif",
    fontSize: 12,
  },
  direction: "rtl",
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-input': {
            fontSize: '0.875rem',
          },
          '& .MuiInputLabel-root': {
            fontSize: '0.875rem',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        label: {
          fontSize: '0.875rem',
        },
      },
    },
  },
});

const existingUsernames = ['user123', 'testuser', 'admin', 'user2023', 'demo'];

const labels = {
  firstName: "نام",
  lastName: "نام خانوادگی",
  userName: "نام کاربری",
  password: "کلمه عبور",
  repassword: "تکرار کلمه عبور",
  userType: "نوع کاربر",
  mobile: "تلفن همراه",
  idcode: "شماره شناسنامه",
  nationalitycode: "کد ملی",
  email: "ایمیل",
  adress: "آدرس",
  city: "شهر",
  companyname: "نام شرکت",
  registercode: "کد ثبت",
  economiccode: "کد اقتصادی",
};

export default function UserCreateForm({
  fieldWidth = 250,
  adressHeight = 80,
  spacing = 2,
}) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    password: "",
    repassword: "",
    userType: "حقیقی",
    mobile: "",
    idcode: "",
    nationalitycode: "",
    email: "",
    adress: "",
    city: "",
    companyname: "",
    registercode: "",
    economiccode: "",
  });

  const [usernameError, setUsernameError] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);

  const handleChange = (key) => (e) => {
    const value = e.target.value;
    setFormData({ ...formData, [key]: value });
    
    if (key === 'userName') {
      checkUsernameAvailability(value);
    }
  };

  const checkUsernameAvailability = (username) => {
    if (!username) {
      setUsernameError("");
      setSuggestions([]);
      return;
    }

    setIsCheckingUsername(true);
    
    setTimeout(() => {
      const isTaken = existingUsernames.includes(username.toLowerCase());
      
      if (isTaken) {
        setUsernameError("این نام کاربری موجود است. لطفاً نام دیگری انتخاب کنید.");
        generateSuggestions(username);
      } else {
        setUsernameError("");
        setSuggestions([]);
      }
      
      setIsCheckingUsername(false);
    }, 500);
  };

  const generateSuggestions = (username) => {
    const baseUsername = username.replace(/\d+$/, '');
    const newSuggestions = [];
    
    for (let i = 1; i <= 5; i++) {
      const suggestion = `${baseUsername}${Math.floor(Math.random() * 1000)}`;
      if (!existingUsernames.includes(suggestion)) {
        newSuggestions.push(suggestion);
      }
      
      if (newSuggestions.length >= 3) break;
    }
    
    setSuggestions(newSuggestions);
  };

  const selectSuggestion = (suggestion) => {
    setFormData({...formData, userName: suggestion});
    setUsernameError("");
    setSuggestions([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (usernameError) {
      alert("لطفاً نام کاربری معتبر انتخاب کنید");
      return;
    }
    
    if (formData.password !== formData.repassword) {
      alert("کلمه عبور و تکرار آن مطابقت ندارند.");
      return;
    }
    
    if (!formData.userName) {
      alert("لطفاً نام کاربری را وارد کنید");
      return;
    }

    alert("ثبت با موفقیت انجام شد!");
    setFormData({
      firstName: "",
      lastName: "",
      userName: "",
      password: "",
      repassword: "",
      userType: "حقیقی",
      mobile: "",
      idcode: "",
      nationalitycode: "",
      email: "",
      adress: "",
      city: "",
      companyname: "",
      registercode: "",
      economiccode: "",
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          backgroundColor: "#fff",
          padding: 4,
          borderRadius: 2,
          boxShadow: "0 2px 8px rgba(113,111,243,0.07)",
          maxWidth: 700,
          margin: "32px auto",
          direction: "rtl",
          fontFamily: "'IRANYekanX', sans-serif",
          fontSize: '0.875rem',
        }}
      >
        <Box
          sx={{
            background: "#2c3e50",
            color: "#fff",
            borderRadius: "8px 8px 0 0",
            px: 2,
            py: 1,
            mb: 3,
            fontSize: "1rem",
            textAlign: "center",
          }}
        >
          ایجاد کاربری
        </Box>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* ردیف 1 */}
            <Grid item xs={12} sm={6}>
              <TextField
                label={labels.firstName}
                value={formData.firstName}
                onChange={handleChange("firstName")}
                required
                sx={fieldStyle(fieldWidth)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label={labels.lastName}
                value={formData.lastName}
                onChange={handleChange("lastName")}
                required
                sx={fieldStyle(fieldWidth)}
                fullWidth
              />
            </Grid>

            {/* ردیف 2 - نام کاربری به تنهایی در ستون اول */}
            <Grid item xs={12} sm={6}>
              <TextField
                label={labels.userName}
                value={formData.userName}
                onChange={handleChange("userName")}
                required
                error={!!usernameError}
                helperText={usernameError}
                sx={fieldStyle(fieldWidth)}
                fullWidth
              />
              
              {suggestions.length > 0 && (
                <Box sx={{ mt: 1, mb: 1 }}>
                  <Typography variant="caption" color="textSecondary">
                    پیشنهادات:
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                    {suggestions.map((suggestion) => (
                      <Chip
                        key={suggestion}
                        label={suggestion}
                        size="small"
                        onClick={() => selectSuggestion(suggestion)}
                        sx={{ cursor: 'pointer' }}
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </Grid>
            {/* ستون دوم ردیف 2 خالی می‌ماند */}

            {/* ردیف 3 */}
            <Grid item xs={12} sm={6}>
              <TextField
                label={labels.password}
                type="password"
                value={formData.password}
                onChange={handleChange("password")}
                required
                sx={fieldStyle(fieldWidth)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label={labels.repassword}
                type="password"
                value={formData.repassword}
                onChange={handleChange("repassword")}
                required
                sx={fieldStyle(fieldWidth)}
                fullWidth
              />
            </Grid>

            {/* ردیف 4 */}
            <Grid item xs={12}>
              <FormControl sx={{ ...fieldStyle("100%"), maxWidth: '540px' }}>
                <FormLabel sx={{ fontSize: '0.875rem' }}>نوع کاربر</FormLabel>
                <RadioGroup
                  row
                  value={formData.userType}
                  onChange={handleChange("userType")}
                >
                  <FormControlLabel
                    value="حقیقی"
                    control={<Radio size="small" />}
                    label="حقیقی"
                  />
                  <FormControlLabel
                    value="حقوقی"
                    control={<Radio size="small" />}
                    label="حقوقی"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>

            {/* فیلدهای حقوقی */}
            {formData.userType === "حقوقی" && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label={labels.companyname}
                    value={formData.companyname}
                    onChange={handleChange("companyname")}
                    sx={fieldStyle(fieldWidth)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label={labels.registercode}
                    value={formData.registercode}
                    onChange={handleChange("registercode")}
                    sx={fieldStyle(fieldWidth)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label={labels.economiccode}
                    value={formData.economiccode}
                    onChange={handleChange("economiccode")}
                    sx={fieldStyle(fieldWidth)}
                    fullWidth
                  />
                </Grid>
              </>
            )}

            {/* ردیف 5 */}
            <Grid item xs={12} sm={6}>
              <TextField
                label={labels.mobile}
                value={formData.mobile}
                onChange={handleChange("mobile")}
                required
                sx={fieldStyle(fieldWidth)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label={labels.nationalitycode}
                value={formData.nationalitycode}
                onChange={handleChange("nationalitycode")}
                sx={fieldStyle(fieldWidth)}
                fullWidth
              />
            </Grid>

            {/* ردیف 6 */}
            <Grid item xs={12} sm={6}>
              <TextField
                label={labels.idcode}
                value={formData.idcode}
                onChange={handleChange("idcode")}
                sx={fieldStyle(fieldWidth)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label={labels.city}
                value={formData.city}
                onChange={handleChange("city")}
                sx={fieldStyle(fieldWidth)}
                fullWidth
              />
            </Grid>

            {/* ردیف 7 */}
            <Grid item xs={12} sm={6}>
              <TextField
                label={labels.email}
                value={formData.email}
                onChange={handleChange("email")}
                sx={fieldStyle(fieldWidth)}
                fullWidth
              />
            </Grid>

            {/* ردیف 8 - آدرس */}
            <Grid item xs={12}>
              <TextField
                label={labels.adress}
                value={formData.adress}
                onChange={handleChange("adress")}
                multiline
                minRows={3}
                sx={{
                  ...fieldStyle("100%"),
                  maxWidth: '540px',
                  width: "100%",
                  borderRadius: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                  },
                }}
                inputProps={{
                  style: { 
                    height: adressHeight, 
                    resize: "vertical",
                    fontSize: '0.875rem',
                  },
                }}
                fullWidth
              />
            </Grid>

            {/* دکمه ثبت */}
            <Grid item xs={12} sx={{ textAlign: "center", mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="error"
                size="medium"
                disabled={isCheckingUsername || !!usernameError}
                sx={{
                  background: "#2c3e50",
                  borderRadius: 2,
                  px: 6,
                }}
              >
                {isCheckingUsername ? "در حال بررسی..." : "ثبت"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </ThemeProvider>
  );
}

// استایل مشترک برای فیلدها
function fieldStyle(width) {
  return {
    width: width,
    minWidth: 180,
    borderRadius: 2,
    "& .MuiOutlinedInput-root": {
      borderRadius: 3,
      fontSize: '0.875rem',
    },
    "& .MuiInputLabel-root": {
      fontSize: '0.875rem',
    },
    background: "#fafafa",
  };
}