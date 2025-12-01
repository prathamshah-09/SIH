import React, { useState, useEffect } from 'react';
import { useAuth } from '@context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { User, Settings, RefreshCw, LogOut, Check, X, Key } from 'lucide-react';
import { generateRandomUsername } from '../../utils/usernameGenerator';

const ProfileDropdown = () => {
  const { theme } = useTheme();
  const { user: authUser, logout } = useAuth();
  // Frontend-only profile: read/write user from localStorage (no backend/auth calls)
  const [user, setUser] = React.useState(authUser || null);

  useEffect(() => {
    // Sync from context first; fallback to localStorage for extra fields (like username)
    try {
      const raw = localStorage.getItem('user');
      const stored = raw ? JSON.parse(raw) : null;
      if (authUser && stored) {
        setUser({ ...stored, ...authUser });
      } else if (authUser) {
        setUser(authUser);
      } else if (stored) {
        setUser(stored);
      }
    } catch (e) {
      console.warn('Failed to load user from localStorage', e);
    }
  }, []);
  const [isUsernameDialogOpen, setIsUsernameDialogOpen] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [regenerationCount, setRegenerationCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Removed localStorage-based regeneration count; now session-only.
  useEffect(() => {
    if (user) {
      setRegenerationCount(0);
    }
  }, [user]);

  const handleGenerateUsername = () => {
    setIsUsernameDialogOpen(true);
    const username = generateRandomUsername();
    setNewUsername(username);
  };

  const handleRegenerateUsername = () => {
    if (regenerationCount >= 3) {
      return; // Should not reach here due to UI restrictions
    }
    
    const username = generateRandomUsername();
    setNewUsername(username);
  };

  const handleKeepUsername = async () => {
    setIsLoading(true);
    try {
      // Update user profile in localStorage only
      const updatedUser = { ...(user || {}), username: newUsername };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);

      // Update regeneration count (session only)
      const newCount = regenerationCount + 1;
      setRegenerationCount(newCount);

      setIsUsernameDialogOpen(false);
      setNewUsername('');
    } catch (error) {
      console.error('Error updating username:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setIsUsernameDialogOpen(false);
    setNewUsername('');
  };

  const canRegenerate = regenerationCount < 3;

  // Change password handler for counsellor/admin
  const handleChangePassword = async () => {
    setPasswordError('');
    if (!currentPassword || !newPasswordInput || !confirmPassword) {
      setPasswordError('Please fill all fields');
      return;
    }
    if (newPasswordInput !== confirmPassword) {
      setPasswordError('New password and confirmation do not match');
      return;
    }

    setPasswordLoading(true);
    try {
      // Frontend-only password change: validate currentPassword against stored user password
      const stored = user || JSON.parse(localStorage.getItem('user') || 'null');
      if (!stored) {
        setPasswordError('No user data available');
      } else if (stored.password !== currentPassword) {
        setPasswordError('Current password is incorrect');
      } else {
        const updatedUser = { ...stored, password: newPasswordInput };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setIsPasswordDialogOpen(false);
        setCurrentPassword('');
        setNewPasswordInput('');
        setConfirmPassword('');
      }
    } catch (e) {
      setPasswordError('Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:scale-110 transition-transform">
            <Avatar className="h-10 w-10 ring-2 ring-white/50 shadow-lg">
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback className={`bg-gradient-to-br ${theme.colors.primary} text-white text-sm font-bold`}>
                {user?.name?.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        
          <DropdownMenuContent className="w-64" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-2">
              <p className="text-sm font-medium leading-none">{user?.name}</p>
              <div className="flex items-center space-x-2">
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.username ? `@${user.username}` : 'No username set'}
                </p>
                {user?.username && (
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                    Active
                  </span>
                )}
              </div>
              <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
            </div>
          </DropdownMenuLabel>
          
          <DropdownMenuSeparator />

          {user?.role === 'student' ? (
            // student retains username generation flow
            <>
              <DropdownMenuItem className="cursor-pointer" onClick={handleGenerateUsername} disabled={!canRegenerate}>
                <RefreshCw className="mr-2 h-4 w-4" />
                <div className="flex flex-col">
                  <span>
                    {user?.username ? 'Regenerate Username' : 'Generate Username'}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {canRegenerate ? `${3 - regenerationCount} attempts left` : 'No attempts left'}
                  </span>
                </div>
              </DropdownMenuItem>

              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                Profile Settings
              </DropdownMenuItem>
            </>
          ) : (
            // counsellor / admin: simple view profile + change password
            <>
              <DropdownMenuItem className="cursor-pointer" onClick={() => setIsViewDialogOpen(true)}>
                <User className="mr-2 h-4 w-4" />
                View Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={() => setIsPasswordDialogOpen(true)}>
                <Key className="mr-2 h-4 w-4" />
                Change Password
              </DropdownMenuItem>
            </>
          )}

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="cursor-pointer text-red-600 hover:text-red-700"
            onClick={async () => {
              try { await logout(); } catch {}
              try { localStorage.removeItem('user'); } catch {}
              window.location.href = '/login';
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Username Generation Dialog */}
      <Dialog open={isUsernameDialogOpen} onOpenChange={setIsUsernameDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <User className="w-5 h-5 mr-2 text-blue-500" />
              {user?.username ? 'Regenerate Username' : 'Generate Username'}
            </DialogTitle>
            <DialogDescription>
              Your new username will be displayed in all community chat messages going forward.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-6">
            <div className="text-center space-y-4">
              <div className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-600 mb-2">Your username is:</p>
                <p className="text-2xl font-bold text-blue-600">{newUsername}</p>
              </div>
              
              <p className="text-sm text-gray-600">
                Do you want to keep it or generate another?
              </p>
              
              {regenerationCount < 2 && (
                <p className="text-xs text-orange-600">
                  You have {3 - regenerationCount - 1} regeneration attempts left after this.
                </p>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <div className="flex gap-3 w-full">
              <Button 
                variant="outline" 
                onClick={handleRegenerateUsername}
                disabled={regenerationCount >= 2 || isLoading}
                className="flex-1"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Regenerate
              </Button>
              <Button 
                onClick={handleKeepUsername}
                disabled={isLoading}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Check className="w-4 h-4 mr-2" />
                )}
                Keep
              </Button>
            </div>
            <Button 
              variant="ghost" 
              onClick={handleCloseDialog}
              disabled={isLoading}
              className="w-full mt-2"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Profile Dialog (read-only) */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Profile</DialogTitle>
            <DialogDescription>View your profile details.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
              <p className="text-xs text-muted-foreground">Role: {user?.role}</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>Update your account password (local only, no backend).</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-3">
            <input type="password" placeholder="Current password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full px-3 py-2 border rounded" />
            <input type="password" placeholder="New password" value={newPasswordInput} onChange={(e) => setNewPasswordInput(e.target.value)} className="w-full px-3 py-2 border rounded" />
            <input type="password" placeholder="Confirm new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-3 py-2 border rounded" />
            {passwordError && <p className="text-xs text-red-600">{passwordError}</p>}
          </div>
          <DialogFooter>
            <div className="flex gap-3 w-full">
              <Button variant="outline" onClick={() => setIsPasswordDialogOpen(false)} className="flex-1">Cancel</Button>
              <Button onClick={handleChangePassword} disabled={passwordLoading} className="flex-1 bg-green-500 text-white">{passwordLoading ? 'Saving...' : 'Change Password'}</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProfileDropdown;