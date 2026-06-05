'use client';

import { useState } from 'react';
import {
  Settings,
  Shield,
  Bell,
  User,
  LogOut,
  Lock
} from 'lucide-react';

export default function DashboardSettings() {
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [publicProfile, setPublicProfile] = useState(true);

  return (
    <div className="max-w-5xl mx-auto space-y-8">

      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Settings
        </h1>
        <p className="text-gray-400">
          Manage your account preferences and security.
        </p>
      </div>

      {/* Security */}
      <div className="glass rounded-2xl p-6 border border-white/10">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold text-white">
            Security
          </h2>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-medium">
              Change Password
            </h3>
            <p className="text-sm text-gray-400">
              Update your account password
            </p>
          </div>

          <button
            onClick={() => setShowPasswordModal(true)}
            className="px-4 py-2 bg-primary rounded-lg text-white"
          >
            Change Password
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="glass rounded-2xl p-6 border border-white/10">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold text-white">
            Notifications
          </h2>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-medium">
              Email Notifications
            </h3>
            <p className="text-sm text-gray-400">
              Receive event and club updates
            </p>
          </div>

          <input
            type="checkbox"
            checked={emailNotifications}
            onChange={() =>
              setEmailNotifications(!emailNotifications)
            }
            className="w-5 h-5"
          />
        </div>
      </div>

      {/* Profile */}
      <div className="glass rounded-2xl p-6 border border-white/10">
        <div className="flex items-center gap-3 mb-6">
          <User className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold text-white">
            Profile
          </h2>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-medium">
              Public Profile
            </h3>
            <p className="text-sm text-gray-400">
              Allow others to view your profile
            </p>
          </div>

          <input
            type="checkbox"
            checked={publicProfile}
            onChange={() =>
              setPublicProfile(!publicProfile)
            }
            className="w-5 h-5"
          />
        </div>
      </div>

      {/* Future Features */}
      <div className="glass rounded-2xl p-6 border border-white/10">
        <div className="flex items-center gap-3 mb-6">
          <Settings className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold text-white">
            Coming Soon
          </h2>
        </div>

        <ul className="space-y-3 text-gray-400">
          <li>• Theme Settings</li>
          <li>• Two-Factor Authentication</li>
          <li>• Session Management</li>
          <li>• Account Deletion</li>
        </ul>
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

          <div className="w-full max-w-md bg-[#111827] rounded-2xl p-6 border border-white/10">

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">
                Change Password
              </h2>

              <button
                onClick={() => setShowPasswordModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">

              <input
                type="password"
                placeholder="Current Password"
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white"
              />

              <input
                type="password"
                placeholder="New Password"
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white"
              />

              <input
                type="password"
                placeholder="Confirm New Password"
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white"
              />

              <button
                className="w-full bg-primary py-3 rounded-lg text-white font-medium"
              >
                Update Password
              </button>

            </div>

          </div>

        </div>
      )}
    </div>
  );
}