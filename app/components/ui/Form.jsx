// app/components/ui/Form.jsx

import { forwardRef } from "react";

const FormLayout = ({ children, onSubmit }) => (
  <form
    onSubmit={onSubmit}
    className="max-w-2xl mx-auto space-y-8 bg-white shadow-lg rounded-lg px-8 py-6"
  >
    {children}
  </form>
);

const FormSection = ({ title, children }) => (
  <div className="space-y-6">
    <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">{children}</div>
  </div>
);

const FormInput = forwardRef(
  ({ label, type = "text", className = "", ...props }, ref) => (
    <div className="space-y-2">
      <label
        htmlFor={props.id}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <input
        type={type}
        className={`w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150 ease-in-out ${className}`}
        ref={ref}
        {...props}
      />
    </div>
  )
);

const FormSelect = forwardRef(
  ({ label, options, className = "", ...props }, ref) => (
    <div className="space-y-2">
      <label
        htmlFor={props.id}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <select
        className={`w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150 ease-in-out ${className}`}
        ref={ref}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
);

const FormButton = ({ children, className = "", ...props }) => (
  <button
    type="submit"
    className={`w-full py-2 px-4 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out ${className}`}
    {...props}
  >
    {children}
  </button>
);

const FormLabel = ({ children, className = "", ...props }) => (
  <label
    className={`w-full py-2 px-4 text-sm font-medium text-gray-900 transition duration-150 ease-in-out ${className}`}
    {...props}
  >
    {children}
  </label>
);
export {
  FormLayout,
  FormSection,
  FormInput,
  FormSelect,
  FormButton,
  FormLabel,
};
