"use client";

import * as React from "react";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { truncateAddress } from "@/utils/truncateAddress";
import { CopyIcon, KeyIcon } from "lucide-react";
import { toast } from "sonner";
import { truncateMessage } from "@/utils/truncateMessage";

export function DelegateAddressTable({ data, delegate }) {
  const columns = [
    {
      accessorKey: "address",
      header: () => "Delegated Addresses",
      cell: ({ row }) => (
        <>
          {row.getValue("address") ? (
            <div className="lowercase flex items-center gap-2">
              <p className="text-primary">{truncateAddress(row.getValue("address"), 4, 4)}</p>
              {/* <div
                className="w-6"
                onClick={() => {
                  try {
                    navigator.clipboard.writeText(`${row.getValue("address")}`);
                    toast.success("Copied to clipboard");
                  } catch (error) {
                    console.log(error);
                    toast.error("Error copying to clipboard");
                  }
                }}
              >
                <CopyIcon className="w-3 hover:w-4 cursor-pointer transition-all duration-300 ease-in-out" />
              </div> */}
            </div>
          ) : (
            "--"
          )}
        </>
      ),
    },
    {
      accessorKey: "delegate",
      header: () => "",
      cell: ({ row }) => {
        return (
          <>
            <div
              className="cursor-pointer flex items-center justify-end"
              onClick={() => console.log(row.original.address)}
            >
              {/* <KeyIcon className="w-4 rotate-90" /> */}
              <Button
                variant="outline"
                size="sm"
                className="bg-[#EEEEEE]"
                onClick={() => delegate("revoke", row.original.address)}
              >
                Revoke
              </Button>
            </div>
          </>
        );
      },
    },
  ];

  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="rounded-2xl overflow-hidden">
        <Table>
          <TableHeader className="bg-white hover:bg-white">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-white">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="px-6 py-6">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="bg-white">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="border-none"
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-6">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="w-full bg-transparent">
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center w-full"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div> */}
    </div>
  );
}
