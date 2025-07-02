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
  fid: number;
  created_at: string;
  sessions: {
    browser?: string;
    language?: string;
    screen_width?: number;
    screen_height?: number;
  };
}

export default function FIDDetail({ params }: { params: Promise<{ applicationId: string }> }) {
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
      fetchFIDData();
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

  const fetchFIDData = async () => {
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
          fid,
          created_at,
          browser,
          language,
          screen_width,
          screen_height
        `)
        .eq('domain', application?.domain)
        .not('fid', 'is', null)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const transformedData = (data || []).map((item: any) => ({
        pageview_id: item.pageview_id,
        session_id: item.session_id,
        path: item.path,
        domain: item.domain,
        parameters: item.parameters,
        fid: item.fid,
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
      console.error('Error fetching FID data:', err.message);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToApplication = () => {
    router.push(`/applications/${applicationId}`);
  };

  const getFIDRating = (fid: number) => {
    if (fid <= 100) return { rating: 'good', color: 'text-green-600', bg: 'bg-green-100' };
    if (fid <= 300) return { rating: 'needs-improvement', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { rating: 'poor', color: 'text-red-600', bg: 'bg-red-100' };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Loading FID data...</div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <PageBreadcrumb pageTitle="FID Data Not Found" />
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
          pageTitle="FID Performance Data"
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
                First Input Delay (FID)
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {pageviews.length} pageviews analyzed
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
              <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                {Math.round(pageviews.reduce((sum, p) => sum + p.fid, 0) / pageviews.length)}ms
              </div>
              <p className="text-sm text-green-700 dark:text-green-300">Average FID</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
              <div className="text-lg font-semibold text-gray-900 dark:text-white/90">
                {Math.round(Math.min(...pageviews.map(p => p.fid)))}ms
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Best FID</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
              <div className="text-lg font-semibold text-gray-900 dark:text-white/90">
                {Math.round(Math.max(...pageviews.map(p => p.fid)))}ms
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Worst FID</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
              <div className="text-lg font-semibold text-gray-900 dark:text-white/90">
                {pageviews.filter(p => p.fid <= 100).length}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Good FID</p>
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">
              About FID (First Input Delay)
            </h4>
            <p className="text-sm text-green-700 dark:text-green-300 mb-3">
              FID measures the time from when a user first interacts with a page to the time when the browser is 
              actually able to begin processing event handlers in response to that interaction.
            </p>
            <div className="text-sm text-green-600 dark:text-green-400 space-y-1">
              <p>• <strong>Good:</strong> 0-100 milliseconds</p>
              <p>• <strong>Needs Improvement:</strong> 100-300 milliseconds</p>
              <p>• <strong>Poor:</strong> Over 300 milliseconds</p>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-6">
            All Pageviews with FID Data
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
                      FID
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
                    const rating = getFIDRating(pageview.fid);
                    return (
                      <tr key={pageview.pageview_id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                        <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300">
                          {new Date(pageview.created_at).toLocaleString()}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900 dark:text-white/90 font-mono max-w-xs truncate">
                          {pageview.domain}{pageview.path}{pageview.parameters}
                        </td>
                        <td className="px-4 py-4 text-sm font-semibold text-gray-900 dark:text-white/90">
                          {Math.round(pageview.fid)}ms
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
                No FID data available for this application.
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                FID data will appear here once users start visiting your application.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 