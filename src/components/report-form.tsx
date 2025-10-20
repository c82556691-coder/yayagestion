'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { generateSummaryAction } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Wand2 } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

const initialState = {
  message: '',
  summary: '',
  errors: {},
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Generating...' : <> <Wand2 className="mr-2 h-4 w-4" /> Generate Summary</>}
    </Button>
  );
}

export function ReportForm() {
  const [state, formAction] = useActionState(generateSummaryAction, initialState);

  return (
    <div className="space-y-8">
      <form action={formAction} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Sales Data</CardTitle>
            <CardDescription>
              Paste your raw sales data here. Include product names, quantities, revenue, and dates for the best results.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid w-full gap-2">
              <Label htmlFor="salesData">Sales Data Input</Label>
              <Textarea
                id="salesData"
                name="salesData"
                placeholder="e.g., 'January 2024: 50 Smart Watches sold, $12,499.50 revenue...'"
                className="min-h-[200px]"
              />
              {state.errors?.salesData && (
                <p className="text-sm font-medium text-destructive">
                  {state.errors.salesData[0]}
                </p>
              )}
            </div>
            <div className="space-y-2">
                <Label>Summary Length</Label>
                <RadioGroup defaultValue="medium" name="summaryLength" className="flex items-center gap-6">
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="short" id="short" />
                        <Label htmlFor="short">Short</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="medium" id="medium" />
                        <Label htmlFor="medium">Medium</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="long" id="long" />
                        <Label htmlFor="long">Long</Label>
                    </div>
                </RadioGroup>
            </div>
            <SubmitButton />
          </CardContent>
        </Card>
      </form>

      <Card>
        <CardHeader>
          <CardTitle>AI Generated Summary</CardTitle>
          <CardDescription>
            The summary of your sales data will appear below.
          </CardDescription>
        </CardHeader>
        <CardContent>
            {useFormStatus().pending ? (
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                </div>
            ) : state.summary ? (
                <p className="whitespace-pre-wrap">{state.summary}</p>
            ) : (
                <p className="text-muted-foreground">
                    Your summary will be generated here.
                </p>
            )}
            {state.message && !state.summary && !state.errors?.salesData && (
                 <p className="text-sm font-medium text-destructive mt-4">
                    {state.message}
                </p>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
