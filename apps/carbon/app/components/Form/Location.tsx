import { Select } from "@carbon/react";
import {
  Box,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
} from "@chakra-ui/react";
import { useFetcher } from "@remix-run/react";
import { useEffect, useMemo } from "react";
import { useControlField, useField } from "remix-validated-form";
import type { getLocations } from "~/modules/resources";
import type { SelectProps } from "./Select";

type LocationSelectProps = Omit<SelectProps, "options"> & {
  location?: string;
};

const Location = ({
  name,
  label = "Location",
  location,
  helperText,
  isLoading,
  isReadOnly,
  placeholder = "Select Location",
  onChange,
  ...props
}: LocationSelectProps) => {
  const { error, defaultValue } = useField(name);
  const [value, setValue] = useControlField<string | undefined>(name);

  const locationFetcher =
    useFetcher<Awaited<ReturnType<typeof getLocations>>>();

  useEffect(() => {
    locationFetcher.load(`/api/resources/locations`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const options = useMemo(
    () =>
      locationFetcher.data?.data
        ? locationFetcher.data?.data.map((c) => ({
            value: c.id,
            label: c.name,
          }))
        : [],
    [locationFetcher.data]
  );

  const handleChange = (selection: {
    value: string | number;
    label: string;
  }) => {
    const newValue = (selection.value as string) || undefined;
    setValue(newValue);
    if (onChange && typeof onChange === "function") {
      onChange(selection);
    }
  };

  const controlledValue = useMemo(
    // @ts-ignore
    () => options.find((option) => option.value === value),
    [value, options]
  );

  // so that we can call onChange on load
  useEffect(() => {
    if (controlledValue && controlledValue.value === defaultValue) {
      handleChange(controlledValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controlledValue?.value]);

  // TODO: hack for default value
  return locationFetcher.state !== "loading" ? (
    <FormControl isInvalid={!!error}>
      {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
      <input type="hidden" name={name} id={name} value={value} />
      <Select
        {...props}
        value={controlledValue}
        isLoading={isLoading}
        options={options}
        placeholder={placeholder}
        // @ts-ignore
        onChange={handleChange}
      />
      {error ? (
        <FormErrorMessage>{error}</FormErrorMessage>
      ) : (
        helperText && <FormHelperText>{helperText}</FormHelperText>
      )}
    </FormControl>
  ) : (
    <Box>
      {label && <FormLabel>{label}</FormLabel>}
      <Select
        isDisabled
        isLoading={isLoading}
        options={[]}
        //@ts-ignore
      />
    </Box>
  );
};

Location.displayName = "Location";

export default Location;