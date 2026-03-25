// components/Table.js
import React from "react";
import {
  Table as MuiTable,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  TablePagination,
} from "@mui/material";

const Table = ({
  columns,
  children,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  hasNextPage,
  count,
  showPagination = true,
  isOfferTable = false, // New prop for Offers table
}) => {
  return (
    <>
      {/* Table */}
      <TableContainer>
        <MuiTable>
          <TableHead>
            <TableRow>
              {columns.map((column, index) => (
                <TableCell
                  key={index}
                  sx={{
                    fontWeight: "600",
                    bgcolor: "grey.100",
                    padding: "8px",
                    textTransform: "capitalize",
                    textAlign: 
                      isOfferTable && column.toLowerCase() === "image" ? "left" :
                      isOfferTable && column.toLowerCase() === "actions" ? "right" :
                      "inherit"
                  }}
                >
                  {column}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          {children}
        </MuiTable>
      </TableContainer>
      
      {/* Pagination */}
      {showPagination && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={count}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
          nextIconButtonProps={{
            disabled: !hasNextPage,
          }}
        />
      )}
    </>
  );
};

export default Table;