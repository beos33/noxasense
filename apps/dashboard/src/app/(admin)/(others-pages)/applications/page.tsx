"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/context/AuthContext";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Button from "@/components/ui/button/Button";
import { PlusIcon } from "@/icons";
import { useModal } from "@/hooks/useModal";
import { Modal } from "@/components/ui/modal";
import Form from "@/components/form/Form";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import { useRouter } from "next/navigation";

interface Application {
  application_id: string;
  name: string;
  domain: string;
  created_at: string;
  user_id: string;
}

export default function Applications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { isOpen, openModal, closeModal } = useModal();
  const { user } = useAuth();
  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    fetchApplications();
  }, [user]);

  const fetchApplications = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('application_id, name, domain, created_at, user_id')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Filter out any applications without IDs and log for debugging
      const validApplications = (data || []).filter(app => {
        if (!app.application_id) {
          console.error('Found application without ID:', app);
          return false;
        }
        return true;
      });
      
      setApplications(validApplications);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateApplication = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    // Get the form element from the event target
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const name = formData.get('name') as string;
    const domain = formData.get('domain') as string;

    // Basic validation
    if (!name || !name.trim()) {
      setError('Application name is required');
      return;
    }

    if (!domain || !domain.trim()) {
      setError('Domain is required');
      return;
    }

    try {
      const { error } = await supabase
        .from('applications')
        .insert([
          {
            name: name.trim(),
            domain: domain.trim(),
            user_id: user.id
          }
        ]);

      if (error) throw error;
      
      closeModal();
      fetchApplications();
      setError(''); // Clear any previous errors
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleApplicationClick = (applicationId: string) => {
    router.push(`/applications/${applicationId}`);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <PageBreadcrumb pageTitle="Applications" />
        <Button
          size="sm"
          onClick={openModal}
          startIcon={<PlusIcon />}
        >
          New Application
        </Button>
      </div>

      {error && (
        <div className="p-4 mb-4 text-sm text-red-500 bg-red-100 rounded-lg dark:bg-red-900/50">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Name
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Domain
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Created At
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {applications.length > 0 ? (
                applications.map((app) => (
                  <TableRow 
                    key={`app-${app.application_id}`}
                    onClick={() => handleApplicationClick(app.application_id)}
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors"
                  >
                    <TableCell className="px-5 py-4 text-gray-800 text-theme-sm dark:text-white/90">
                      {app.name}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-gray-500 text-theme-sm dark:text-gray-400">
                      {app.domain}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-gray-500 text-theme-sm dark:text-gray-400">
                      {new Date(app.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              ) : !isLoading && (
                <TableRow key="no-applications">
                  <TableCell className="px-5 py-4 text-center text-gray-500 text-theme-sm dark:text-gray-400" colSpan={3}>
                    No applications found. Create your first application!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
      >
        <div className="p-6">
          <h3 className="mb-6 text-xl font-semibold text-gray-800 dark:text-white/90">
            Create New Application
          </h3>
          <Form onSubmit={handleCreateApplication} className="space-y-6">
            <div>
              <Label>Application Name</Label>
              <Input
                type="text"
                name="name"
                placeholder="Enter application name"
                required
              />
            </div>
            <div>
              <Label>Domain</Label>
              <Input
                type="text"
                name="domain"
                placeholder="Enter domain"
                required
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={closeModal}
              >
                Cancel
              </Button>
              <Button
                type="submit"
              >
                Create Application
              </Button>
            </div>
          </Form>
        </div>
      </Modal>
    </div>
  );
} 