import React from "react";

type Props<T> = {
  id: string;
  value: T;
  setValueFn: (newValue: T) => void;
  label: string;
  options: {
    key: string;
    label: string;
    value: T;
  }[];
};

const FormSelect = <T extends string | number>({
  id,
  value,
  setValueFn,
  label,
  options,
  ...otherProps
}: Props<T> & React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <section>
    <label className="block mb-1" htmlFor="id">
      {label}
    </label>

    <select
      style={{ width: "100%" }}
      id={id}
      value={value}
      {...otherProps}
      onChange={(e) => setValueFn(e.currentTarget.value as T)}
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
