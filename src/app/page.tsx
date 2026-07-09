'use client';
import { useState } from 'react';
import { Dropzone } from '@/components/Dropzone';
import { CSVTable } from '@/components/CSVTable';
import { Loader2, FileText, RotateCcw, CheckCircle2, Moon, AlertCircle } from 'lucide-react';

interface ExecutionResponse {
  totalImported: number;
  totalSkipped: number;
  records: any[];
}

export default function Home() {
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [aiProcessedResponse, setAiProcessedResponse] = useState<ExecutionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleProcessConfirmation = async () => {
    if (previewData.length === 0) {
      setValidationError("Please upload a valid CSV file before attempting an import.");
      return;
    }
    setIsLoading(true);
    setValidationError(null);
    setAiProcessedResponse(null);

    try {
      const response = await fetch('http://localhost:5000/api/csv/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rows: previewData }),
      });

      if (!response.ok) throw new Error('AI processing engine returned an internal error status.');

      const data: ExecutionResponse = await response.json();
      setAiProcessedResponse(data);
    } catch (err: any) {
      setValidationError(err?.message || "An unresolved network extraction exception happened.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetImporter = () => {
    setPreviewData([]);
    setAiProcessedResponse(null);
    setValidationError(null);
  };

  const simulateFileTrigger = () => {
    document.getElementById('csv-upload')?.click();
  };

  return (
    <main className="min-h-screen bg-[#F4F7F6] text-[#2D3748] antialiased p-6 md:p-12">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Branding Header */}
        <header className="flex items-center justify-between pb-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#10705B]">GrowEasy CRM</p>
            <h1 className="text-4xl font-extrabold tracking-tight text-[#1A202C] mt-1">
              AI-powered CSV Importer
            </h1>
          </div>
          <button className="p-2.5 bg-white hover:bg-gray-100 text-gray-700 rounded-xl border border-gray-200/80 shadow-sm transition-all" aria-label="Toggle Theme">
            <Moon className="w-5 h-5" />
          </button>
        </header>

        {/* Unified Operations Workspace Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          
          {/* Main Dropzone Interface Pane */}
          <div className="lg:col-span-3 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm min-h-[220px] flex flex-col justify-center">
            <Dropzone onParsedData={(data) => {
              setPreviewData(data);
              setAiProcessedResponse(null);
              setValidationError(null);
            }} />
          </div>

          {/* Right Action Control Sidebar */}
          <div className="flex flex-col gap-3 h-full justify-center">
            <button
              onClick={simulateFileTrigger}
              className="w-full py-3 px-4 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 rounded-xl font-medium shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4 text-gray-500" />
              Choose CSV
            </button>
            
            <button
              onClick={resetImporter}
              className="w-full py-3 px-4 bg-white hover:bg-gray-50 border border-gray-200 text-gray-600 rounded-xl font-medium shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4 text-gray-400" />
              Reset
            </button>

            <button
              onClick={handleProcessConfirmation}
              disabled={isLoading || previewData.length === 0}
              className="w-full py-3 px-4 bg-[#6AA497] hover:bg-[#588E82] disabled:opacity-50 text-white rounded-xl font-semibold shadow-sm transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
              {isLoading ? 'Processing...' : 'Confirm Import'}
            </button>
          </div>
        </div>

        {/* Validation and Error Alerts (Styled precisely like your clean banner) */}
        {validationError && (
          <div className="w-full px-5 py-4 bg-[#FCE8E6] border border-[#F5C2C0] rounded-xl text-[#B71C1C] flex items-center gap-3 animate-in fade-in duration-200">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-[#C62828]" />
            <p className="text-sm font-medium">{validationError}</p>
          </div>
        )}

        {/* Client Side Parsing Preview Table */}
        {previewData.length > 0 && !aiProcessedResponse && (
          <div className="animate-in fade-in duration-300">
            <CSVTable data={previewData} title="Source File Contents Preview" />
          </div>
        )}

        {/* Execution Engine Success Dashboard Results Area */}
        {aiProcessedResponse && (
          <section className="space-y-6 animate-in slide-in-from-bottom-4 duration-400">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm text-center">
                <p className="text-xs font-semibold uppercase text-gray-400 tracking-wider">Rows Loaded</p>
                <p className="text-3xl font-extrabold text-gray-800 mt-1">
                  {aiProcessedResponse.totalImported + aiProcessedResponse.totalSkipped}
                </p>
              </div>
              <div className="bg-emerald-50/40 p-5 rounded-2xl border border-emerald-100 text-center">
                <p className="text-xs font-semibold uppercase text-emerald-600 tracking-wider">Successfully Mapped</p>
                <p className="text-3xl font-extrabold text-emerald-700 mt-1">{aiProcessedResponse.totalImported}</p>
              </div>
              <div className="bg-amber-50/40 p-5 rounded-2xl border border-amber-100 text-center">
                <p className="text-xs font-semibold uppercase text-amber-600 tracking-wider">Skipped Rows</p>
                <p className="text-3xl font-extrabold text-amber-700 mt-1">{aiProcessedResponse.totalSkipped}</p>
              </div>
            </div>

            <CSVTable data={aiProcessedResponse.records} title="GrowEasy CRM Normalized Output Matrix" />
          </section>
        )}
      </div>
    </main>
  );
}