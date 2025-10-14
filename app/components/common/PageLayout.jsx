"use client";
import { useI18n } from "@/lib/i18n";
import { ArrowLeft, Home, Settings } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PageLayout({ 
  title, 
  description, 
  children, 
  showBackButton = false,
  backUrl = null,
  actions = null,
  breadcrumbs = null 
}) {
  const { t, isRTL } = useI18n();
  const router = useRouter();

  const handleBack = () => {
    if (backUrl) {
      router.push(backUrl);
    } else {
      router.back();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            {/* Breadcrumbs */}
            {breadcrumbs && (
              <nav className="flex mb-4" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-2">
                  {breadcrumbs.map((crumb, index) => (
                    <li key={index} className="flex items-center">
                      {index > 0 && (
                        <span className="text-gray-400 mx-2">/</span>
                      )}
                      {crumb.href ? (
                        <Link
                          href={crumb.href}
                          className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
                        >
                          {crumb.label}
                        </Link>
                      ) : (
                        <span className="text-sm text-gray-900 font-medium">
                          {crumb.label}
                        </span>
                      )}
                    </li>
                  ))}
                </ol>
              </nav>
            )}

            {/* Header Content */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {showBackButton && (
                  <button
                    onClick={handleBack}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                )}
                
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {title}
                  </h1>
                  {description && (
                    <p className="mt-1 text-sm text-gray-600">
                      {description}
                    </p>
                  )}
                </div>
              </div>

              {/* Actions */}
              {actions && (
                <div className="flex items-center space-x-3">
                  {actions}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Page Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="fade-in">
          {children}
        </div>
      </div>
    </div>
  );
}