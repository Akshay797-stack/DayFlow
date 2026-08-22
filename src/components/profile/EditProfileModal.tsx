import React, { useState, useEffect, useRef } from 'react';
import { Employee, EmploymentType } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useHRData } from '../../context/HRDataContext';
import { Modal } from '../common/Modal';
import { Save, Camera, Upload, X, AlertTriangle } from 'lucide-react';

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
  const [error, setError] = useState<string | null>(null);
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
        emergencyContact: employee.emergencyContact || { name: '', relationship: '', phone: '' }
      });
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!employee) return;
    updateEmployee(employee.id, formData);
    onClose();
  };

  if (!employee) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isAdmin ? `Edit Profile (Admin Control)` : 'Edit My Personal Details'}
      subtitle={isAdmin ? `Modifying profile for ${employee.name} (${employee.employeeId})` : 'Update your personal contact information and profile picture'}
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/40 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {!isAdmin && (
          <div className="p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/40 rounded-xl text-xs text-blue-800 dark:text-blue-200">
            <span className="font-bold">Note for Employees:</span> You can update your profile photo, phone number, address, emergency contact, bio, and personal details.
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Profile Photo Upload Section */}
          <div className="col-span-full p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
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
                  className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                  title="Upload image"
                >
                  <Camera className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 space-y-2 w-full text-center sm:text-left">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageFile}
                  accept="image/jpeg,image/png,image/jpg,image/webp"
                  className="hidden"
                />
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-odoo-800 hover:bg-odoo-900 text-white text-xs font-bold shadow-xs transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload New Photo (JPEG / PNG)</span>
                  </button>
                  {formData.avatar && (
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, avatar: '' }))}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg text-xs font-medium transition-colors"
                      title="Reset photo"
                    >
                      Reset
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-slate-400">
                  Select a JPG, JPEG, or PNG image from your computer to update your enterprise profile photo.
                </p>
              </div>
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Full Name {isAdmin && '*'}
            </label>
            <input
              type="text"
              disabled={!isAdmin}
              value={formData.name || ''}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className={`w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 ${
                isAdmin
                  ? 'bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white'
                  : 'bg-slate-100 dark:bg-slate-800/40 text-slate-500 cursor-not-allowed'
              }`}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              disabled={!isAdmin}
              value={formData.email || ''}
              onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className={`w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 ${
                isAdmin
                  ? 'bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white'
                  : 'bg-slate-100 dark:bg-slate-800/40 text-slate-500 cursor-not-allowed'
              }`}
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              value={formData.phone || ''}
              onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              required
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-odoo-700/30"
            />
          </div>

          {/* Designation */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Job Designation {!isAdmin && '(HR Controlled)'}
            </label>
            <input
              type="text"
              disabled={!isAdmin}
              value={formData.designation || ''}
              onChange={e => setFormData(prev => ({ ...prev, designation: e.target.value }))}
              className={`w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 ${
                isAdmin
                  ? 'bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white'
                  : 'bg-slate-100 dark:bg-slate-800/40 text-slate-500 cursor-not-allowed'
              }`}
            />
          </div>

          {/* Department */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Department {!isAdmin && '(HR Controlled)'}
            </label>
            {isAdmin ? (
              <select
                value={formData.department || ''}
                onChange={e => setFormData(prev => ({ ...prev, department: e.target.value }))}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none font-medium"
              >
                <option value="Engineering">Engineering</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Design & UX">Design & UX</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="Growth & Marketing">Growth & Marketing</option>
                <option value="Finance">Finance</option>
              </select>
            ) : (
              <input
                type="text"
                disabled
                value={formData.department || ''}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/40 text-slate-500 cursor-not-allowed"
              />
            )}
          </div>

          {/* Employment Type */}
          {isAdmin && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Employment Type
              </label>
              <select
                value={formData.employmentType || 'Full-Time'}
                onChange={e => setFormData(prev => ({ ...prev, employmentType: e.target.value as EmploymentType }))}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none font-medium"
              >
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Contract">Contract</option>
                <option value="Intern">Intern</option>
              </select>
            </div>
          )}

          {/* Address */}
          <div className="col-span-full">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Residential Address *
            </label>
            <input
              type="text"
              value={formData.address || ''}
              onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))}
              required
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-odoo-700/30"
            />
          </div>

          {/* Professional Bio */}
          <div className="col-span-full">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Professional Bio
            </label>
            <textarea
              rows={2}
              value={formData.bio || ''}
              onChange={e => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="Tell us about your background, expertise, or hobbies..."
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-odoo-700/30 resize-none"
            />
          </div>

          {/* Emergency Contact */}
          <div className="col-span-full pt-2 border-t border-slate-100 dark:border-slate-800">
            <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">Emergency Contact Details</h5>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Contact Name"
                value={formData.emergencyContact?.name || ''}
                onChange={e => setFormData(prev => ({
                  ...prev,
                  emergencyContact: { ...(prev.emergencyContact || { name: '', relationship: '', phone: '' }), name: e.target.value }
                }))}
                className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
              <input
                type="text"
                placeholder="Relationship (e.g. Spouse)"
                value={formData.emergencyContact?.relationship || ''}
                onChange={e => setFormData(prev => ({
                  ...prev,
                  emergencyContact: { ...(prev.emergencyContact || { name: '', relationship: '', phone: '' }), relationship: e.target.value }
                }))}
                className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
              <input
                type="tel"
                placeholder="Contact Phone"
                value={formData.emergencyContact?.phone || ''}
                onChange={e => setFormData(prev => ({
                  ...prev,
                  emergencyContact: { ...(prev.emergencyContact || { name: '', relationship: '', phone: '' }), phone: e.target.value }
                }))}
                className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2 bg-odoo-800 hover:bg-odoo-900 text-white text-xs font-bold rounded-xl shadow-md transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Changes</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
