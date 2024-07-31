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
import { CopyIcon } from "lucide-react";
import { toast } from "sonner";
import { truncateMessage } from "@/utils/truncateMessage";

export const columns = [
  {
    accessorKey: "type",
    header: "Activity",
    cell: ({ row }) => (
      <div className="capitalize flex gap-2 items-center">
        {row.getValue("type") === "sent" ? (
          <Image src={`/icons/sent.svg`} width={20} height={20} />
        ) : (
          <Image src={`/icons/receive.svg`} width={20} height={20} />
        )}
        {row.getValue("type")}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="capitalize">
        <div className="flex items-center gap-4 ">
          <div
            className={`p-1.5 px-3 cursor-pointer flex items-center justify-center gap-2  bg-white rounded-full ${
              row.getValue("status") === "success" ? "bg-[#9FFFA2]" : ""
            }
            ${row.getValue("status") === "failed" ? "bg-[#FF9F9F]" : ""}
            `}
          >
            <p className={`w-[6rem] text-center }`}>{row.getValue("status")}</p>
          </div>
        </div>
      </div>
    ),
  },

  {
    accessorKey: "receiverAddress",
    header: () => "Addresses",
    cell: ({ row }) => (
      <>
        {row.getValue("receiverAddress") ? (
          <div className="lowercase flex items-center gap-2">
            <p>{truncateAddress(row.getValue("receiverAddress"), 4, 4)}</p>
            <div
              className="w-6"
              onClick={() => {
                try {
                  navigator.clipboard.writeText(
                    `${row.getValue("receiverAddress")}`
                  );
                  toast.success("Copied to clipboard");
                } catch (error) {
                  console.log(error);
                  toast.error("Error copying to clipboard");
                }
              }}
            >
              <CopyIcon className="w-3 hover:w-4 cursor-pointer transition-all duration-300 ease-in-out" />
            </div>
          </div>
        ) : (
          "--"
        )}
      </>
    ),
  },
  {
    accessorKey: "date",
    header: () => "Date",
    cell: ({ row }) => {
      const isoTimestamp = row.getValue("date");
      const date = new Date(isoTimestamp);

      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZoneName: "short",
      };

      const formattedDate = date.toLocaleDateString("en-US", options);

      return <div>{formattedDate}</div>;
    },
  },
  {
    accessorKey: "transactionHash",
    header: () => "Block Explorer",
    cell: ({ row }) => {
      const transactionHash = row.getValue("transactionHash");
      if (!transactionHash) {
        return <div>Not available</div>;
      } else {
        return (
          <a
            href={`https://explorer.testnet.inco.org/tx/${transactionHash}`}
            target="_blank"
            className="text-primary"
          >
            {truncateAddress(transactionHash, 4, 4)}
          </a>
        );
      }
    },
  },

  // {
  //   id: "actions",
  //   enableHiding: false,
  //   cell: ({ row }) => {
  //     const payment = row.original;
  //     console.log(row.original);

  //     return (
  //       <DropdownMenu>
  //         <DropdownMenuTrigger asChild>
  //           <Button variant="ghost" className="h-8 w-8 p-0">
  //             <span className="sr-only">Open menu</span>
  //             <DotsHorizontalIcon className="h-4 w-4" />
  //           </Button>
  //         </DropdownMenuTrigger>
  //         <DropdownMenuContent align="end">
  //           <DropdownMenuLabel>Actions</DropdownMenuLabel>
  //           <DropdownMenuItem
  //             onClick={() => {
  //               try {
  //                 navigator.clipboard.writeText(row.original.transactionHash);
  //                 toast.success("Copied to clipboard");
  //               } catch (error) {
  //                 console.log(error);
  //               }
  //             }}
  //           >
  //             Copy Transaction Hash
  //           </DropdownMenuItem>
  //           <DropdownMenuSeparator />
  //           <DropdownMenuItem>View customer</DropdownMenuItem>
  //           <DropdownMenuItem>View payment details</DropdownMenuItem>
  //         </DropdownMenuContent>
  //       </DropdownMenu>
  //     );
  //   },
  // },
];

export function DataTable({ data }) {
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
              <TableRow className='w-full bg-transparent'>
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
