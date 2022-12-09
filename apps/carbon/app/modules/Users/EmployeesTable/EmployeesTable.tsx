import { ActionMenu, Table } from "@carbon/react";
import { Flex, MenuItem, VisuallyHidden } from "@chakra-ui/react";
import { useNavigate } from "@remix-run/react";
import { memo } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { IoMdTrash } from "react-icons/io";
import { usePermissions } from "~/hooks";
import type { Employee } from "../types";

type EmployeesTableProps = {
  data: Employee[];
};

const EmployeesTable = memo(({ data }: EmployeesTableProps) => {
  const navigate = useNavigate();
  const permissions = usePermissions();

  const rows = data.map(({ user, employeeType }) => {
    if (
      user === null ||
      employeeType === null ||
      Array.isArray(user) ||
      Array.isArray(employeeType)
    )
      throw new Error("Expected user and employee type to be objects");
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      employeeType: employeeType.name,
      actions: (
        <Flex justifyContent="end">
          {(permissions.can("update", "users") ||
            permissions.can("delete", "users")) && (
            <ActionMenu>
              <MenuItem icon={<BsPencilSquare />}>Edit Permissions</MenuItem>
              <MenuItem
                icon={<IoMdTrash />}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/app/users/employeess/deactivate/${user.id}`);
                }}
              >
                Deactivate Employee
              </MenuItem>
            </ActionMenu>
          )}
        </Flex>
      ),
    };
  });

  return (
    <Table
      rows={rows}
      columns={[
        {
          Header: "First Name",
          accessor: "firstName",
        },
        {
          Header: "Last Name",
          accessor: "lastName",
        },
        {
          Header: "Email",
          accessor: "email",
        },
        {
          Header: "Employee Type",
          accessor: "employeeType",
        },
        {
          Header: <VisuallyHidden>Actions</VisuallyHidden>,
          accessor: "actions",
        },
      ]}
      onRowClick={(row) => {
        navigate(`/app/users/employees/${row.id}`);
      }}
    />
  );
});

EmployeesTable.displayName = "EmployeeTable";

export default EmployeesTable;