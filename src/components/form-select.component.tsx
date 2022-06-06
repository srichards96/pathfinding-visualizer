import React from "react";

type Props = {
  id: string;
  value: string;
  setValueFn: (newValue: string) => void;
  label: string;
  options: {
    key: string;
    label: string;
    value: string;
  }[];
};

const FormSelect = ({
  id,
  value,
  setValueFn,
  label,
  options,
  ...otherProps
}: Props & React.HTMLAttributes<HTMLSelectElement>) => (
  <section>
    <label className="block mb-1" htmlFor="id">
      {label}
    </label>

    <select
      style={{ width: "100%" }}
      id={id}
      value={value}
      {...otherProps}
      onChange={(e) => setValueFn(e.currentTarget.value)}
    >
      {options.map((o) => (
        <option key={o.key} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  </section>
);

export default FormSelect;
