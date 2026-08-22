import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, MapPin, Mail, Phone, Globe, Calendar, Edit2, Key, Check, X } from 'lucide-react';
import { updateProfile, changePassword } from '../api/auth';
import type { UpdateProfilePayload } from '../types';
import FormField from '../components/FormField';

export default function UserProfile() {
  const { user, updateUser } = useAuth();
  
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState<UpdateProfilePayload>({
    name: user?.name || '',
    phone: user?.phone || '',
    city: user?.city || '',
    country: user?.country || '',
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState('');
  
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  if (!user) return null;

  const memberSince = new Date(user.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const initials = user.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  const infoItems = [
    { icon: Mail, label: 'Email', value: user.email },
    { icon: Phone, label: 'Phone', value: user.phone || 'Not provided' },
    { icon: MapPin, label: 'City', value: user.city || 'Not provided' },
    { icon: Globe, label: 'Country', value: user.country || 'Not provided' },
    { icon: Calendar, label: 'Member Since', value: memberSince },
  ];

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError('');
    setProfileLoading(true);
    try {
      const updatedUser = await updateProfile(profileForm);
      updateUser(updatedUser);
      setIsEditingProfile(false);
    } catch (err: any) {
      setProfileError(err.error?.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    
    setPasswordLoading(true);
    try {
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordSuccess('Password changed successfully');
      setIsChangingPassword(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setPasswordSuccess(''), 3000);
    } catch (err: any) {
      setPasswordError(err.error?.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      {/* Profile Header */}
      <div className="glass-card rounded-3xl p-8 border border-white/10 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-accent-500/10 pointer-events-none" />
        <div className="relative z-10">
          {user.photoUrl ? (
            <img
              src={user.photoUrl}
              alt={user.name}
              className="w-28 h-28 rounded-full object-cover mx-auto border-4 border-primary-500/30 shadow-xl shadow-primary-500/20"
            />
          ) : (
            <div className="w-28 h-28 rounded-full gradient-primary flex items-center justify-center mx-auto text-4xl font-bold text-white shadow-xl shadow-primary-500/20 border-4 border-primary-500/30">
              {initials}
            </div>
          )}

          <h1 className="text-3xl font-bold text-white mt-6 mb-1">{user.name}</h1>
          <p className="text-surface-400 text-lg">{user.email}</p>

          {(user.city || user.country) && (
            <p className="text-surface-500 mt-2 flex items-center justify-center gap-1.5">
              <MapPin className="w-4 h-4" />
              {[user.city, user.country].filter(Boolean).join(', ')}
            </p>
          )}
        </div>
      </div>

      {passwordSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-xl flex items-center gap-2">
          <Check className="w-5 h-5" />
          {passwordSuccess}
        </div>
      )}

      {/* Edit Profile Form */}
      {isEditingProfile && (
        <div className="glass-card rounded-2xl border border-white/10 p-6 animate-fade-in-up">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Edit2 className="w-5 h-5 text-primary-400" />
              Edit Profile
            </h2>
            <button onClick={() => setIsEditingProfile(false)} className="btn-icon">
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            {profileError && <p className="text-red-400 text-sm">{profileError}</p>}
            <FormField
              label="Full Name"
              value={profileForm.name}
              onChange={(e) => setProfileForm(f => ({ ...f, name: e.target.value }))}
              required
            />
            <FormField
              label="Phone"
              value={profileForm.phone || ''}
              onChange={(e) => setProfileForm(f => ({ ...f, phone: e.target.value }))}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="City"
                value={profileForm.city || ''}
                onChange={(e) => setProfileForm(f => ({ ...f, city: e.target.value }))}
              />
              <FormField
                label="Country"
                value={profileForm.country || ''}
                onChange={(e) => setProfileForm(f => ({ ...f, country: e.target.value }))}
              />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button type="button" onClick={() => setIsEditingProfile(false)} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" disabled={profileLoading} className="btn-primary">
                {profileLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Change Password Form */}
      {isChangingPassword && (
        <div className="glass-card rounded-2xl border border-white/10 p-6 animate-fade-in-up">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Key className="w-5 h-5 text-primary-400" />
              Change Password
            </h2>
            <button onClick={() => setIsChangingPassword(false)} className="btn-icon">
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            {passwordError && <p className="text-red-400 text-sm">{passwordError}</p>}
            <FormField
              label="Current Password"
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm(f => ({ ...f, currentPassword: e.target.value }))}
              required
            />
            <FormField
              label="New Password"
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm(f => ({ ...f, newPassword: e.target.value }))}
              required
              minLength={6}
            />
            <FormField
              label="Confirm New Password"
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm(f => ({ ...f, confirmPassword: e.target.value }))}
              required
              minLength={6}
            />
            <div className="flex justify-end gap-3 mt-6">
              <button type="button" onClick={() => setIsChangingPassword(false)} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" disabled={passwordLoading} className="btn-primary">
                {passwordLoading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Profile Details (hidden while editing) */}
      {!isEditingProfile && !isChangingPassword && (
        <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
          <div className="p-6 border-b border-white/10 bg-white/5">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <User className="w-5 h-5 text-primary-400" />
              Profile Details
            </h2>
          </div>
          <div className="divide-y divide-white/5">
            {infoItems.map(item => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center gap-4 px-6 py-4 hover:bg-white/5 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-surface-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-surface-500 uppercase tracking-wider">{item.label}</p>
                    <p className="text-white font-medium truncate">{item.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Account Actions */}
      {!isEditingProfile && !isChangingPassword && (
        <div className="glass-card rounded-2xl border border-white/10 p-6">
          <h2 className="text-xl font-bold text-white mb-4">Account</h2>
          <p className="text-surface-400 text-sm mb-4">
            Manage your account settings and preferences.
          </p>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => setIsEditingProfile(true)} className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 text-sm transition-colors">
              Edit Profile
            </button>
            <button onClick={() => setIsChangingPassword(true)} className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 text-sm transition-colors">
              Change Password
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
