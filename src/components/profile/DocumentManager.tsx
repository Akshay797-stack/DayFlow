import React, { useState } from 'react';
import { Employee, EmployeeDocument } from '../../types';
import { useHRData } from '../../context/HRDataContext';
import { FileText, Download, Upload, Trash2, CheckCircle2, Shield, Plus } from 'lucide-react';
import { Modal } from '../common/Modal';

interface DocumentManagerProps {
  employee: Employee;
  canEdit?: boolean;
}

export const DocumentManager: React.FC<DocumentManagerProps> = ({ employee, canEdit = true }) => {
  const { addEmployeeDocument } = useHRData();

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [docName, setDocName] = useState('');
  const [docType, setDocType] = useState<EmployeeDocument['type']>('Resume');
  const [docSize, setDocSize] = useState('1.5 MB');

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim()) return;

    addEmployeeDocument(employee.id, {
      name: docName.endsWith('.pdf') ? docName : `${docName}.pdf`,
      type: docType,
      size: docSize || '1.2 MB'
    });

    setDocName('');
    setIsUploadOpen(false);
  };

  const getDocTypeBadge = (type: EmployeeDocument['type']) => {
    switch (type) {
      case 'Contract':
        return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';
      case 'ID Proof':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
      case 'Tax Form':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      default:
        return 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-odoo-700 dark:text-odoo-400" />
            <span>Official Employee Documents Vault</span>
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Encrypted repository of contracts, IDs, tax filings, and certifications
          </p>
        </div>

        {canEdit && (
          <button
            onClick={() => setIsUploadOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-odoo-800 hover:bg-odoo-900 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Upload Document</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {(!employee.documents || employee.documents.length === 0) ? (
          <div className="col-span-full py-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
            <FileText className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
            <p className="text-xs text-slate-400">No documents uploaded yet.</p>
          </div>
        ) : (
          employee.documents.map(doc => (
            <div
              key={doc.id}
              className="p-4 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 shadow-xs hover:border-odoo-700/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getDocTypeBadge(doc.type)}`}>
                    {doc.type}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {doc.size}
                  </span>
                </div>
                <div className="flex items-start gap-2.5 mt-2">
                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-odoo-800 dark:text-odoo-300 flex-shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <p className="text-xs font-semibold text-slate-900 dark:text-white truncate flex-1">
                    {doc.name}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between text-[11px] text-slate-400">
                <span>Uploaded: {doc.uploadDate}</span>
                <button
                  onClick={() => alert(`Downloading "${doc.name}"...`)}
                  className="flex items-center gap-1 text-odoo-700 dark:text-odoo-400 font-semibold hover:underline"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Upload Modal */}
      {isUploadOpen && (
        <Modal
          isOpen={isUploadOpen}
          onClose={() => setIsUploadOpen(false)}
          title="Upload Employee Document"
          subtitle={`Adding document for ${employee.name}`}
          maxWidth="md"
        >
          <form onSubmit={handleUploadSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Document Title *
              </label>
              <input
                type="text"
                placeholder="e.g. Annual_Performance_Review_2026.pdf"
                value={docName}
                onChange={e => setDocName(e.target.value)}
                required
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-odoo-700/30"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Document Category *
              </label>
              <select
                value={docType}
                onChange={e => setDocType(e.target.value as any)}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none font-medium"
              >
                <option value="Resume">Resume / CV</option>
                <option value="ID Proof">Government ID Proof / Passport</option>
                <option value="Contract">Employment Contract / Offer Letter</option>
                <option value="Tax Form">Tax Form (W-4 / Form 16)</option>
                <option value="Certificate">Degree / Skill Certificate</option>
                <option value="Other">Other Document</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                File Attachment
              </label>
              <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-6 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
                <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Click to select file or drag and drop
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  PDF, DOCX, PNG, JPG up to 10MB
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsUploadOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2 bg-odoo-800 hover:bg-odoo-900 text-white text-xs font-bold rounded-xl shadow-md transition-all"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Save to Vault</span>
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
