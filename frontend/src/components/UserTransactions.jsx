import React from "react";
import { Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";

export default function UserTransactions({ transactions = [] }) {
  if (!transactions.length) {
    return <p>تراکنشی وجود ندارد.</p>;
  }

  return (
    <div>
      <h3 style={{ color: "#716ff3", marginBottom: 16 }}>تراکنشات کاربران</h3>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>تاریخ</TableCell>
            <TableCell>مبلغ (تومان)</TableCell>
            <TableCell>نوع تراکنش</TableCell>
            <TableCell>وضعیت</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.map(t => (
            <TableRow key={t.id}>
              <TableCell>{t.date}</TableCell>
              <TableCell>{t.amount}</TableCell>
              <TableCell>{t.type}</TableCell>
              <TableCell>{t.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
