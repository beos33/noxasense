import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";
import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";

export const metadata: Metadata = {
  title: "RUM Dashboard | TailAdmin - Next.js Dashboard Template",
  description: "Real User Monitoring Dashboard for TailAdmin Dashboard Template",
};

export default function RUMDashboard() {
  return (
    <div>
      <PageBreadcrumb pageTitle="RUM Dashboard" />

      <div className="rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="mx-auto w-full max-w-[630px] text-center">
          <h3 className="mb-4 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
            Real User Monitoring Dashboard
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 sm:text-base">
            Monitor your application's performance from the user's perspective. Track page load times, 
            user interactions, and performance metrics in real-time.
          </p>
        </div>
      </div>
    
      <div className="grid grid-cols-5 gap-4 md:gap-6">
        <div className="col-span-12 xl:col-span-1">
            <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">LCP</h3>
                <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">Target you’ve set for each month</p>
            </div>
        </div>
        <div className="col-span-12 xl:col-span-1">
            <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">INP</h3>
                <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">Target you’ve set for each month</p>
            </div>
        </div>
        <div className="col-span-12 xl:col-span-1">
            <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">CLS</h3>
                <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">Target you’ve set for each month</p>
            </div>
        </div>
        <div className="col-span-12 xl:col-span-1">
            <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">FCP</h3>
                <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">Target you’ve set for each month</p>
            </div>
        </div>
        <div className="col-span-12 xl:col-span-1">
            <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">TTFB</h3>
                <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">Target you’ve set for each month</p>
            </div>
        </div>
      </div>

    </div>
  );
} 