
import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-4 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "file:mr-4 file:rounded-md file:border-0 file:bg-blue-600 file:px-3 file:py-1 file:text-sm file:font-medium file:text-white hover:file:bg-blue-700",
        "aria-invalid:border-red-500 aria-invalid:ring-red-200",
        className
      )}
      {...props}
    />
  )
}

export { Input }
