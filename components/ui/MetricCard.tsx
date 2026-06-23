"use client";
import React from "react";
import Link from "next/link";
export default function Stub(props: any) {
  const title = props?.title ?? props?.label ?? '';
  const value = props?.value ?? props?.count;
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm hover:shadow-md transition dark:border-neutral-800 dark:bg-neutral-900">
      {title ? <p className="text-sm font-medium text-neutral-500">{title}</p> : null}
      {value !== undefined ? <p className="mt-1 text-3xl font-bold tracking-tight">{value}</p> : null}
      {props?.children}
    </div>
  );
}
export const MetricCard: any = Stub;
