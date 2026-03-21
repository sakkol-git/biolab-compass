<?php

declare(strict_types=1);

namespace App\Modules\Research\Resources;

use App\Modules\Core\Resources\TagResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LabNotebookResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'notebook_code' => $this->notebook_code,
            'title' => $this->title,
            'content' => $this->content,
            'is_locked' => $this->is_locked,

            'experiment' => [
                'id' => $this->whenLoaded('experiment', fn () => $this->experiment?->id),
                'title' => $this->whenLoaded('experiment', fn () => $this->experiment?->title),
                'code' => $this->whenLoaded('experiment', fn () => $this->experiment?->experiment_code),
            ],

            'user' => [
                'id' => $this->whenLoaded('author', fn () => $this->author->id),
                'name' => $this->whenLoaded('author', fn () => $this->author->name),
            ],

            'tags' => TagResource::collection($this->whenLoaded('tags')),

            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
