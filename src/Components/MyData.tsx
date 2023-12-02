import {
  MRT_ColumnDef,
  MRT_PaginationState,
  MRT_RowSelectionState,
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import React, { useEffect } from "react";
import userData from "../Services/MyData";
import { useMemo, useState } from "react";
import Loader from "./Loader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditUser from "./EditUser";
import { createTheme, ThemeProvider, useTheme } from "@mui/material";

export const MyData = () => {
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editId, setEditId] = useState<string>("");
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);
  const [paginationModel, setPaginationModel] = useState<MRT_PaginationState>({
    pageSize: 10,
    pageIndex: 0,
  });
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});

  const globalTheme = useTheme();
  useEffect(() => {
    setLoading(true);
    const skip = paginationModel.pageIndex * paginationModel.pageSize;
    const limit = paginationModel.pageSize;
    const params = {
      skip: skip,
      limit: limit,
    };
    userData.getUsers(params).then((res: any) => {
      console.log(res);
      setData(res.users);
      setTotalRows(res.total);

      setLoading(false);
    });
  }, [paginationModel.pageIndex, paginationModel.pageSize]);
  
  const deleteUser = (id: any): void => {
    userData
      .deleteUser(id)
      .then((res) => toast.success(`User Deleted Successfully`));
  };

  const columns = useMemo(
    () => [
      {
        header: "User ID",
        accessorKey: "id",
        enableSorting: true,
      },
      {
        header: "First Name",
        accessorKey: "firstName",
        enableSorting: true,
      },
      {
        header: "Last Name",
        accessorKey: "lastName",
        enableSorting: true,
      },
      {
        header: "Gender",
        accessorKey: "gender",
        enableSorting: true,
        Cell: ({ cell }) => <span>{JSON.stringify(cell?.getValue())}</span>,
      },
      {
        header: "Age",
        accessorKey: "age",
        enableSorting: true,
        Cell: ({ cell }) => <span>{JSON.stringify(cell?.getValue())}</span>,
      },
      {
        header: "Email",
        accessorKey: "email",
        enableSorting: true,
      },
      {
        header: "Actions",
        id: "actions",

        Cell: ({ row }) => (
          <div className="flex gap-2">
            <button
              onClick={() => deleteUser(row.id)}
              className="shadow-md bg-blue-700 px-4 py-1.5 text-white rounded-md whitespace-nowrap"
            >
              Delete
            </button>
            <button
              onClick={() => {
                setShowUpdateModal(false);
                setShowModal(true);
                setEditId(row.original.id);
              }}
              className="shadow-md bg-blue-700 px-4 py-1.5 text-white rounded-md whitespace-nowrap"
            >
              Edit
            </button>
          </div>
        ),
        sortable: false,
      },
    ],
    []
  );
  const tableTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: globalTheme.palette.mode,
          primary: {
            main: "#000",
          },
          info: {
            main: "#3b82f6",
          },
          background: {
            default: globalTheme.palette.mode === "light" ? "#fff" : "#000",
          },
        },
        typography: {
          button: {
            textTransform: "none",
            fontSize: "1.2rem",
          },
        },
        components: {
          MuiTooltip: {
            styleOverrides: {
              tooltip: {
                fontSize: "1.1rem",
              },
            },
          },
          MuiSwitch: {
            styleOverrides: {
              thumb: {
                color: "pink",
              },
            },
          },
        },
      }),
    [globalTheme]
  );

  const table = useMaterialReactTable({
    columns,
    data: data,
    enableStickyHeader: true,
    manualPagination: true,
    enableStickyFooter: true,
    enableColumnResizing: true,
    enableRowSelection: true,
    enableColumnOrdering: true,
    enableColumnPinning: true,
    layoutMode: "grid",
    paginationDisplayMode: "pages",
    positionGlobalFilter: "left",
    onRowSelectionChange: setRowSelection,
    muiSearchTextFieldProps: {
      placeholder: "Search all users",
      sx: { minWidth: "300px" },
      variant: "outlined",
    },
    initialState: {
      columnPinning: { right: ["actions"] },
      showGlobalFilter: true,
    },
    onPaginationChange: setPaginationModel,
    rowCount: totalRows,
    state: { pagination: paginationModel, rowSelection },
  });

  const handleSearch = (text) => {
    if (text?.length > 1) {
      userData.searchUser(text).then((res: any) => {
        console.log(res);
        setData(res.users);
        setTotalRows(res.total);
      });
    }
  };

  console.log(Object.keys(rowSelection));
  const multipleDelete = () => {
    Object.keys(rowSelection).map((id) => {
      const userId:any = (parseInt(id) + 1).toString();
      userData.deleteUser(userId);
    });
  };

  return (
    <>
      <ToastContainer />
      {loading ? (
        <Loader />
      ) : (
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 my-10 mx-20">
          <div className="flex w-full flex-col justify-between mb-4 space-y-2 border-b pb-6">
            <div className="flex flex-col xl:flex-row gap-4 w-full">
              <div className="flex flex-col lg:flex-row justify-between gap-3">
                <div className="flex border p-2 rounded-sm h-fit flex-1 lg:mr-5 ">
                  <input
                    type="text"
                    placeholder="Search Users..."
                    value={searchText}
                    onChange={(e) => {
                      setSearchText(e.target.value);
                      handleSearch(e.target.value);
                    }}
                    className="w-full bg-transparent pl-9 pr-4 font-medium focus:outline-none xl:w-125"
                  />
                </div>
              </div>
            </div>

            <div className="max-w-full overflow-x-auto mt-2">
              <ThemeProvider theme={tableTheme}>
                <MaterialReactTable table={table} />
              </ThemeProvider>
            </div>
          </div>
          {Object.keys(rowSelection).length > 0 && (
            <button
              className="bg-blue-700 text-white active:bg-emerald-600 font-medium uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 col-span-2 ml-auto"
              type="submit"
              onClick={() => multipleDelete()}
            >
              Deleted Selected Users
            </button>
          )}
          {showModal && <EditUser id={editId} setShowModal={setShowModal} />}
        </div>
      )}
    </>
  );
};
