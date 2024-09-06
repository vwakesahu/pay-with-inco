"use client";

import * as React from "react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { truncateAddress } from "@/utils/truncateAddress";

export function AdminDataTable({ data, decryptBalance }) {
  const updateCountry = (address, countryCode) => {
    // Update the country for the given address in your state or database
    // This might involve an API call or updating local state
    console.log(`Updating country for ${address} to ${countryCode}`);
  };

  const columns = [
    {
      accessorKey: "address",
      header: () => "Addresses",
      cell: ({ row }) => (
        <>
          {row.getValue("address") ? (
            <div className="lowercase flex items-center gap-2">
              <p className="text-primary">
                {truncateAddress(row.getValue("address"), 4, 4)}
              </p>
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
      accessorKey: "country",
      header: () => "Associated Country",
      cell: ({ row }) => (
        <CountrySelect
          value={row.original.country}
          onChange={(value) => updateCountry(row.original.address, value)}
        />
      ),
    },
    {
      accessorKey: "decryptedBalance",
      header: () => "Decrypt Balance",
      cell: ({ row }) => {
        return (
          <>
            {console.log(row)}
            {row.getValue("decryptedBalance") ? (
              <p>{row.getValue("decryptedBalance")}</p>
            ) : (
              <Image src={"/icons/lock.svg"} width={16} height={16} />
            )}
          </>
        );
      },
    },
    {
      accessorKey: "index",
      header: () => "Sr. No.",
      cell: ({ row }) => {
        return (
          <>
            {row.getValue("decryptedBalance") ? (
              <></>
            ) : (
              <Button onClick={() => decryptBalance(row.original.address)}>
                Decrypt
              </Button>
            )}
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
      <div className="py-4"></div>
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
      <div className="flex items-center justify-end space-x-2 py-4">
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
      </div>
    </div>
  );
}

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const countries = [
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "FR", name: "France" },
  { code: "DE", name: "Germany" },
  { code: "IN", name: "India" },
  // Add more countries as needed
];

const CountrySelect = ({ value, onChange }) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a country" />
      </SelectTrigger>
      <SelectContent>
        {countries.map((country) => (
          <SelectItem key={country.code} value={country.code}>
            <div className="flex items-center">
              <img
                src={`https://flagsapi.com/${country.code}/flat/24.png`}
                alt={`${country.name} flag`}
                className="mr-2 h-4 w-6 object-cover"
              />
              {country.name}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
