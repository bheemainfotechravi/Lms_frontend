import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosinstance";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import PlatformLogo from "../../assets/Platform.png";
import JavaLogo from "../../assets/java.png";
import { Download, ArrowLeft, Loader2, Award, XCircle, ShieldCheck } from "lucide-react";

export default function CertificateView() {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const certificateRef = useRef();
    
    const [certData, setCertData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCertificateDetails = async () => {
            try {
                setLoading(true);
                const res = await axiosInstance.get(`/assessment/generate_certificate/${id}`);
                if (res.data.success && res.data.userData?.length > 0) {
                    const data = res.data.userData[0];
                    setCertData({
                        fullName: `${data.first_name} ${data.last_name}`,
                        courseName: data.course_name,
                        score: data.score,
                        certificateId: data.certificate_no,
                        issueDate: new Date(data.issued_at).toLocaleDateString('en-GB', {
                            day: 'numeric', month: 'long', year: 'numeric'
                        })
                    });
                } else {
                    setError(res.data.message || "No records found.");
                }
            } catch (err) {
                setError("Verification failed.");
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchCertificateDetails();
    }, [id]);

    const downloadPDF = async () => {
        const element = certificateRef.current;
        try {
            const canvas = await html2canvas(element, {
                scale: 3,
                useCORS: true,
                backgroundColor: "#ffffff",
            });
            
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF({
                orientation: "landscape",
                unit: "mm",
                format: "a4"
            });

            pdf.addImage(imgData, "PNG", 0, 0, 297, 210); // A4 Landscape size
            pdf.save(`Certificate_${certData?.fullName.replace(/\s+/g, '_')}.pdf`);
        } catch (err) {
            alert("Export failed. Please try again.");
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
    if (error) return <div className="min-h-screen flex items-center justify-center">Error: {error}</div>;

    return (
        <div className="min-h-screen bg-slate-200 py-12 flex flex-col items-center font-sans">
            {/* Action Bar */}
            <div className="w-full max-w-[1100px] flex justify-between mb-8 p-4 bg-white/50 rounded-2xl">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 font-bold text-slate-700 hover:text-indigo-600 transition">
                    <ArrowLeft size={20}/> BACK TO DASHBOARD
                </button>
                <button 
                    onClick={downloadPDF} 
                    className="bg-[#D68D06] text-white px-8 py-3 rounded-xl font-black shadow-lg hover:brightness-110 active:scale-95 transition-all"
                >
                    DOWNLOAD PDF CERTIFICATE
                </button>
            </div>

            {/* Certificate Container */}
            <div style={{ background: '#ffffff', boxShadow: '0 20px 50px rgb(0, 0, 0)' }}>
                <div 
                    ref={certificateRef} 
                    style={{
                        width: '1123px',
                        height: '794px',
                        backgroundColor: '#ffffff',
                        color: '#1e293b',
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '30px solid #ff9100b2', 
                        boxSizing: 'border-box'
                    }}
                >
                    {/* Golden Ribbon Decoration */}
                    <div style={{ position: 'absolute', top: 0, right: '100px', width: '70px', height: '220px', backgroundColor: '#D68D06', display: 'flex', justifyContent: 'center' }}>
                        <div style={{ 
                            position: 'absolute', bottom: '-40px', width: '100px', height: '100px', 
                            backgroundColor: '#ffffff', border: '8px solid #D68D06', borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                             <ShieldCheck style={{ color: '#D68D06' }} size={50} />
                        </div>
                    </div>

                    {/* Content Wrapper */}
                    <div style={{ textAlign: 'center', width: '100%', padding: '0 100px', zIndex: 10 }}>
                        <img src={PlatformLogo} alt="Logo" style={{ height: '55px', marginBottom: '30px' }} />
                        
                        <h1 style={{ fontSize: '85px', fontWeight: '900', color: '#0f172a',  marginTop: '-180px', letterSpacing: '-2px' }}>CERTIFICATE</h1>
                        {/* <p style={{ fontSize: '22px', letterSpacing: '8px', color: '#64748b', fontWeight: '300' }}>OF COMPLETION</p> */}

                        <p style={{ fontSize: '16px', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase' }}>This award is presented to</p>
                        
                        <div style={{ borderBottom: '3px solid #0f172a', display: 'inline-block', padding: '0 60px', marginBottom: '40px' }}>
                            <h2 style={{ fontSize: '55px', fontWeight: '900', fontStyle: 'italic', color: '#0f172a', margin: '0 0 5px 0' }}>{certData?.fullName}</h2>
                        </div>

                        <div style={{ maxWidth: '850px', marginTop:'-30px', margin: ' auto' }}>
                            <p style={{ fontSize: '19px', color: '#475569', lineHeight: '1.5', fontWeight: '500' }}>
                                For successfully demonstrating and completing requirements for the professional certification in
                            </p>
                            <h3 style={{ fontSize: '32px', fontWeight: '900', color: '#0f172a', textTransform: 'uppercase', lineHeight: '1.2' }}>
                                {certData?.courseName}
                            </h3>
                        </div>
                    </div>

                    {/* Footer Section */}
                    <div style={{ position: 'absolute', bottom: '80px', width: '100%', padding: '0 100px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        {/* Left: Badge */}
                        <div style={{ textAlign: 'center' }}>
                            <img src={JavaLogo} alt="Badge" style={{ height: '70px', marginBottom: '10px' }} />
                            <p style={{ fontSize: '11px', fontWeight: '900', color: '#D68D06', letterSpacing: '1px' }}>CERTIFIED GRADUATE</p>
                        </div>

                        {/* Center: Details */}
                        <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '11px', border: '1px solid #f1f5f9', marginTop:'50px' , padding: '15px 25px', borderRadius: '15px' }}>
                            <p style={{ fontWeight: '800', color: '#1e293b', marginBottom: '5px' }}>VERIFICATION ID: {certData?.certificateId}</p>
                            <p>Final Assessment Score: <span style={{ fontWeight: 'bold', color: '#0f172a' }}>{certData?.score}%</span></p>
                            <p style={{ marginTop: '5px', fontWeight: '700', color: '#64748b' }}>ISSUED ON: {certData?.issueDate}</p>
                        </div>

                        {/* Right: Signature */}
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ width: '220px', height: '2px', backgroundColor: '#0f172a', marginBottom: '12px' }} />
                            <p style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '700', letterSpacing: '1px' }}>DIRECTOR OF EDUCATION</p>
                            <p style={{ fontSize: '28px', fontWeight: '900', fontStyle: 'italic', color: '#0f172a', marginTop: '5px' }}>BheemaInfo</p>
                        </div>
                    </div>

                    {/* Subtle Background Pattern */}
                    <div style={{ position: 'absolute', inset: 0, opacity: 0.03, pointerEvents: 'none', backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
                </div>
            </div>
        </div>
    );
}