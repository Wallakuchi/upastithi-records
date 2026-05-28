"use client";

import { useState } from "react";
import { Download, ChevronDown } from "lucide-react";

interface ExportButtonProps {
  onExportCSV: () => Promise<void>;
  onExportPDF?: () => Promise<void>;
  disabled?: boolean;
  label?: string;
}

export function ExportButton({
  onExportCSV,
  onExportPDF,
  disabled = false,
  label = "Export",
}: ExportButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleExport = async (format: "csv" | "pdf") => {
    try {
      setIsLoading(true);
      if (format === "csv") {
        await onExportCSV();
        setSuccessMessage("CSV exported successfully!");
      } else if (format === "pdf" && onExportPDF) {
        await onExportPDF();
        setSuccessMessage("PDF exported successfully!");
      }

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
      setShowMenu(false);
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative inline-block">
      <div className="flex items-center gap-2">
        <div className="relative">
          <button
            onClick={() => {
              if (!onExportPDF) {
                handleExport("csv");
              } else {
                setShowMenu(!showMenu);
              }
            }}
            disabled={disabled || isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors font-medium"
          >
            <Download className="w-4 h-4" />
            {isLoading ? "Exporting..." : label}
            {onExportPDF && <ChevronDown className="w-4 h-4" />}
          </button>

          {/* Dropdown Menu */}
          {showMenu && onExportPDF && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-10 min-w-[150px]">
              <button
                onClick={() => handleExport("csv")}
                disabled={isLoading}
                className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 first:rounded-t-lg transition-colors disabled:opacity-50"
              >
                Export CSV
              </button>
              <button
                onClick={() => handleExport("pdf")}
                disabled={isLoading}
                className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 last:rounded-b-lg transition-colors disabled:opacity-50"
              >
                Export PDF
              </button>
            </div>
          )}
        </div>

        {/* Success Toast */}
        {successMessage && (
          <div className="fixed bottom-4 right-4 bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg shadow-md animate-pulse">
            ✓ {successMessage}
          </div>
        )}
      </div>
    </div>
  );
}
