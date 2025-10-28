"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { cn } from "@/lib/utils";

export default function AccordionTriggerMinimal({
  className,
  children,
  ...props
}) {
  return (
    <AccordionPrimitive.Header className="flex w-full">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group flex flex-1 w-1/2 items-center gap-2 py-2 text-left font-medium outline-none",
          className
        )}
        {...props}
      >
        {children}
        <span className="plus-icon" aria-hidden="true" data-icon="plus">
          +
        </span>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}
