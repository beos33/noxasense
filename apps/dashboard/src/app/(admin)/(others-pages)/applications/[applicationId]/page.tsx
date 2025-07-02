"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button/Button";
import { ChevronLeftIcon } from "@/icons";

interface Application {
  application_id: string;
  name: string;
  domain: string;
  created_at: string;
  user_id: string;
}

export default function ApplicationDetail({ params }: { params: { applicationId: string } }) {
  const [application, setApplication] = useState<Application | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    fetchApplication();
  }, [params.applicationId, user]);

  const fetchApplication = async () => {
    if (!user || !params.applicationId) return;
    
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('application_id, name, domain, created_at, user_id')
        .eq('application_id', params.applicationId)
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      
      setApplication(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToApplications = () => {
    router.push('/applications');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Loading application...</div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <PageBreadcrumb pageTitle="Application Not Found" />
          <Button
            size="sm"
            onClick={handleBackToApplications}
            startIcon={<ChevronLeftIcon />}
          >
            Back to Applications
          </Button>
        </div>
        <div className="p-4 text-sm text-red-500 bg-red-100 rounded-lg dark:bg-red-900/50">
          {error || "Application not found"}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <PageBreadcrumb pageTitle={application.name} />
        <Button
          size="sm"
          onClick={handleBackToApplications}
          startIcon={<ChevronLeftIcon />}
        >
          Back to Applications
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white/90 mb-6">
            Application Details
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-white/[0.05]">
              <span className="font-medium text-gray-700 dark:text-gray-300">Name:</span>
              <span className="text-gray-900 dark:text-white/90">{application.name}</span>
            </div>
            
            <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-white/[0.05]">
              <span className="font-medium text-gray-700 dark:text-gray-300">Domain:</span>
              <span className="text-gray-900 dark:text-white/90">{application.domain}</span>
            </div>
            
            <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-white/[0.05]">
              <span className="font-medium text-gray-700 dark:text-gray-300">Created:</span>
              <span className="text-gray-900 dark:text-white/90">
                {new Date(application.created_at).toLocaleDateString()}
              </span>
            </div>
            
            <div className="flex items-center justify-between py-3">
              <span className="font-medium text-gray-700 dark:text-gray-300">Application ID:</span>
              <span className="text-gray-500 dark:text-gray-400 text-sm font-mono">
                {application.application_id}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Placeholder for future features */}
      <div className="mt-8 p-6 bg-gray-50 dark:bg-white/[0.02] rounded-xl border border-gray-200 dark:border-white/[0.05]">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
          Analytics & Monitoring
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Analytics and monitoring features will be available here soon. This will include session data, 
          performance metrics, and user behavior insights for your application.
        </p>
      </div>
    </div>
  );
} 