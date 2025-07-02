"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { UserIcon } from "@/icons";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { useAuth } from "../../context/AuthContext";

export const UserProfileButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(prev => !prev);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-dark-900 h-11 w-11 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white dropdown-toggle"
      >
        <UserIcon width="20" height="20" />
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900"
      >
        <div className="p-2">
          <DropdownItem
            onItemClick={closeDropdown}
            tag="a"
            href="/profile"
            className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
          >
            <svg
              className="fill-gray-500 group-hover:fill-gray-700 dark:fill-gray-400 dark:group-hover:fill-gray-300"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 3.5C7.30558 3.5 3.5 7.30558 3.5 12C3.5 14.1526 4.3002 16.1184 5.61936 17.616C6.17279 15.3096 8.24852 13.5955 10.7246 13.5955H13.2746C15.7509 13.5955 17.8268 15.31 18.38 17.6167C19.6996 16.119 20.5 14.153 20.5 12C20.5 7.30558 16.6944 3.5 12 3.5ZM17.0246 18.8566V18.8455C17.0246 16.7744 15.3457 15.0955 13.2746 15.0955H10.7246C8.65354 15.0955 6.97461 16.7744 6.97461 18.8455V18.856C8.38223 19.8895 10.1198 20.5 12 20.5C13.8798 20.5 15.6171 19.8898 17.0246 18.8566ZM2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM11.9991 7.25C10.8847 7.25 9.98126 8.15342 9.98126 9.26784C9.98126 10.3823 10.8847 11.2857 11.9991 11.2857C13.1135 11.2857 14.0169 10.3823 14.0169 9.26784C14.0169 8.15342 13.1135 7.25 11.9991 7.25ZM8.48126 9.26784C8.48126 7.32499 10.0563 5.75 11.9991 5.75C13.9419 5.75 15.5169 7.32499 15.5169 9.26784C15.5169 11.2107 13.9419 12.7857 11.9991 12.7857C10.0563 12.7857 8.48126 11.2107 8.48126 9.26784Z"
                fill=""
              />
            </svg>
            Account settings
          </DropdownItem>
          
          <DropdownItem
            onItemClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 font-medium text-red-600 rounded-lg group text-sm hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300"
          >
            <svg
              className="fill-red-500 group-hover:fill-red-700 dark:fill-red-400 dark:group-hover:fill-red-300"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.5 3.75C7.5 3.33579 7.16421 3 6.75 3C6.33579 3 6 3.33579 6 3.75V9.75C6 10.1642 6.33579 10.5 6.75 10.5C7.16421 10.5 7.5 10.1642 7.5 9.75V3.75ZM12.75 3C12.3358 3 12 3.33579 12 3.75V9.75C12 10.1642 12.3358 10.5 12.75 10.5C13.1642 10.5 13.5 10.1642 13.5 9.75V3.75C13.5 3.33579 13.1642 3 12.75 3ZM18 3.75C18 3.33579 17.6642 3 17.25 3C16.8358 3 16.5 3.33579 16.5 3.75V9.75C16.5 10.1642 16.8358 10.5 17.25 10.5C17.6642 10.5 18 10.1642 18 9.75V3.75ZM3.75 12C3.75 11.5858 4.08579 11 4.5 11H19.5C19.9142 11 20.25 11.5858 20.25 12C20.25 12.4142 19.9142 13 19.5 13H4.5C4.08579 13 3.75 12.4142 3.75 12ZM3.75 15.75C3.75 15.3358 4.08579 15 4.5 15H19.5C19.9142 15 20.25 15.3358 20.25 15.75C20.25 16.1642 19.9142 16.5 19.5 16.5H4.5C4.08579 16.5 3.75 16.1642 3.75 15.75ZM3.75 19.5C3.75 19.0858 4.08579 18.75 4.5 18.75H19.5C19.9142 18.75 20.25 19.0858 20.25 19.5C20.25 19.9142 19.9142 20.25 19.5 20.25H4.5C4.08579 20.25 3.75 19.9142 3.75 19.5Z"
                fill=""
              />
            </svg>
            Logout
          </DropdownItem>
        </div>
      </Dropdown>
    </div>
  );
}; 