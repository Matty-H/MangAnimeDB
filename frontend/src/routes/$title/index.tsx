import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import ResultsDisplay from '../../components/resultsDisplay/resultsDisplay';

export const Route = createFileRoute('/$title/')({
  component: ResultsPage,
});

function ResultsPage() {
  const { title } = Route.useParams();
  return <ResultsDisplay searchTerm={decodeURIComponent(title)} />;
}
