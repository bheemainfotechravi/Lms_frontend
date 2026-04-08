import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosinstance";
import { useSelector } from "react-redux";
import { Award, Download, Eye, Loader2, Trophy, Calendar, Hash } from "lucide-react";
import DashboardNavbar from "./DashboardNavbar";
import Footer from "../LandingPage/Footer";

export default function MyCertificates() {
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
     const [activeTab, setActiveTab] = useState("certificates");

    useEffect(() => {
        const fetchAllCertificates = async () => {
            try {
                setLoading(true);
                const res = await axiosInstance.get(`/assessment/generate_certificate/${user?.id}`);
                if (res.data.success) {
                    setCertificates(res.data.userData || []);
                }
            } catch (err) {
                console.error("Error fetching certificates:", err);
            } finally {
                setLoading(false);
            }
        };
        if (user?.id) fetchAllCertificates();
    }, [user?.id]);

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
            <Loader2 className="animate-spin text-indigo-600 mb-4" size={40} />
            <p className="text-slate-500 font-bold tracking-widest uppercase text-xs">Fetching your achievements...</p>
        </div>
    );

    return (
        <>
            <DashboardNavbar activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="min-h-screen bg-[#F6F1E7] py-8 px-4 md:px-8">
                <div className="max-w-6xl mx-auto">
                    {/* Header Section */}
                    <div className="mb-10 md:text-left">
                        <h1 className="text-3xl md:text-4xl font-black text-slate-900  md:justify-start gap-3">
                            Certification Gallery
                        </h1>
                        <p className="text-slate-500 font-medium mt-2">
                            All your hard-earned credentials in one place.
                        </p>
                    </div>

                    {certificates.length > 0 ? (
                        <div className="bg-white rounded-[32px] shadow-xl border border-slate-100 overflow-hidden">
                            {/* Desktop Table Header */}
                            <div className="hidden md:grid grid-cols-12 gap-4 p-6 bg-slate-900 text-white font-black text-xs uppercase tracking-widest">
                                <div className="col-span-5 flex items-center gap-2"><Award size={14}/> Course Name</div>
                                <div className="col-span-3 flex items-center gap-2">Certificate ID</div>
                                <div className="col-span-1 text-center">Score</div>
                                <div className="col-span-3 text-right">Actions</div>
                            </div>

                            {/* Certificate Rows */}
                            <div className="divide-y divide-slate-100">
                                {certificates.map((cert, index) => (
                                    <div 
                                        key={index} 
                                        className="grid grid-cols-1 md:grid-cols-12 gap-4 p-6 items-center hover:bg-slate-50 transition-colors group"
                                    >
                                        {/* Course Name - Mobile optimized */}
                                        <div className="col-span-1 md:col-span-5 flex items-center gap-4">
                                            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                                <Award size={24} />
                                            </div>
                                            <div>
                                                <h3 className="font-black text-slate-800 text-lg md:text-base leading-tight">
                                                    {cert.course_name}
                                                </h3>
                                                <p className="md:hidden text-xs font-bold text-slate-400 mt-1 uppercase tracking-tighter">
                                                    ID: {cert.certificate_no}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Certificate ID - Desktop Only */}
                                        <div className="hidden md:block col-span-3">
                                            <code className="text-xs font-mono bg-slate-100 px-3 py-1 rounded-lg text-slate-600">
                                                {cert.certificate_no}
                                            </code>
                                        </div>

                                        {/* Score */}
                                        <div className="col-span-1 text-center">
                                            <div className="inline-flex flex-col items-center">
                                                <span className="text-sm font-black text-indigo-600 md:text-lg">
                                                    {Math.round(cert.score)}%
                                                </span>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase md:hidden">Final Grade</span>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="col-span-1 md:col-span-3 flex md:justify-end gap-3 mt-4 md:mt-0">
                                            <button 
                                                onClick={() => navigate(`/certificate/${user?.id}`)}
                                                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-black active:scale-95 transition-all"
                                            >
                                                <Eye size={16} /> <span className="md:hidden lg:inline">View</span>
                                            </button>
                                            <button 
                                                onClick={() => navigate(`/certificate/${user?.id}`)}
                                                className="flex items-center justify-center p-3 bg-amber-50 text-amber-600 rounded-2xl hover:bg-amber-100 active:scale-95 transition-all shadow-sm"
                                                title="Download PDF"
                                            >
                                                <Download size={20} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        /* Empty State */
                        <div className="text-center py-24 bg-white rounded-[40px] border-4 border-dashed border-slate-200">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Award size={40} className="text-slate-200" />
                            </div>
                            <h2 className="text-2xl font-black text-slate-400">No Certificates Earned</h2>
                            <p className="text-slate-400 mt-2 max-w-xs mx-auto font-medium">
                                Start learning and complete assessments to unlock your official credentials.
                            </p>
                            <button 
                                onClick={() => navigate('/user/mycourses')}
                                className="mt-8 px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg hover:bg-indigo-700 transition-all active:scale-95"
                            >
                                Start Learning Now
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <Footer/>
        </>
    );
}