import { Badge, Enumerable, MenuIcon, MenuItem } from "@carbon/react";
import { useNavigate } from "@remix-run/react";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useCallback, useMemo } from "react";
import { BsFillPenFill } from "react-icons/bs";
import { IoMdTrash } from "react-icons/io";
import { Hyperlink, New, Table } from "~/components";
import { usePermissions, useUrlParams } from "~/hooks";
import type { Shift, ShiftLocation } from "~/modules/resources";
import { path } from "~/utils/path";

type ShiftsTableProps = {
  data: Shift[];
  count: number;
  locations: Partial<ShiftLocation>[];
};

const ShiftsTable = memo(({ data, count, locations }: ShiftsTableProps) => {
  const navigate = useNavigate();
  const permissions = usePermissions();
  const [params] = useUrlParams();

  const renderDays = useCallback((row: Shift) => {
    const days = [
      row.monday && "M",
      row.tuesday && "Tu",
      row.wednesday && "W",
      row.thursday && "Th",
      row.friday && "F",
      row.saturday && "Sa",
      row.sunday && "Su",
    ].filter(Boolean);

    return days.map((day) => (
      <Badge key={day as string} variant="outline" className="mr-0.5">
        {day}
      </Badge>
    ));
  }, []);

  const columns = useMemo<ColumnDef<Shift>[]>(() => {
    return [
      {
        accessorKey: "name",
        header: "Shift",
        cell: ({ row }) => (
          <Hyperlink to={row.original.id!}>{row.original.name}</Hyperlink>
        ),
      },
      {
        accessorKey: "startTime",
        header: "Start Time",
        cell: (item) => item.getValue(),
      },
      {
        accessorKey: "endTime",
        header: "End Time",
        cell: (item) => item.getValue(),
      },
      {
        accessorKey: "locationName",
        header: "Location",
        cell: (item) => <Enumerable value={item.getValue<string>()} />,
        meta: {
          filter: {
            type: "static",
            options: locations.map((location) => ({
              value: location.name!,
              label: <Enumerable value={location.name!} />,
            })),
          },
        },
      },
      {
        id: "days",
        header: "Days",
        // @ts-ignore
        cell: ({ row }) => renderDays(row.original),
      },
    ];
  }, [locations, renderDays]);

  const renderContextMenu = useCallback(
    (row: Shift) => {
      return (
        <>
          <MenuItem
            onClick={() => {
              navigate(`${path.to.shift(row.id!)}?${params.toString()}}`);
            }}
          >
            <MenuIcon icon={<BsFillPenFill />} />
            Edit Shift
          </MenuItem>
          <MenuItem
            disabled={!permissions.can("delete", "resources")}
            onClick={() => {
              navigate(`${path.to.deleteShift(row.id!)}?${params.toString()}`);
            }}
          >
            <MenuIcon icon={<IoMdTrash />} />
            Delete Shift
          </MenuItem>
        </>
      );
    },
    [navigate, params, permissions]
  );

  return (
    <Table<Shift>
      data={data}
      count={count}
      columns={columns}
      primaryAction={
        permissions.can("create", "resources") && (
          <New label="Shift" to={`new?${params.toString()}`} />
        )
      }
      renderContextMenu={renderContextMenu}
    />
  );
});

ShiftsTable.displayName = "ShiftsTable";
export default ShiftsTable;
