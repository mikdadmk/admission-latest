"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

export default function Sidebar() {
    const { role, loading } = useAuth() || {};
    const [isOpen, setIsOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    // Ensure sidebar is visible when role is loaded
    useEffect(() => {
        if (!loading && role) {
            setIsVisible(true);
        }
    }, [loading, role]);

    // Close sidebar when clicking outside on small screens
    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (isOpen && !event.target.closest("#sidebar") && !event.target.closest("#sidebar-toggle")) {
                setIsOpen(false);
            }
        };
        document.addEventListener("click", handleOutsideClick);
        return () => document.removeEventListener("click", handleOutsideClick);
    }, [isOpen]);

    // Sidebar Links Configuration
    const sidebarLinks = {
        admin: [
            { section: "Home", links: [{ name: "Dashboard", path: "/admin" }, { name: "Users/Others", path: "/admin/users" }] },
            { section: "Institute", links: [{ name: "Institutes", path: "/admin/institutes" }] },
            { section: "Student", links: [{ name: "Applications", path: "/admin/application" }, { name: "Students", path: "/admin/students" }, { name: "Admit Card", path: "/admin/admitcard" }] },
            { section: "Notify Student", links: [{ name: "Notify Students", path: "/admin/notify-students" }, { name: "Notification Template", path: "/admin/notification-template" }] },
            { section: "Profile", links: [{ name: "Profile", path: "/admin/profile" }] },
        ],
        subadmin: [
            { section: "Profile", links: [{ name: "Profile", path: "/subadmin/profile" }] },
        ],
        user: [
            { section: "Profile", links: [{ name: "Profile", path: "/user/profile" }] },
        ]
    };

    return (
        <>
            {/* Toggle Button for Small Screens */}
            <button
                id="sidebar-toggle"
                className="md:hidden p-3 fixed top-4 left-4 bg-gray-800 text-white rounded-lg z-50"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar - Always Visible on Desktop, Toggle on Mobile */}
            <AnimatePresence>
                {isVisible && role && (
                    <motion.aside
                        id="sidebar"
                        className={`w-64 bg-green-800/90 backdrop-blur-md text-white p-4 min-h-screen fixed top-0 left-0 md:relative transition-transform duration-300 ease-in-out z-40 ${
                            isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                        }`}
                        initial={{ x: -300 }}
                        animate={{ x: isOpen || !loading ? 0 : -300 }}
                        exit={{ x: -300 }}
                    >
                        {/* Close Button for Mobile */}
                        <button className="md:hidden text-white absolute top-4 right-4" onClick={() => setIsOpen(false)}>
                            <X size={24} />
                        </button>

                        <ul>
                            {sidebarLinks[role]?.map((section) => (
                                <li key={section.section} className="mb-4">
                                    <h2 className="text-lg font-semibold mb-2">{section.section}</h2>
                                    <ul>
                                        {section.links.map((link) => (
                                            <li key={link.path} className="mb-2">
                                                <Link
                                                    href={link.path}
                                                    className="block p-2 hover:bg-white hover:text-black rounded"
                                                    onClick={() => setIsOpen(false)} // Close sidebar on click
                                                >
                                                    {link.name}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            ))}
                        </ul>
                    </motion.aside>
                )}
            </AnimatePresence>
        </>
    );
}
