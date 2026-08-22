import React, { useState, useEffect, useRef } from 'react';
import { Employee, EmploymentType, PrivateInfo } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useHRData } from '../../context/HRDataContext';
import { Modal } from '../common/Modal';
import { Save, Camera, Upload, X, AlertTriangle, User, Briefcase, Building, ShieldCheck, Heart, Sparkles, CreditCard } from 'lucide-react';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  employee
}) => {
  const { isAdmin } = useAuth();
  const { updateEmployee } = useHRData();

  const [formData, setFormData] = useState<Partial<Employee>>({});
  const [skillsInput, setSkillsInput] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [modalTab, setModalTab] = useState<'basic' | 'about' | 'private'>('basic');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name,
        email: employee.email,
        phone: employee.phone,
        address: employee.address,
        avatar: employee.avatar,
        designation: employee.designation,
        department: employee.department,
        role: employee.role,
        employmentType: employee.employmentType,
        managerName: employee.managerName,
        bio: employee.bio || '',
        about: employee.about || '',
        whatILoveAboutJob: employee.whatILoveAboutJob || '',
        interestsAndHobbies: employee.interestsAndHobbies || '',
        skills: employee.skills || [],
        privateInfo: employee.privateInfo || {
          dateOfBirth: '1995-06-15',
          residingAddress: employee.address || '',
          nationality: 'American',
          personalEmail: employee.email || '',
          gender: 'Male',
          maritalStatus: 'Single',
          dateOfJoining: employee.joiningDate || '',
          bankName: 'Silicon Valley National Bank',
          accountNumber: '987654321098',
          ifscCode: 'SVNB0004521',
          panNumber: 'ABCDE1234F',
          uanNumber: '100987654321'
        },
        emergencyContact: employee.emergencyContact || { name: '', relationship: '', phone: '' }
      });
      setSkillsInput(employee.skills ? employee.skills.join(', ') : '');
    }
  }, [employee]);

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(file.type)) {
      setError('Please select a valid image file (JPEG or PNG format).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image file size cannot exceed 5MB.');
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, avatar: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handlePrivateInfoChange = (field: keyof PrivateInfo, val: string) => {
    setFormData(prev => ({
      ...prev,
      privateInfo: {
        ...(prev.privateInfo || {}),
        [field]: val
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!employee) return;

    const parsedSkills = skillsInput
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const submissionData = {
      ...formData,
      skills: parsedSkills
    };

    updateEmployee(employee.id, submissionData);
    onClose();
  };

  if (!employee) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isAdmin ? `Edit Employee Profile (Admin Control)` : 'Edit My Profile Details'}
      subtitle={isAdmin ? `Modifying profile for ${employee.name} (${employee.employeeId})` : 'Update your personal details, bio, skills, and private info'}
      maxWidth="3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/40 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Modal Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2 pb-1">
          <button
            type="button"
            onClick={() => setModalTab('basic')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              modalTab === 'basic'
                ? 'bg-odoo-800 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Basic & Contact
          </button>
          <button
            type="button"
            onClick={() => setModalTab('about')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              modalTab === 'about'
                ? 'bg-odoo-800 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            About & Skills
          </button>
          <button
            type="button"
            onClick={() => setModalTab('private')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              modalTab === 'private'
                ? 'bg-odoo-800 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Private & Bank Info
          </button>
        </div>

        {/* TAB 1: BASIC & CONTACT */}
        {modalTab === 'basic' && (
          <div className="space-y-4">
            {/* Profile Photo Upload Section */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Profile Photo (Upload JPEG / PNG)
              </label>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="relative group flex-shrink-0">
                  <img
                    src={formData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
                    alt="Avatar Preview"
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-odoo-700/30 shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity cursor-pointer"
                    title="Upload image"
                  >
                    <Camera className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageFile}
                    accept="image/jpeg,image/png,image/jpg,image/webp"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-600 shadow-xs transition-colors cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Choose Photo from Device</span>
                  </button>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Upload JPEG, PNG (max 5MB). Photo syncs across directory & navbar.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-odoo-700/30"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Company Email
                </label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-odoo-700/30"
                  disabled={!isAdmin}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Mobile Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone || ''}
                  onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-odoo-700/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Designation / Role
                </label>
                <input
                  type="text"
                  value={formData.designation || ''}
                  onChange={e => setFormData(prev => ({ ...prev, designation: e.target.value }))}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-odoo-700/30"
                  disabled={!isAdmin}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Department
                </label>
                <select
                  value={formData.department || ''}
                  onChange={e => setFormData(prev => ({ ...prev, department: e.target.value }))}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-odoo-700/30 font-medium"
                  disabled={!isAdmin}
                >
                  <option value="Engineering">Engineering</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Design & UX">Design & UX</option>
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="Growth & Marketing">Growth & Marketing</option>
                  <option value="Finance & Legal">Finance & Legal</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Office Location / Address
                </label>
                <input
                  type="text"
                  value={formData.address || ''}
                  onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-odoo-700/30"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ABOUT, JOB LOVE, HOBBIES & SKILLS */}
        {modalTab === 'about' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-odoo-700 dark:text-odoo-400" />
                <span>About Me (Professional Summary)</span>
              </label>
              <textarea
                rows={3}
                value={formData.about || ''}
                onChange={e => setFormData(prev => ({ ...prev, about: e.target.value }))}
                placeholder="Brief professional background, experience, and accomplishments..."
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-odoo-700/30 leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>What I love about my job</span>
              </label>
              <textarea
                rows={2}
                value={formData.whatILoveAboutJob || ''}
                onChange={e => setFormData(prev => ({ ...prev, whatILoveAboutJob: e.target.value }))}
                placeholder="What motivates you at work, favorite projects, team culture..."
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-odoo-700/30 leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-500" />
                <span>My interests and hobbies</span>
              </label>
              <textarea
                rows={2}
                value={formData.interestsAndHobbies || ''}
                onChange={e => setFormData(prev => ({ ...prev, interestsAndHobbies: e.target.value }))}
                placeholder="Passions outside of work, sports, music, reading, traveling..."
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-odoo-700/30 leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Skills (Comma-separated)</span>
              </label>
              <input
                type="text"
                value={skillsInput}
                onChange={e => setSkillsInput(e.target.value)}
                placeholder="e.g. React, TypeScript, Node.js, GraphQL, UI/UX, Agile Management"
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-odoo-700/30"
              />
            </div>
          </div>
        )}

        {/* TAB 3: PRIVATE INFO & BANK DETAILS */}
        {modalTab === 'private' && (
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-odoo-800 dark:text-odoo-300">
              Personal & Demographic Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={formData.privateInfo?.dateOfBirth || ''}
                  onChange={e => handlePrivateInfoChange('dateOfBirth', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nationality
                </label>
                <input
                  type="text"
                  value={formData.privateInfo?.nationality || ''}
                  onChange={e => handlePrivateInfoChange('nationality', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Personal Email
                </label>
                <input
                  type="email"
                  value={formData.privateInfo?.personalEmail || ''}
                  onChange={e => handlePrivateInfoChange('personalEmail', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Gender
                </label>
                <select
                  value={formData.privateInfo?.gender || 'Male'}
                  onChange={e => handlePrivateInfoChange('gender', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none font-medium"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-Binary">Non-Binary</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Marital Status
                </label>
                <select
                  value={formData.privateInfo?.maritalStatus || 'Single'}
                  onChange={e => handlePrivateInfoChange('maritalStatus', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none font-medium"
                >
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Date of Joining
                </label>
                <input
                  type="date"
                  value={formData.privateInfo?.dateOfJoining || employee.joiningDate}
                  onChange={e => handlePrivateInfoChange('dateOfJoining', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                  disabled={!isAdmin}
                />
              </div>
            </div>

            <h4 className="text-xs font-bold uppercase tracking-wider text-odoo-800 dark:text-odoo-300 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5" />
              <span>Bank Account & Statutory Identifiers</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Bank Name
                </label>
                <input
                  type="text"
                  value={formData.privateInfo?.bankName || ''}
                  onChange={e => handlePrivateInfoChange('bankName', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Account Number
                </label>
                <input
                  type="text"
                  value={formData.privateInfo?.accountNumber || ''}
                  onChange={e => handlePrivateInfoChange('accountNumber', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  IFSC / Routing Code
                </label>
                <input
                  type="text"
                  value={formData.privateInfo?.ifscCode || ''}
                  onChange={e => handlePrivateInfoChange('ifscCode', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  PAN Number / Tax ID
                </label>
                <input
                  type="text"
                  value={formData.privateInfo?.panNumber || ''}
                  onChange={e => handlePrivateInfoChange('panNumber', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono focus:outline-none uppercase"
                />
              </div>
            </div>
          </div>
        )}

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-odoo-800 hover:bg-odoo-900 text-white text-xs font-bold shadow-md shadow-odoo-800/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <Save className="w-4 h-4 text-white" />
            <span className="text-white font-bold">Save All Profile Updates</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
