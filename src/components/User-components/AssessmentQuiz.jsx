import React, { useState, useEffect, useCallback } from "react";
import axiosInstance from "../../utils/axiosinstance";
import { 
  Timer, ShieldAlert, Award, ChevronRight, 
  Lock, AlertCircle, RefreshCw, XCircle 
} from "lucide-react";

const QuizSystem = ({ courseId, onBack }) => {
  // --- Data States ---
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizDuration, setQuizDuration] = useState(0);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // --- Quiz Logic States ---
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);
  
  // --- Proctoring States ---
  const [warnings, setWarnings] = useState(0);
  const [showWarningModal, setShowWarningModal] = useState(false);

  // --- 1. Fetch Assessment Data ---
useEffect(() => {
  const fetchQuizData = async () => {
    console.log("Fetching quiz for Course ID:", courseId); // Debug 1
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/assessment/get_assessment/${courseId}`);
      
      console.log("API Response:", res.data); // Debug 2

      if (res.data.success && res.data.data) {
        const data = res.data.data;
        
        // Parse questions string to Array
        const parsedQuestions = typeof data.questions === 'string' 
          ? JSON.parse(data.questions) 
          : data.questions;

        if (Array.isArray(parsedQuestions)) {
          setQuizQuestions(parsedQuestions);
          setTimeLeft(data.duration_second || 300);
          setQuizDuration(data.duration_second || 300);
        } else {
          setFetchError("Invalid quiz format received.");
        }
      } else {
        setFetchError("No assessment found for this course.");
      }
    } catch (err) {
      console.error("Fetch Error:", err); // Debug 3
      setFetchError(err.response?.data?.message || "Failed to connect to server.");
    } finally {
      console.log("Loading Finished"); // Debug 4
      setLoading(false); // Yeh line loader ko stop karegi
    }
  };

  if (courseId) {
    fetchQuizData();
  } else {
    setLoading(false);
    setFetchError("Course ID is missing.");
  }
}, [courseId]);

  // --- 2. Window Management ---
  const toggleFullScreen = (action) => {
    if (action === "enter") {
      const doc = document.documentElement;
      if (doc.requestFullscreen) doc.requestFullscreen();
    } else {
      if (document.exitFullscreen && document.fullscreenElement) document.exitFullscreen();
    }
  };

  // --- 3. Final Submission Logic ---
  const handleFinalSubmit = useCallback(async () => {
    let correctCount = 0;
    quizQuestions.forEach((q, index) => {
      if (Number(selectedAnswers[index]) === Number(q.correct)) {
        correctCount += 1;
      }
    });

    const finalPercentage = (correctCount / quizQuestions.length) * 100;
    setScore(finalPercentage);
    setIsFinished(true);
    setQuizStarted(false);
    toggleFullScreen("exit");

    // Optional: Send result to backend here
    // await axiosInstance.post('/assessment/submit_score', { courseId, score: finalPercentage });
  }, [selectedAnswers, quizQuestions]);

  // --- 4. Timer & Anti-Cheat Logic ---
  useEffect(() => {
    if (!quizStarted || isFinished) return;

    if (timeLeft <= 0) {
      handleFinalSubmit();
      return;
    }

    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);

    const triggerWarning = () => {
      setWarnings((prev) => {
        const next = prev + 1;
        if (next >= 3) {
          handleFinalSubmit();
          return next;
        }
        setShowWarningModal(true);
        return next;
      });
    };

    const handleVisibility = () => { if (document.hidden) triggerWarning(); };
    const handleBlur = () => { triggerWarning(); };

    const blockKeys = (e) => {
      if (e.keyCode === 123 || (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74)) || 
          (e.ctrlKey && (e.keyCode === 67 || e.keyCode === 86 || e.keyCode === 85))) {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("keydown", blockKeys);
    const preventAction = (e) => e.preventDefault();
    document.addEventListener("copy", preventAction);
    document.addEventListener("paste", preventAction);
    document.addEventListener("contextmenu", preventAction);

    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("keydown", blockKeys);
      document.removeEventListener("copy", preventAction);
      document.removeEventListener("paste", preventAction);
      document.removeEventListener("contextmenu", preventAction);
    };
  }, [quizStarted, timeLeft, isFinished, handleFinalSubmit]);

  // --- Handlers ---
  const startQuiz = () => {
    setQuizStarted(true);
    toggleFullScreen("enter");
  };

  const handleOptionSelect = (qIndex, optIndex) => {
    setSelectedAnswers({ ...selectedAnswers, [qIndex]: optIndex });
  };

  const formatTime = (s) => {
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  // --- Conditional Rendering ---
  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <RefreshCw className="animate-spin text-indigo-600 mb-4" size={40} />
      <p className="text-slate-500 font-bold animate-pulse">Loading secure environment...</p>
    </div>
  );

  if (fetchError || quizQuestions.length === 0) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="text-center bg-white p-10 rounded-3xl shadow-xl max-w-sm border border-slate-100">
        <XCircle className="text-red-500 mx-auto mb-4" size={60} />
        <h2 className="text-xl font-black text-slate-800 mb-2">Assessment Unavailable</h2>
        <p className="text-slate-500 text-sm mb-6">{fetchError || "This course doesn't have an assessment yet."}</p>
        <button onClick={onBack} className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold">Back to Course</button>
      </div>
    </div>
  );

  if (!quizStarted && !isFinished) {
    return (
      <div className="max-w-2xl mx-auto mt-20 p-8 bg-white rounded-[40px] border-2 border-slate-100 shadow-2xl text-center">
        <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock className="text-indigo-600" size={40} />
        </div>
        <h1 className="text-3xl font-black text-slate-900 mb-4">Ready for the Exam?</h1>
        <div className="text-left space-y-4 mb-8 bg-slate-50 p-6 rounded-3xl border border-slate-200">
          <p className="flex items-start gap-3 text-sm font-bold text-slate-700">
            <AlertCircle className="text-red-500 shrink-0" size={18}/> 
            3-Strike Rule: You have 2 warnings. The 3rd focus loss will terminate the test.
          </p>
          <p className="flex items-start gap-3 text-sm font-bold text-slate-700">
            <AlertCircle className="text-indigo-500 shrink-0" size={18}/> 
            Time Limit: {formatTime(quizDuration)} to complete all questions.
          </p>
          <p className="flex items-start gap-3 text-sm font-bold text-slate-700">
            <AlertCircle className="text-indigo-500 shrink-0" size={18}/> 
            Environment: Full-screen mode will be enabled. No copy/paste allowed.
          </p>
        </div>
        <button onClick={startQuiz} className="w-full py-5 bg-indigo-600 text-white font-black rounded-3xl shadow-lg hover:bg-indigo-700 transition-all active:scale-95">
          Start Final Assessment
        </button>
      </div>
    );
  }

  if (isFinished) {
    const passed = score >= 70;
    return (
      <div className="max-w-xl mx-auto mt-20 p-10 bg-white rounded-[40px] shadow-2xl text-center border-t-8 border-indigo-500">
        {passed ? <Award size={80} className="text-green-500 mx-auto mb-4" /> : <ShieldAlert size={80} className="text-red-500 mx-auto mb-4" />}
        <h2 className="text-4xl font-black text-slate-900">{passed ? "Success!" : "Not Quite"}</h2>
        <p className="text-slate-500 text-lg mt-2 font-bold uppercase tracking-widest">Final Score: {score.toFixed(0)}%</p>
        <div className="mt-10 flex flex-col gap-3">
          {passed ? (
            <button className="bg-green-600 text-white py-4 rounded-2xl font-black shadow-xl hover:bg-green-700 transition-all">Claim Certificate</button>
          ) : (
            <button onClick={() => window.location.reload()} className="bg-slate-900 text-white py-4 rounded-2xl font-black transition-all">Retry Assessment</button>
          )}
          <button onClick={onBack} className="text-slate-400 font-bold py-2 mt-2">Return to Dashboard</button>
        </div>
      </div>
    );
  }

  const currentQ = quizQuestions[currentStep];

  return (
    <div className="fixed inset-0 bg-white z-[9999] p-6 overflow-y-auto select-none">
      {/* Warning Modal */}
      {showWarningModal && (
        <div className="fixed inset-0 bg-black/90 z-[10000] flex items-center justify-center p-4 backdrop-blur-md">
          <div className="bg-white p-8 rounded-[40px] max-w-sm w-full text-center shadow-2xl scale-in-center">
            <ShieldAlert size={64} className="text-red-500 mx-auto mb-4 animate-bounce" />
            <h2 className="text-2xl font-black text-red-600 uppercase italic">Warning {warnings}/3</h2>
            <p className="text-slate-600 my-6 font-bold leading-relaxed">
              Detection: Window focus lost. Please stay on this screen. The next violation will terminate your session.
            </p>
            <button onClick={() => setShowWarningModal(false)} className="bg-red-600 text-white w-full py-4 rounded-2xl font-black shadow-lg">
              I Understand, Continue
            </button>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto bg-white rounded-[40px] shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="p-8 bg-slate-900 flex justify-between items-center text-white">
          <div className="space-y-1">
            <span className="bg-indigo-500/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-400 border border-indigo-500/30">Live Proctored</span>
            <div className="flex items-center gap-4 mt-3">
              <span className="font-bold text-sm text-slate-300 tracking-wide">Question {currentStep + 1} of {quizQuestions.length}</span>
              <span className="text-red-400 text-[10px] font-black bg-red-400/10 px-2 py-1 rounded-lg border border-red-400/20">Strike: {warnings}/3</span>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white/5 px-6 py-4 rounded-3xl border border-white/10">
            <Timer size={22} className="text-indigo-400" />
            <span className={`font-black text-2xl tabular-nums ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-white'}`}>{formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* Question Area */}
        <div className="p-12">
          <h2 className="text-2xl font-black text-slate-900 mb-10 leading-snug">{currentQ.questions}</h2>
          <div className="grid gap-4">
            {currentQ.options.map((opt, i) => (
              <button 
                key={i} 
                onClick={() => handleOptionSelect(currentStep, i)}
                className={`p-6 rounded-3xl border-2 text-left font-bold transition-all flex items-center gap-4 ${
                  selectedAnswers[currentStep] === i 
                  ? "border-indigo-500 bg-indigo-50/50 text-indigo-900 ring-4 ring-indigo-500/10" 
                  : "border-slate-50 hover:border-slate-200 bg-slate-50/50 text-slate-600"
                }`}
              >
                <span className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center text-xs font-black transition-all ${
                  selectedAnswers[currentStep] === i ? 'bg-indigo-600 border-indigo-600 text-white rotate-6' : 'border-slate-200 text-slate-300'
                }`}>
                  {String.fromCharCode(65 + i)}
                </span>
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
          <button 
            disabled={currentStep === 0} 
            onClick={() => setCurrentStep(s => s - 1)} 
            className="text-slate-400 font-bold hover:text-slate-600 disabled:opacity-0 transition-all px-4"
          >
            Previous
          </button>
          
          <div className="flex gap-4">
            {currentStep === quizQuestions.length - 1 ? (
              <button 
                onClick={handleFinalSubmit} 
                className="bg-indigo-600 text-white px-12 py-5 rounded-[20px] font-black shadow-xl shadow-indigo-200 hover:shadow-indigo-300 transition-all active:scale-95"
              >
                Finish & Submit
              </button>
            ) : (
              <button 
                onClick={() => setCurrentStep(s => s + 1)} 
                className="bg-slate-900 text-white px-12 py-5 rounded-[20px] font-black flex items-center gap-2 hover:bg-black transition-all active:scale-95 shadow-xl"
              >
                Next Step <ChevronRight size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizSystem;