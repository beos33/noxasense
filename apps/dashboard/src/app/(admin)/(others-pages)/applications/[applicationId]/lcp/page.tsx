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
  lcp: number;
  created_at: string;
  sessions: {
    browser?: string;
    language?: string;
    screen_width?: number;
    screen_height?: number;
  };
}

export default function LCPDetail({ params }: { params: Promise<{ applicationId: string }> }) {
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
      fetchLCPData();
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

  const fetchLCPData = async () => {
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
          lcp,
          created_at,
          browser,
          language,
          screen_width,
          screen_height
        `)
        .eq('domain', application?.domain)
        .not('lcp', 'is', null)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to match the interface
      const transformedData = (data || []).map((item: any) => ({
        pageview_id: item.pageview_id,
        session_id: item.session_id,
        path: item.path,
        domain: item.domain,
        parameters: item.parameters,
        lcp: item.lcp,
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
      console.error('Error fetching LCP data:', err.message);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToApplication = () => {
    router.push(`/applications/${applicationId}`);
  };

  const getLCPRating = (lcp: number) => {
    if (lcp <= 2500) return { rating: 'good', color: 'text-green-600', bg: 'bg-green-100' };
    if (lcp <= 4000) return { rating: 'needs-improvement', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { rating: 'poor', color: 'text-red-600', bg: 'bg-red-100' };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Loading LCP data...</div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <PageBreadcrumb pageTitle="LCP Data Not Found" />
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
          pageTitle="LCP Performance Data"
          breadcrumbItems={[
            {
              label: "Applications",
              href: "/applications"
            },
            {
              label: application.name,
              href: `/applications/${applicationId}`
            }
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

      {/* LCP Overview Card */}
      <div className="mb-8">
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                Largest Contentful Paint (LCP)
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {pageviews.length} pageviews analyzed
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
              <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                {(pageviews.reduce((sum, p) => sum + p.lcp, 0) / pageviews.length / 1000).toFixed(1)}s
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-300">Average LCP</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
              <div className="text-lg font-semibold text-gray-900 dark:text-white/90">
                {(Math.min(...pageviews.map(p => p.lcp)) / 1000).toFixed(1)}s
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Best LCP</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
              <div className="text-lg font-semibold text-gray-900 dark:text-white/90">
                {(Math.max(...pageviews.map(p => p.lcp)) / 1000).toFixed(1)}s
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Worst LCP</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
              <div className="text-lg font-semibold text-gray-900 dark:text-white/90">
                {pageviews.filter(p => p.lcp <= 2500).length}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Good LCP</p>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
              About LCP (Largest Contentful Paint)
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
              LCP measures the time it takes for the largest content element to become visible within the viewport. 
              This is a key metric for perceived loading speed.
            </p>
            <div className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
              <p>• <strong>Good:</strong> 0-2.5 seconds</p>
              <p>• <strong>Needs Improvement:</strong> 2.5-4 seconds</p>
              <p>• <strong>Poor:</strong> Over 4 seconds</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pageviews Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-6">
            All Pageviews with LCP Data
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
                      LCP
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
                    const rating = getLCPRating(pageview.lcp);
                    return (
                      <tr key={pageview.pageview_id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                        <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300">
                          {new Date(pageview.created_at).toLocaleString()}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900 dark:text-white/90 font-mono max-w-xs truncate">
                          {pageview.domain}{pageview.path}{pageview.parameters}
                        </td>
                        <td className="px-4 py-4 text-sm font-semibold text-gray-900 dark:text-white/90">
                          {(pageview.lcp / 1000).toFixed(2)}s
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
              <p className="text-gray-500 dark:text-gray-400">
                No LCP data available for this application.
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                LCP data will appear here once users start visiting your application.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 