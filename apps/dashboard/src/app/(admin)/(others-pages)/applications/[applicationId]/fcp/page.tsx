"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/ui/button/Button";
import { ChevronLeftIcon } from "@/icons";

interface Pageview {
  pageview_id: string;
  session_id: string;
  path: string;
  domain: string;
  parameters: string;
  fcp: number;
  created_at: string;
  sessions: {
    browser?: string;
    language?: string;
    screen_width?: number;
    screen_height?: number;
  };
}

export default function FCPDetail({ params }: { params: Promise<{ applicationId: string }> }) {
  const [pageviews, setPageviews] = useState<Pageview[]>([]);
  const [application, setApplication] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const supabase = createClientComponentClient();
  const router = useRouter();

  const { applicationId } = React.use(params);

  useEffect(() => {
    if (user && applicationId) {
      fetchApplication();
      fetchFCPData();
    }
  }, [user, applicationId]);

  const fetchApplication = async () => {
    if (!user || !applicationId) return;
    
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('application_id', applicationId)
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      setApplication(data);
    } catch (err: any) {
      console.error('Error fetching application:', err.message);
      setError(err.message);
    }
  };

  const fetchFCPData = async () => {
    if (!user || !applicationId) return;
    
    try {
      const { data, error } = await supabase
        .from('pageviews')
        .select(`
          pageview_id,
          session_id,
          path,
          domain,
          parameters,
          fcp,
          created_at,
          browser,
          language,
          screen_width,
          screen_height
        `)
        .eq('domain', application?.domain)
        .not('fcp', 'is', null)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to match the interface
      const transformedData = (data || []).map((item: any) => ({
        pageview_id: item.pageview_id,
        session_id: item.session_id,
        path: item.path,
        domain: item.domain,
        parameters: item.parameters,
        fcp: item.fcp,
        created_at: item.created_at,
        sessions: {
          browser: item.browser,
          language: item.language,
          screen_width: item.screen_width,
          screen_height: item.screen_height
        }
      }));
      
      setPageviews(transformedData);
    } catch (err: any) {
      console.error('Error fetching FCP data:', err.message);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToApplication = () => {
    router.push(`/applications/${applicationId}`);
  };

  const getFCPRating = (fcp: number) => {
    if (fcp <= 1800) return { rating: 'good', color: 'text-green-600', bg: 'bg-green-100' };
    if (fcp <= 3000) return { rating: 'needs-improvement', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { rating: 'poor', color: 'text-red-600', bg: 'bg-red-100' };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Loading FCP data...</div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <PageBreadcrumb pageTitle="FCP Data Not Found" />
          <Button
            size="sm"
            onClick={handleBackToApplication}
            startIcon={<ChevronLeftIcon />}
          >
            Back to Application
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
        <PageBreadcrumb 
          pageTitle="FCP Performance Data"
          breadcrumbItems={[
            { label: "Applications", href: "/applications" },
            { label: application.name, href: `/applications/${applicationId}` }
          ]}
        />
        <Button
          size="sm"
          onClick={handleBackToApplication}
          startIcon={<ChevronLeftIcon />}
        >
          Back to Application
        </Button>
      </div>

      <div className="mb-8">
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                First Contentful Paint (FCP)
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {pageviews.length} pageviews analyzed
              </p>
            </div>
            <div className="bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/20 rounded-xl p-4 border border-teal-200 dark:border-teal-800">
              <div className="text-2xl font-bold text-teal-900 dark:text-teal-100">
                {(pageviews.reduce((sum, p) => sum + p.fcp, 0) / pageviews.length / 1000).toFixed(1)}s
              </div>
              <p className="text-sm text-teal-700 dark:text-teal-300">Average FCP</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
              <div className="text-lg font-semibold text-gray-900 dark:text-white/90">
                {(Math.min(...pageviews.map(p => p.fcp)) / 1000).toFixed(1)}s
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Best FCP</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
              <div className="text-lg font-semibold text-gray-900 dark:text-white/90">
                {(Math.max(...pageviews.map(p => p.fcp)) / 1000).toFixed(1)}s
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Worst FCP</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
              <div className="text-lg font-semibold text-gray-900 dark:text-white/90">
                {pageviews.filter(p => p.fcp <= 1800).length}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Good FCP</p>
            </div>
          </div>

          <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-lg p-4">
            <h4 className="font-medium text-teal-800 dark:text-teal-200 mb-2">
              About FCP (First Contentful Paint)
            </h4>
            <p className="text-sm text-teal-700 dark:text-teal-300 mb-3">
              FCP measures the time from when the page starts loading to when any part of the page's content is 
              rendered on the screen. This metric helps you understand when users can see content on your page.
            </p>
            <div className="text-sm text-teal-600 dark:text-teal-400 space-y-1">
              <p>• <strong>Good:</strong> 0-1.8 seconds</p>
              <p>• <strong>Needs Improvement:</strong> 1.8-3 seconds</p>
              <p>• <strong>Poor:</strong> Over 3 seconds</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pageviews Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-6">
            All Pageviews with FCP Data
          </h3>
          
          {pageviews.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-white/[0.05]">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                      Date & Time
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                      URL
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                      FCP
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                      Rating
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                      Browser
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                      Screen
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {pageviews.map((pageview) => {
                    const rating = getFCPRating(pageview.fcp);
                    return (
                      <tr key={pageview.pageview_id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                        <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300">
                          {new Date(pageview.created_at).toLocaleString()}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900 dark:text-white/90 font-mono max-w-xs truncate">
                          {pageview.domain}{pageview.path}{pageview.parameters}
                        </td>
                        <td className="px-4 py-4 text-sm font-semibold text-gray-900 dark:text-white/90">
                          {(pageview.fcp / 1000).toFixed(2)}s
                        </td>
                        <td className="px-4 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${rating.bg} ${rating.color}`}>
                            {rating.rating === 'good' ? 'Good' :
                             rating.rating === 'needs-improvement' ? 'Needs Work' : 'Poor'}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300">
                          {pageview.sessions.browser || 'Unknown'}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300">
                          {pageview.sessions.screen_width && pageview.sessions.screen_height 
                            ? `${pageview.sessions.screen_width} × ${pageview.sessions.screen_height}`
                            : 'Unknown'
                          }
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-400 dark:text-gray-500 mb-2">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <p className="text-gray-500 dark:text-gray-400">
                No FCP data available yet
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                FCP metrics will appear here once users visit your application
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 