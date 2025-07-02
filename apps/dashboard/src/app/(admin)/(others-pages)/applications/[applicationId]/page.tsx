"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/ui/button/Button";
import { ChevronLeftIcon } from "@/icons";

interface Application {
  application_id: string;
  name: string;
  domain: string;
  created_at: string;
  user_id: string;
}

interface Session {
  session_id: string;
  application_id: string;
  created_at: string;
  browser?: string;
  language?: string;
  screen_width?: number;
  screen_height?: number;
}

export default function ApplicationDetail({ params }: { params: Promise<{ applicationId: string }> }) {
  const [application, setApplication] = useState<Application | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [cwvData, setCwvData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);
  const [isLoadingCwv, setIsLoadingCwv] = useState(true);
  const [error, setError] = useState("");
  const [isTrackingScriptCollapsed, setIsTrackingScriptCollapsed] = useState(false);
  const { user } = useAuth();
  const supabase = createClientComponentClient();
  const router = useRouter();

  const { applicationId } = React.use(params);

  useEffect(() => {
    if (user && applicationId) {
      fetchApplication();
      fetchSessions();
      fetchCwvData();
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
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSessions = async () => {
    if (!user || !applicationId) return;
    
    try {
      const { data, error } = await supabase
        .from('sessions')
        .select('session_id, application_id, created_at, browser, language, screen_width, screen_height')
        .eq('application_id', applicationId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      
      setSessions(data || []);
      
      // Collapse tracking script by default if there are more than 1 session
      if (data && data.length > 1) {
        setIsTrackingScriptCollapsed(true);
      }
    } catch (err: any) {
      console.error('Error fetching sessions:', err.message);
    } finally {
      setIsLoadingSessions(false);
    }
  };

  const fetchCwvData = async () => {
    if (!user || !applicationId) return;
    
    try {
      // Get pageviews for this application (join with sessions)
      const { data, error } = await supabase
        .from('pageviews')
        .select(`
          cls, lcp, fid, ttfb, fcp, inp, dom_interactive, dom_content_loaded, dom_complete, load_time,
          sessions!inner(application_id)
        `)
        .eq('sessions.application_id', applicationId)
        .not('cls', 'is', null)
        .not('lcp', 'is', null)
        .not('fid', 'is', null)
        .order('created_at', { ascending: false })
        .limit(100); // Get last 100 pageviews for better averages

      if (error) throw error;

      if (data && data.length > 0) {
        // Calculate averages and performance ratings
        const metrics = {
          lcp: { values: data.map(p => p.lcp).filter(v => v !== null), avg: 0, rating: 'good' },
          fid: { values: data.map(p => p.fid).filter(v => v !== null), avg: 0, rating: 'good' },
          cls: { values: data.map(p => p.cls).filter(v => v !== null), avg: 0, rating: 'good' },
          inp: { values: data.map(p => p.inp).filter(v => v !== null), avg: 0, rating: 'good' },
          fcp: { values: data.map(p => p.fcp).filter(v => v !== null), avg: 0, rating: 'good' },
          ttfb: { values: data.map(p => p.ttfb).filter(v => v !== null), avg: 0, rating: 'good' },
          loadTime: { values: data.map(p => p.load_time).filter(v => v !== null), avg: 0, rating: 'good' }
        };

        // Calculate averages
        Object.keys(metrics).forEach(key => {
          const metric = metrics[key as keyof typeof metrics];
          if (metric.values.length > 0) {
            metric.avg = metric.values.reduce((sum, val) => sum + val, 0) / metric.values.length;
          }
        });

        // Determine performance ratings
        // LCP: Good < 2.5s, Needs Improvement 2.5-4s, Poor > 4s
        if (metrics.lcp.avg > 4000) metrics.lcp.rating = 'poor';
        else if (metrics.lcp.avg > 2500) metrics.lcp.rating = 'needs-improvement';
        else metrics.lcp.rating = 'good';

        // FID: Good < 100ms, Needs Improvement 100-300ms, Poor > 300ms
        if (metrics.fid.avg > 300) metrics.fid.rating = 'poor';
        else if (metrics.fid.avg > 100) metrics.fid.rating = 'needs-improvement';
        else metrics.fid.rating = 'good';

        // CLS: Good < 0.1, Needs Improvement 0.1-0.25, Poor > 0.25
        if (metrics.cls.avg > 0.25) metrics.cls.rating = 'poor';
        else if (metrics.cls.avg > 0.1) metrics.cls.rating = 'needs-improvement';
        else metrics.cls.rating = 'good';

        // INP: Good < 200ms, Needs Improvement 200-500ms, Poor > 500ms
        if (metrics.inp.avg > 500) metrics.inp.rating = 'poor';
        else if (metrics.inp.avg > 200) metrics.inp.rating = 'needs-improvement';
        else metrics.inp.rating = 'good';

        // FCP: Good < 1.8s, Needs Improvement 1.8-3s, Poor > 3s
        if (metrics.fcp.avg > 3000) metrics.fcp.rating = 'poor';
        else if (metrics.fcp.avg > 1800) metrics.fcp.rating = 'needs-improvement';
        else metrics.fcp.rating = 'good';

        // TTFB: Good < 800ms, Needs Improvement 800-1800ms, Poor > 1800ms
        if (metrics.ttfb.avg > 1800) metrics.ttfb.rating = 'poor';
        else if (metrics.ttfb.avg > 800) metrics.ttfb.rating = 'needs-improvement';
        else metrics.ttfb.rating = 'good';

        setCwvData({
          metrics,
          totalPageviews: data.length,
          lastUpdated: new Date().toISOString()
        });
      }
    } catch (err: any) {
      console.error('Error fetching CWV data:', err.message);
    } finally {
      setIsLoadingCwv(false);
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
        <PageBreadcrumb 
          pageTitle={application.name}
          breadcrumbItems={[
            {
              label: "Applications",
              href: "/applications"
            }
          ]}
        />
        <Button
          size="sm"
          onClick={handleBackToApplications}
          startIcon={<ChevronLeftIcon />}
        >
          Back to Applications
        </Button>
      </div>

      {/* Core Web Vitals Overview */}
      {!isLoadingCwv && (
        <div className="mb-8">
          <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                Performance Overview
              </h2>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Based on {cwvData?.totalPageviews || 0} recent pageviews
              </div>
            </div>

            {cwvData ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                  {/* LCP - Largest Contentful Paint */}
                <div 
                  className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800 cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => router.push(`/applications/${applicationId}/lcp`)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-blue-800 dark:text-blue-200">LCP</h3>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      cwvData.metrics.lcp.rating === 'good' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                      cwvData.metrics.lcp.rating === 'needs-improvement' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                      'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                    }`}>
                      {cwvData.metrics.lcp.rating === 'good' ? 'Good' :
                       cwvData.metrics.lcp.rating === 'needs-improvement' ? 'Needs Work' : 'Poor'}
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    {(cwvData.metrics.lcp.avg / 1000).toFixed(1)}s
                  </div>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                    Largest Contentful Paint
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                    Click to view detailed data →
                  </p>
                </div>

                                  {/* FID - First Input Delay */}
                <div 
                  className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-4 border border-green-200 dark:border-green-800 cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => router.push(`/applications/${applicationId}/fid`)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-green-800 dark:text-green-200">FID</h3>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      cwvData.metrics.fid.rating === 'good' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                      cwvData.metrics.fid.rating === 'needs-improvement' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                      'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                    }`}>
                      {cwvData.metrics.fid.rating === 'good' ? 'Good' :
                       cwvData.metrics.fid.rating === 'needs-improvement' ? 'Needs Work' : 'Poor'}
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                    {Math.round(cwvData.metrics.fid.avg)}ms
                  </div>
                  <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                    First Input Delay
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                    Click to view detailed data →
                  </p>
                </div>

                                  {/* CLS - Cumulative Layout Shift */}
                <div 
                  className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800 cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => router.push(`/applications/${applicationId}/cls`)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-purple-800 dark:text-purple-200">CLS</h3>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      cwvData.metrics.cls.rating === 'good' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                      cwvData.metrics.cls.rating === 'needs-improvement' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                      'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                    }`}>
                      {cwvData.metrics.cls.rating === 'good' ? 'Good' :
                       cwvData.metrics.cls.rating === 'needs-improvement' ? 'Needs Work' : 'Poor'}
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                    {cwvData.metrics.cls.avg.toFixed(3)}
                  </div>
                  <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
                    Cumulative Layout Shift
                  </p>
                  <p className="text-xs text-purple-600 dark:text-purple-400 mt-2">
                    Click to view detailed data →
                  </p>
                </div>

                  {/* INP - Interaction to Next Paint */}
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl p-4 border border-orange-200 dark:border-orange-800">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-orange-800 dark:text-orange-200">INP</h3>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        cwvData.metrics.inp.rating === 'good' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                        cwvData.metrics.inp.rating === 'needs-improvement' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                        'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                      }`}>
                        {cwvData.metrics.inp.rating === 'good' ? 'Good' :
                         cwvData.metrics.inp.rating === 'needs-improvement' ? 'Needs Work' : 'Poor'}
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                      {Math.round(cwvData.metrics.inp.avg)}ms
                    </div>
                    <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                      Interaction to Next Paint
                    </p>
                  </div>
                </div>

                {/* Additional Metrics Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                  {/* FCP - First Contentful Paint */}
                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-800">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-800 dark:text-white/90">FCP</h3>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        cwvData.metrics.fcp.rating === 'good' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                        cwvData.metrics.fcp.rating === 'needs-improvement' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                        'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                      }`}>
                        {cwvData.metrics.fcp.rating === 'good' ? 'Good' :
                         cwvData.metrics.fcp.rating === 'needs-improvement' ? 'Needs Work' : 'Poor'}
                      </div>
                    </div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-white/90">
                      {(cwvData.metrics.fcp.avg / 1000).toFixed(1)}s
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">First Contentful Paint</p>
                  </div>

                  {/* TTFB - Time to First Byte */}
                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-800">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-800 dark:text-white/90">TTFB</h3>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        cwvData.metrics.ttfb.rating === 'good' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                        cwvData.metrics.ttfb.rating === 'needs-improvement' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                        'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                      }`}>
                        {cwvData.metrics.ttfb.rating === 'good' ? 'Good' :
                         cwvData.metrics.ttfb.rating === 'needs-improvement' ? 'Needs Work' : 'Poor'}
                      </div>
                    </div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-white/90">
                      {Math.round(cwvData.metrics.ttfb.avg)}ms
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Time to First Byte</p>
                  </div>

                  {/* Load Time */}
                  <div 
                    className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-800 cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => router.push(`/applications/${applicationId}/load-time`)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-800 dark:text-white/90">Load Time</h3>
                      <div className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                        Average
                      </div>
                    </div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-white/90">
                      {(cwvData.metrics.loadTime.avg / 1000).toFixed(1)}s
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Page Load</p>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400 dark:text-gray-500 mb-2">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <p className="text-gray-500 dark:text-gray-400">
                  No performance data available yet
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                  Performance metrics will appear here once users start visiting your application
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Application Details */}
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

      {/* Tracking Script Section */}
      <div className="mt-8 overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Tracking Script
            </h3>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsTrackingScriptCollapsed(!isTrackingScriptCollapsed)}
              className="flex items-center gap-2"
            >
              {isTrackingScriptCollapsed ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  Show Details
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                  Hide Details
                </>
              )}
            </Button>
          </div>
          
          {!isTrackingScriptCollapsed && (
            <div className="space-y-6">
              {/* How it works explanation */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                  How the Tracking Script Works
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                  The NoxaSense tracking script automatically collects user session data including browser information, 
                  screen dimensions, language preferences, and page interactions. This data helps you understand 
                  how users interact with your application.
                </p>
                <div className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
                  <p>• <strong>Session Tracking:</strong> Creates unique sessions for each user visit</p>
                  <p>• <strong>Browser Detection:</strong> Identifies browser type and version</p>
                  <p>• <strong>Screen Analytics:</strong> Captures device screen dimensions</p>
                  <p>• <strong>Language Detection:</strong> Records user's preferred language</p>
                  <p>• <strong>Performance Monitoring:</strong> Tracks page load times and interactions</p>
                </div>
              </div>

              {/* Installation instructions */}
              <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                <h4 className="font-medium text-gray-800 dark:text-white/90 mb-2">
                  Installation Instructions
                </h4>
                <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                  <p><strong>Recommended:</strong> Add the script to the <code className="bg-gray-200 dark:bg-gray-800 px-1 rounded">&lt;head&gt;</code> section of your HTML for optimal performance.</p>
                  <p><strong>Alternative:</strong> Place it just before the closing <code className="bg-gray-200 dark:bg-gray-800 px-1 rounded">&lt;/body&gt;</code> tag if you prefer.</p>
                  <p><strong>Note:</strong> The script is lightweight (~2KB) and loads asynchronously, so it won't impact your page load speed.</p>
                </div>
              </div>

              {/* Script code */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-800 dark:text-white/90">
                    Tracking Script Code
                  </h4>
                  <Button
                    size="sm"
                    onClick={() => {
                      const scriptText = `<script>
  (function(n,o,x,a,s,e,r){
    n['NoxaSenseObject']=o;n[o]=n[o]||function(){(n[o].q=n[o].q||[]).push(arguments)};
    n[o].l=1*new Date();e=s.createElement('script');e.async=1;
    e.src='https://cdn.noxasense.com/snippet.js';r=s.getElementsByTagName('script')[0];
    r.parentNode.insertBefore(e,r);
  })(window,'noxa');
  
  noxa('init', '${application.application_id}');
</script>`;
                      navigator.clipboard.writeText(scriptText);
                    }}
                    className="text-xs"
                  >
                    Copy Script
                  </Button>
                </div>
                
                <div className="bg-gray-900 dark:bg-gray-800 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-sm text-green-400 font-mono">
{`<script>
  (function(n,o,x,a,s,e,r){
    n['NoxaSenseObject']=o;n[o]=n[o]||function(){(n[o].q=n[o].q||[]).push(arguments)};
    n[o].l=1*new Date();e=s.createElement('script');e.async=1;
    e.src='https://cdn.noxasense.com/snippet.js';r=s.getElementsByTagName('script')[0];
    r.parentNode.insertBefore(e,r);
  })(window,'noxa');
  
  noxa('init', '${application.application_id}');
</script>`}
                  </pre>
                </div>
              </div>

              {/* Implementation examples */}
              <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                <h4 className="font-medium text-gray-800 dark:text-white/90 mb-3">
                  Implementation Examples
                </h4>
                
                <div className="space-y-4">
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">HTML Head (Recommended)</h5>
                    <div className="bg-gray-900 dark:bg-gray-800 rounded p-3 overflow-x-auto">
                      <pre className="text-xs text-green-400 font-mono">
{`<!DOCTYPE html>
<html>
<head>
  <title>Your Website</title>
  <script>
    (function(n,o,x,a,s,e,r){
      n['NoxaSenseObject']=o;n[o]=n[o]||function(){(n[o].q=n[o].q||[]).push(arguments)};
      n[o].l=1*new Date();e=s.createElement('script');e.async=1;
      e.src='https://cdn.noxasense.com/snippet.js';r=s.getElementsByTagName('script')[0];
      r.parentNode.insertBefore(e,r);
    })(window,'noxa');
    
    noxa('init', '${application.application_id}');
  </script>
</head>
<body>
  <!-- Your content here -->
</body>
</html>`}
                      </pre>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Before Closing Body Tag</h5>
                    <div className="bg-gray-900 dark:bg-gray-800 rounded p-3 overflow-x-auto">
                      <pre className="text-xs text-green-400 font-mono">
{`<!DOCTYPE html>
<html>
<head>
  <title>Your Website</title>
</head>
<body>
  <!-- Your content here -->
  
  <script>
    (function(n,o,x,a,s,e,r){
      n['NoxaSenseObject']=o;n[o]=n[o]||function(){(n[o].q=n[o].q||[]).push(arguments)};
      n[o].l=1*new Date();e=s.createElement('script');e.async=1;
      e.src='https://cdn.noxasense.com/snippet.js';r=s.getElementsByTagName('script')[0];
      r.parentNode.insertBefore(e,r);
    })(window,'noxa');
    
    noxa('init', '${application.application_id}');
  </script>
</body>
</html>`}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Sessions Section */}
      <div className="mt-8 overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-6">
            Recent Sessions
          </h3>
          
          {isLoadingSessions ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-500">Loading sessions...</div>
            </div>
          ) : sessions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-white/[0.05]">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                      Session ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                      Date & Time
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                      Browser
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                      Language
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                      Screen
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {sessions.map((session) => (
                    <tr key={session.session_id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                      <td className="px-4 py-4 text-sm text-gray-900 dark:text-white/90 font-mono">
                        {session.session_id.substring(0, 8)}...
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300">
                        {new Date(session.created_at).toLocaleString()}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300">
                        {session.browser || 'Unknown'}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300">
                        {session.language || 'Unknown'}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300">
                        {session.screen_width && session.screen_height 
                          ? `${session.screen_width} × ${session.screen_height}`
                          : 'Unknown'
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                No sessions found for this application yet.
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                Sessions will appear here once users start visiting your application.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 