<?php

declare(strict_types=1);

namespace App\Modules\Inventory\Services\Reports;

use App\Modules\Inventory\Models\Chemical;
use App\Modules\Inventory\Models\ChemicalBatch;
use App\Modules\Inventory\Models\Equipment;
use App\Modules\Inventory\Models\PlantSample;
use App\Modules\Inventory\Models\PlantSpecies;
use App\Modules\Inventory\Models\PlantStock;
use App\Modules\Inventory\Models\PlantVariety;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Symfony\Component\HttpFoundation\StreamedResponse;

final class InventoryReportQuery
{
    public function paginate(string $section, int $perPage): LengthAwarePaginator
    {
        return match ($section) {
            'plant_species' => PlantSpecies::withCount('varieties')->paginate($perPage),
            'plant_varieties' => PlantVariety::withCount('samples')->paginate($perPage),
            'plant_samples' => PlantSample::with('species')->paginate($perPage),
            'plant_stocks' => PlantStock::with(['species', 'variety'])->paginate($perPage),
            'chemicals' => Chemical::withCount('batches')->paginate($perPage),
            'chemical_batches' => ChemicalBatch::with('chemical')->paginate($perPage),
            'equipment' => Equipment::paginate($perPage),
            default => Chemical::withCount('batches')->paginate($perPage),
        };
    }

    public function exportCsv(): StreamedResponse
    {
        return ReportCsvHelper::stream('inventory_report.csv', function ($handle): void {
            fputcsv($handle, ['Type', 'ID', 'Name', 'Category', 'Quantity', 'Status']);

            Chemical::all()->each(fn ($c) => fputcsv($handle, [
                'Chemical', $c->id, $c->common_name, $c->category->value ?? '', $c->quantity, '',
            ]));

            Equipment::all()->each(fn ($e) => fputcsv($handle, [
                'Equipment', $e->id, $e->equipment_name, $e->category->value ?? '', 1, $e->status->value ?? '',
            ]));

            PlantSample::all()->each(fn ($s) => fputcsv($handle, [
                'Plant Sample', $s->id, $s->sample_name, '', $s->quantity, '',
            ]));
        });
    }
}
