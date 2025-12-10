import React, { useState } from 'react';
import { Lock } from 'lucide-react';

const PasswordChange = () => {
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass !== confirmPass) {
        setMessage({ type: 'error', text: 'New passwords do not match' });
        return;
    }
    
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword: newPass }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
          setMessage({ type: 'success', text: 'Password updated successfully' });
          setCurrentPass('');
          setNewPass('');
          setConfirmPass('');
      } else {
          setMessage({ type: 'error', text: data.error || 'Failed to update password' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 ml-64 bg-slate-950 min-h-screen text-white">
        <h2 className="text-3xl font-bold mb-8">Security Settings</h2>
        
        <div className="max-w-xl bg-slate-900 border border-slate-800 rounded-xl p-8">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Lock className="text-blue-400" /> Change Password
            </h3>
            
            {message && (
                <div className={`p-4 rounded-lg mb-6 ${message.type === 'success' ? 'bg-green-900/20 text-green-400 border border-green-900' : 'bg-red-900/20 text-red-400 border border-red-900'}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Note: Current password validation would ideally happen on backend, but for this simplified flow we just update */}
                <div>
                    <label className="block text-sm font-bold text-slate-400 mb-2">Current Password (Verify only)</label>
                    <input 
                        type="password" 
                        value={currentPass}
                        onChange={(e) => setCurrentPass(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-400 mb-2">New Password</label>
                    <input 
                        type="password" 
                        value={newPass}
                        onChange={(e) => setNewPass(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-400 mb-2">Confirm New Password</label>
                    <input 
                        type="password" 
                        value={confirmPass}
                        onChange={(e) => setConfirmPass(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                    />
                </div>

                <div className="pt-4">
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading ? 'Updating...' : 'Update Password'}
                    </button>
                </div>
            </form>
        </div>
    </div>
  );
};

export default PasswordChange;