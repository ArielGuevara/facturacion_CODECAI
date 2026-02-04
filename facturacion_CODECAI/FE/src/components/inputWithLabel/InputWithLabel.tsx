import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import React from "react"



type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  id?: string;
  className?: string;
};

export const InputWithLabel = React.forwardRef<HTMLInputElement, Props>(
  ({ label, id, className, ...rest }, ref) => {
    return (
      <label htmlFor={id} className={className ?? "block"}>
        {label && <span className="block mb-1">{label}</span>}
        <input id={id} ref={ref} {...rest} />
      </label>
    );
  }
);

InputWithLabel.displayName = "InputWithLabel";
// ...existing code...