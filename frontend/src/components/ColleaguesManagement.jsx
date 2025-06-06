// components/ColleaguesManagement.jsx
import React, { useState } from "react";
import { TextField, Button, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";

export default function ColleaguesManagement() {
  const [colleagues, setColleagues] = useState([]);
  const [newColleague, setNewColleague] = useState({ name: "", username: "", password: "" });

  const handleAdd = () => {
    setColleagues([...colleagues, newColleague]);
    setNewColleague({ name: "", username: "", password: "" });
  };

  return (
    <div style={{ background: "#fff", padding: 24, borderRadius: 12, boxShadow: "0 2px 8px rgba(113,111,243,0.07)" }}>
      <h3 style={{ color: "#716ff3", marginBottom: 24 }}>مدیریت همکاران</h3>
      
      <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
        <TextField
          label="نام همکار"
          value={newColleague.name}
          onChange={(e) => setNewColleague({ ...newColleague, name: e.target.value })}
        />
        <TextField
          label="نام کاربری"
          value={newColleague.username}
          onChange={(e) => setNewColleague({ ...newColleague, username: e.target.value })}
        />
        <TextField
          label="رمز عبور"
          type="password"
          value={newColleague.password}
          onChange={(e) => setNewColleague({ ...newColleague, password: e.target.value })}
        />
        <Button variant="contained" onClick={handleAdd}>
          افزودن همکار
        </Button>
      </div>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>نام</TableCell>
            <TableCell>نام کاربری</TableCell>
            <TableCell>عملیات</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {colleagues.map((c, idx) => (
            <TableRow key={idx}>
              <TableCell>{c.name}</TableCell>
              <TableCell>{c.username}</TableCell>
              <TableCell>
                <Button color="error">حذف</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
