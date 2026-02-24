// ProfileSettings.jsx
// Props:
//   profile — object from MOCK_PROFILE in dashboardData.js

import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const TABS = [
  { key: "profile",   label: "Profile Info",  icon: "👤" },
  { key: "security",  label: "Security",      icon: "🔐" },
  { key: "notifs",    label: "Notifications", icon: "🔔" },
  { key: "billing",   label: "Billing",       icon: "💳" },
];

export default function ProfileSettings({ profile = {user} }) {
   const { user, logout } = useAuth();
  const [activeTab, setActiveTab]   = useState("profile");
  const [formData, setFormData]     = useState({ ...profile });
  const [saved, setSaved]           = useState(false);
  const [editMode, setEditMode]     = useState(false);

  // Password form state
  const [pwForm, setPwForm] = useState({
    current: "", newPw: "", confirm: "",
  });

  // Notification preferences
  const [notifs, setNotifs] = useState({
    courseUpdates:  true,
    newMessages:    true,
    promotions:     false,
    weeklyDigest:   true,
    certReminders:  true,
    appPush:        false,
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    // 🔌 Replace with: PUT /api/student/profile
    setSaved(true);
    setEditMode(false);
    setTimeout(() => setSaved(false), 3000);
  };

  const handlePwSave = (e) => {
    e.preventDefault();
    // 🔌 Replace with: PUT /api/student/change-password
    alert("Password updated successfully!");
    setPwForm({ current: "", newPw: "", confirm: "" });
  };

  const toggleNotif = (key) =>
    setNotifs((prev) => ({ ...prev, [key]: !prev[key] }));

  const inputClass =
    "w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-300 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:opacity-60 disabled:cursor-not-allowed";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

      {/* ── Left: avatar card + tab menu ── */}
      <div className="lg:col-span-1 flex flex-col gap-4">

        {/* Avatar card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center text-center">
          <div className="relative mb-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-black text-2xl">
              {profile.avatar || "U"}
            </div>
            <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center text-sm hover:border-primary transition-all">
              ✏️
            </button>
          </div>
          <p className="text-gray-900 font-black text-sm">{formData.name}</p>
          <p className="text-gray-400 text-xs mt-0.5">{formData.email}</p>
          <span className="mt-2 text-xs font-semibold bg-violet-50 text-primary border border-violet-100 px-3 py-1 rounded-full">
            Student
          </span>
          <p className="text-gray-400 text-xs mt-3">
            Member since {profile.joinedDate}
          </p>
        </div>

        {/* Tab menu */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`w-full flex items-center gap-3 px-5 py-3.5 text-sm font-semibold transition-all text-left border-l-2
                ${activeTab === tab.key
                  ? "border-primary bg-violet-50 text-primary"
                  : "border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Right: tab content ── */}
      <div className="lg:col-span-3">

        {/* ════ PROFILE INFO ════ */}
        {activeTab === "profile" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
              <h3 className="text-gray-900 font-black text-sm">Profile Information</h3>
              <div className="flex items-center gap-2">
                {saved && (
                  <span className="text-emerald-600 text-xs font-semibold bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">
                    ✓ Saved!
                  </span>
                )}
                <button
                  onClick={() => setEditMode(!editMode)}
                  className={`text-xs font-bold px-4 py-2 rounded-xl border transition-all
                    ${editMode
                      ? "border-gray-200 text-gray-500 hover:bg-gray-50"
                      : "border-primary text-primary hover:bg-violet-50"
                    }`}
                >
                  {editMode ? "Cancel" : "✏️ Edit Profile"}
                </button>
              </div>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-5">

              {/* Name + Email row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Full Name</label>
                  <input
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!editMode}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email Address</label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!editMode}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Phone + Location row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Phone Number</label>
                  <input
                    name="phone"
                    type="text"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!editMode}
                    placeholder="+91 00000 00000"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Location</label>
                  <input
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleChange}
                    disabled={!editMode}
                    placeholder="City, State"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Bio</label>
                <textarea
                  name="bio"
                  rows={3}
                  value={formData.bio}
                  onChange={handleChange}
                  disabled={!editMode}
                  placeholder="Tell us a little about yourself..."
                  className={`${inputClass} resize-none`}
                />
              </div>

              {/* Save button */}
              {editMode && (
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-primary to-secondary text-white font-bold text-sm px-8 py-2.5 rounded-xl hover:opacity-90 hover:-translate-y-0.5 transition-all"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </form>
          </div>
        )}

        {/* ════ SECURITY ════ */}
        {activeTab === "security" && (
          <div className="space-y-5">
            {/* Change password */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-50">
                <h3 className="text-gray-900 font-black text-sm">Change Password</h3>
                <p className="text-gray-400 text-xs mt-0.5">Use a strong password with 8+ characters</p>
              </div>
              <form onSubmit={handlePwSave} className="p-6 space-y-4">
                {[
                  { name: "current", label: "Current Password",  placeholder: "••••••••" },
                  { name: "newPw",   label: "New Password",      placeholder: "Min. 8 characters" },
                  { name: "confirm", label: "Confirm New Password", placeholder: "Re-enter new password" },
                ].map((f) => (
                  <div key={f.name}>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">{f.label}</label>
                    <input
                      type="password"
                      name={f.name}
                      placeholder={f.placeholder}
                      value={pwForm[f.name]}
                      onChange={(e) => setPwForm((p) => ({ ...p, [f.name]: e.target.value }))}
                      className={inputClass}
                    />
                  </div>
                ))}
                <div className="flex justify-end pt-1">
                  <button type="submit"
                    className="bg-gradient-to-r from-primary to-secondary text-white font-bold text-sm px-8 py-2.5 rounded-xl hover:opacity-90 transition-all">
                    Update Password
                  </button>
                </div>
              </form>
            </div>

            {/* Danger zone */}
            <div className="bg-white rounded-2xl border border-red-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-red-50">
                <h3 className="text-red-600 font-black text-sm">⚠️ Danger Zone</h3>
              </div>
              <div className="p-6 flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <p className="text-gray-900 text-sm font-bold">Delete Account</p>
                  <p className="text-gray-400 text-xs mt-0.5">
                    Permanently delete your account and all data. This cannot be undone.
                  </p>
                </div>
                <button className="border border-red-300 text-red-500 text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-red-50 transition-all shrink-0">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ════ NOTIFICATIONS ════ */}
        {activeTab === "notifs" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50">
              <h3 className="text-gray-900 font-black text-sm">Notification Preferences</h3>
              <p className="text-gray-400 text-xs mt-0.5">Choose what you want to be notified about</p>
            </div>
            <div className="divide-y divide-gray-50">
              {[
                { key: "courseUpdates", label: "Course Updates",    desc: "Notify when your enrolled courses are updated" },
                { key: "newMessages",   label: "New Messages",      desc: "Receive messages from instructors"              },
                { key: "promotions",    label: "Promotions & Offers",desc: "Deals, discounts and special offers"           },
                { key: "weeklyDigest",  label: "Weekly Digest",     desc: "Your weekly learning summary email"            },
                { key: "certReminders", label: "Certificate Reminders",desc: "Reminders to complete courses for certificates"},
                { key: "appPush",       label: "Push Notifications", desc: "Browser and mobile push notifications"        },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div>
                    <p className="text-gray-900 text-sm font-semibold">{item.label}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{item.desc}</p>
                  </div>
                  {/* Toggle switch */}
                  <button
                    onClick={() => toggleNotif(item.key)}
                    className={`relative w-11 h-6 rounded-full transition-all duration-300 shrink-0
                      ${notifs[item.key] ? "bg-primary" : "bg-gray-200"}`}
                  >
                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-300
                      ${notifs[item.key] ? "left-5" : "left-0.5"}`}
                    />
                  </button>
                </div>
              ))}
            </div>
            <div className="px-6 py-4 border-t border-gray-50 flex justify-end">
              <button className="bg-gradient-to-r from-primary to-secondary text-white font-bold text-sm px-8 py-2.5 rounded-xl hover:opacity-90 transition-all">
                Save Preferences
              </button>
            </div>
          </div>
        )}

        {/* ════ BILLING ════ */}
        {activeTab === "billing" && (
          <div className="space-y-5">
            {/* Current plan */}
            <div className="bg-gradient-to-r from-violet-50 to-cyan-50 border border-violet-100 rounded-2xl p-6 flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Current Plan</p>
                <p className="text-gray-900 font-black text-xl">Free Plan</p>
                <p className="text-gray-500 text-xs mt-1">Access to 50+ free courses</p>
              </div>
              <button className="bg-gradient-to-r from-primary to-secondary text-white font-bold text-sm px-6 py-2.5 rounded-xl hover:opacity-90 hover:-translate-y-0.5 transition-all shadow-md">
                🚀 Upgrade to Pro
              </button>
            </div>

            {/* Payment history */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-50">
                <h3 className="text-gray-900 font-black text-sm">Payment History</h3>
              </div>
              <div className="divide-y divide-gray-50">
                {[
                  { title: "UI/UX Design Masterclass", date: "Jan 15, 2025", amount: "₹999",  status: "Paid" },
                  { title: "JavaScript Advanced",       date: "Nov 3, 2024",  amount: "₹799",  status: "Paid" },
                ].map((p, i) => (
                  <div key={i} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div>
                      <p className="text-gray-900 text-sm font-semibold">{p.title}</p>
                      <p className="text-gray-400 text-xs mt-0.5">{p.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-900 text-sm font-black">{p.amount}</p>
                      <span className="text-emerald-600 text-xs font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                        {p.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}