import { ReportForm } from '@/components/report-form';

export default function ReportsPage() {
  return (
    <div className="p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold tracking-tight">AI Reporting Tool</h2>
            <p className="text-muted-foreground mt-2">
                Generate strategic summaries from your sales data using AI.
            </p>
        </div>
        <ReportForm />
      </div>
    </div>
  );
}
