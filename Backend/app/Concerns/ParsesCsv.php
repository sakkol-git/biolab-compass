<?php

declare(strict_types=1);

namespace App\Concerns;

/**
 * Shared CSV parsing for services that accept comma-separated tag/user inputs.
 *
 * Eliminates duplication across ExperimentService, LabNotebookService, and ProtocolService.
 */
trait ParsesCsv
{
    /**
     * Parse a CSV string into an array of trimmed, non-empty strings.
     *
     * @return string[]
     */
    protected function parseCsv(string $csv): array
    {
        return collect(explode(',', $csv))
            ->map(fn (string $v) => trim($v))
            ->filter()
            ->values()
            ->all();
    }
}
