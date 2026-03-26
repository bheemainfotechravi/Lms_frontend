import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosinstance";
import { 
  Timer, ShieldAlert, Award, ChevronRight, 
  Lock, AlertCircle, RefreshCw, XCircle, Loader2, Clock, Ban 
} from "lucide-react";

const QuizSystem = ({ id: propCourseId, onBack }) => {
  const { id: urlId } = useParams(); 
  const navigate = useNavigate();
  const courseId = propCourseId || urlId; 
  
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizDuration, setQuizDuration] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [attemptError, setAttemptError] = useState(null); // New state for attempt limit

  const [quizStarted, setQuizStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [warnings, setWarnings] = useState(0);
  
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [isTerminated, setIsTerminated] = useState(false);

  useEffect(() => {
    const initializeQuiz = async () => {
      try {
        setLoading(true);

        const attemptRes = await axiosInstance.get(`/assessment/check_attempts`);
  
        if (attemptRes.data.isBlocked) {
          setAttemptError(attemptRes.data.message || "Assessment is currently locked.");
          setLoading(false);
          return;
        }
        const res = await axiosInstance.get(`/assessment/get_assessment/${courseId}`);
        if (res.data.success && res.data.assessment && res.data.assessment[0]) {
          const questionsArray = res.data.assessment[0];
          if (Array.isArray(questionsArray) && questionsArray.length > 0) {
            const formattedQuestions = questionsArray.map(q => ({
              assessment_id: q.assessment_id,
              questions: q.question, 
              options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
              correct: q.correct_option || 0 
            }));
            setQuizQuestions(formattedQuestions);
            const duration = questionsArray[0].duration_seconds || 300;
            setTimeLeft(duration);
            setQuizDuration(duration);
            setFetchError(null);
          }
        }
      } catch (err) {
        console.error("Init Error:", err);
        // Agar API 403 error bhej rahi hai blocked ke liye
        if (err.response?.data?.isBlocked) {
            setAttemptError(err.response.data.message);
        } else {
            setFetchError("Failed to initialize assessment.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (courseId && courseId !== ":id") initializeQuiz();
  }, [courseId]);


  const toggleFullScreen = (action) => {
    if (action === "enter") {
      const doc = document.documentElement;
      if (doc.requestFullscreen) doc.requestFullscreen();
    } else {
      if (document.exitFullscreen && document.fullscreenElement) document.exitFullscreen();
    }
  };

  // --- 3. SUBMIT ASSESSMENT ---
  const handleFinalSubmit = useCallback(async () => {
    if (submitting) return;
    const assessment_ids = quizQuestions.map(q => q.assessment_id);
    const answers = quizQuestions.map((_, index) => 
        selectedAnswers[index] !== undefined ? selectedAnswers[index] : null
    );

    try {
      setSubmitting(true);
      const response = await axiosInstance.post(`/assessment/submit_assessment/${courseId}`, {
        assessment_ids,
        answers
      });
      if (response.data.success) {
        setScore(response.data.score || 0); 
        setIsFinished(true);
        setQuizStarted(false);
        toggleFullScreen("exit");
      }
    } catch (err) {
      alert("Failed to submit. Assessment may have already closed.");
    } finally {
      setSubmitting(false);
    }
  }, [selectedAnswers, quizQuestions, courseId, submitting]);

  useEffect(() => {
    if (!quizStarted || isFinished || isTerminated || isTimeUp) return;

    if (timeLeft <= 0) {
      toggleFullScreen("exit");
      setIsTimeUp(true);
      return;
    }

    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);

    const triggerWarning = () => {
      setWarnings((prev) => {
        const next = prev + 1;
        if (next >= 3) {
          toggleFullScreen("exit");
          setIsTerminated(true);
          return next;
        }
        setShowWarningModal(true);
        return next;
      });
    };

    const handleVisibility = () => { if (document.hidden) triggerWarning(); };
    const handleBlur = () => { triggerWarning(); };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("blur", handleBlur);

    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("blur", handleBlur);
    };
  }, [quizStarted, timeLeft, isFinished, isTerminated, isTimeUp]);

  const startQuiz = () => { setQuizStarted(true); toggleFullScreen("enter"); };
  const handleOptionSelect = (qIndex, optIndex) => {
    setSelectedAnswers({ ...selectedAnswers, [qIndex]: optIndex });
  };
  const formatTime = (s) => {
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  // --- UI Renders ---

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <RefreshCw className="animate-spin text-indigo-600 mb-4" size={40} />
      <p className="text-slate-500 font-bold">Checking credentials...</p>
    </div>
  );

  // Attempt Limit Reached Screen
  if (attemptError) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="text-center bg-white p-10 rounded-[40px] shadow-xl max-w-md border border-red-100">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Ban className="text-red-500" size={40} />
        </div>
        <h2 className="text-2xl font-black text-slate-800 mb-2">Access Denied</h2>
        <p className="text-slate-500 font-bold mb-8 leading-relaxed">{attemptError}</p>
        <button 
          onClick={() => navigate('/user/mycourses')} 
          className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black shadow-lg"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );

 if (attemptError) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="text-center bg-white p-12 rounded-[50px] shadow-2xl max-w-md border border-amber-100">
        <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="text-amber-500" size={48} />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-4">Attempt Locked</h2>
        <p className="text-slate-500 font-bold mb-10 leading-relaxed">
          {attemptError} {/* "You already scored 90%+..." message yahan dikhega */}
        </p>
        <button 
          onClick={() => navigate('/user/mycourses')} 
          className="w-full py-5 bg-slate-900 text-white rounded-3xl font-black shadow-xl hover:bg-black transition-all active:scale-95"
        >
          Back to My Courses
        </button>
      </div>
    </div>
  );

  if (isTerminated || isTimeUp) {
      return (
        <div className="fixed inset-0 bg-slate-900/90 flex items-center justify-center p-4 z-[10001] backdrop-blur-sm">
            <div className="bg-white p-10 rounded-[40px] max-w-md w-full text-center shadow-2xl">
                {isTerminated ? <ShieldAlert size={80} className="text-red-500 mx-auto mb-6" /> : <Clock size={80} className="text-amber-500 mx-auto mb-6" />}
                <h2 className="text-2xl font-black text-slate-900 mb-4">
                    {isTerminated ? "Assessment Terminated" : "Time's Up!"}
                </h2>
                <p className="text-slate-600 mb-8 font-bold leading-relaxed">
                    {isTerminated 
                      ? "You changed the window 3 times. Please restart the test from the dashboard." 
                      : "The time allowed for this assessment has ended."}
                </p>
                <button 
                  onClick={() => navigate('/user/mycourses')} 
                  className="bg-slate-900 text-white w-full py-4 rounded-2xl font-black shadow-lg"
                >
                    OK, Go to Dashboard
                </button>
            </div>
        </div>
      )
  }

  if (fetchError || quizQuestions.length === 0) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="text-center bg-white p-10 rounded-3xl shadow-xl max-w-sm border border-slate-100">
        <XCircle className="text-red-500 mx-auto mb-4" size={60} />
        <h2 className="text-xl font-black text-slate-800 mb-2">Unavailable</h2>
        <p className="text-slate-500 text-sm mb-6">{fetchError || "No questions found."}</p>
        <button onClick={() => navigate('/user/mycourses')} className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold">Back to Dashboard</button>
      </div>
    </div>
  );

  if (!quizStarted && !isFinished) {
    return (
      <div className="max-w-2xl mx-auto mt-20 p-8 bg-white rounded-[40px] border-2 border-slate-100 shadow-2xl text-center">
        <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock className="text-indigo-600" size={40} />
        </div>
        <h1 className="text-3xl font-black text-slate-900 mb-4">Exam Certification</h1>
        <div className="text-left space-y-4 mb-8 bg-slate-50 p-6 rounded-3xl border border-slate-200">
          <p className="flex items-start gap-3 text-sm font-bold text-slate-700"><AlertCircle className="text-red-500 shrink-0" size={18}/> Strike Rule: 3 window focus losses will terminate the test.</p>
          <p className="flex items-start gap-3 text-sm font-bold text-slate-700"><AlertCircle className="text-indigo-500 shrink-0" size={18}/> Time: {formatTime(quizDuration)} remaining once started.</p>
          <p className="flex items-start gap-3 text-sm font-bold text-slate-700"><AlertCircle className="text-indigo-500 shrink-0" size={18}/> Security: Full-screen and copy/paste protection active.</p>
        </div>
        <button onClick={startQuiz} className="w-full py-5 bg-indigo-600 text-white font-black rounded-3xl shadow-lg hover:bg-indigo-700 transition-all active:scale-95">
          Start Assessment
        </button>
      </div>
    );
  }

  if (isFinished) {
    const passed = score >= 70;
    return (
      <div className="max-w-xl mx-auto mt-20 p-10 bg-white rounded-[40px] shadow-2xl text-center border-t-8 border-indigo-500">
        {passed ? <Award size={80} className="text-green-500 mx-auto mb-4" /> : <ShieldAlert size={80} className="text-red-500 mx-auto mb-4" />}
        <h2 className="text-4xl font-black text-slate-900">{passed ? "Qualified!" : "Try Again"}</h2>
        <p className="text-slate-500 text-lg mt-2 font-bold uppercase tracking-widest">Final Score: {score}%</p>
        <div className="mt-10 flex flex-col gap-3">
          {passed ? (
            <button className="bg-green-600 text-white py-4 rounded-2xl font-black shadow-xl hover:bg-green-700">Claim Certificate</button>
          ) : (
            <button onClick={() => window.location.reload()} className="bg-slate-900 text-white py-4 rounded-2xl font-black">Restart Exam</button>
          )}
          <button onClick={() => navigate('/user/mycourses')} className="text-slate-400 font-bold py-2">Return to Dashboard</button>
        </div>
      </div>
    );
  }

  const currentQ = quizQuestions[currentStep];

  return (
    <div className="fixed inset-0 bg-white z-[9999] p-6 overflow-y-auto select-none">
      {showWarningModal && !isTerminated && (
        <div className="fixed inset-0 bg-black/90 z-[10000] flex items-center justify-center p-4 backdrop-blur-md">
          <div className="bg-white p-8 rounded-[40px] max-w-sm w-full text-center shadow-2xl">
            <ShieldAlert size={64} className="text-red-500 mx-auto mb-4 animate-bounce" />
            <h2 className="text-2xl font-black text-red-600 uppercase">Warning {warnings}/3</h2>
            <p className="text-slate-600 my-6 font-bold leading-relaxed">Detection: Focus lost. Stay on this screen or the session will end.</p>
            <button onClick={() => setShowWarningModal(false)} className="bg-red-600 text-white w-full py-4 rounded-2xl font-black">Continue Test</button>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto bg-white rounded-[40px] shadow-2xl border border-slate-100 overflow-hidden">
        <div className="p-8 bg-slate-900 flex justify-between items-center text-white">
          <div className="space-y-1">
            <span className="bg-indigo-500/20 px-3 py-1 rounded-full text-[10px] font-black text-indigo-400 border border-indigo-500/30">SECURE SESSION</span>
            <div className="flex items-center gap-4 mt-3">
              <span className="font-bold text-sm text-slate-300">Question {currentStep + 1} of {quizQuestions.length}</span>
              <span className="text-red-400 text-[10px] font-black bg-red-400/10 px-2 py-1 rounded-lg">Strikes: {warnings}/3</span>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white/5 px-6 py-4 rounded-3xl border border-white/10">
            <Timer size={22} className="text-indigo-400" />
            <span className={`font-black text-2xl tabular-nums ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-white'}`}>{formatTime(timeLeft)}</span>
          </div>
        </div>

        <div className="p-12">
          <h2 className="text-2xl font-black text-slate-900 mb-10 leading-snug">{currentQ?.questions}</h2>
          <div className="grid gap-4">
            {currentQ?.options?.map((opt, i) => (
              <button 
                key={i} 
                onClick={() => handleOptionSelect(currentStep, i)}
                className={`p-6 rounded-3xl border-2 text-left font-bold transition-all flex items-center gap-4 ${
                  selectedAnswers[currentStep] === i 
                  ? "border-indigo-500 bg-indigo-50/50 text-indigo-900 ring-4 ring-indigo-500/10" 
                  : "border-slate-50 hover:border-slate-200 bg-slate-50/50 text-slate-600"
                }`}
              >
                <span className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center text-xs font-black ${
                  selectedAnswers[currentStep] === i ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-200 text-slate-300'
                }`}>
                  {String.fromCharCode(65 + i)}
                </span>
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
          <button 
            disabled={currentStep === 0 || submitting} 
            onClick={() => setCurrentStep(s => s - 1)} 
            className="text-slate-400 font-bold px-4 disabled:opacity-20"
          >
            Previous
          </button>
          
          <div className="flex gap-4">
            {currentStep === quizQuestions.length - 1 ? (
              <button 
                onClick={handleFinalSubmit} 
                disabled={submitting}
                className="bg-indigo-600 text-white px-12 py-5 rounded-[20px] font-black shadow-xl flex items-center gap-2 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-70"
              >
                {submitting ? <Loader2 className="animate-spin" size={20} /> : "Finish & Submit"}
              </button>
            ) : (
              <button 
                onClick={() => setCurrentStep(s => s + 1)} 
                className="bg-slate-900 text-white px-12 py-5 rounded-[20px] font-black flex items-center gap-2 hover:bg-black transition-all active:scale-95 shadow-xl"
              >
                Next <ChevronRight size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizSystem;