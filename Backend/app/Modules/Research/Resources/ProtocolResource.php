<?php

declare(strict_types=1);

namespace App\Modules\Research\Resources;

use App\Modules\Core\Resources\TagResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProtocolResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'protocol_code' => $this->protocol_code,
            'title' => $this->title,
            'description' => $this->description,
            'category' => $this->category,
            'version' => $this->version,
            'status' => $this->status?->value,
            'last_updated' => $this->last_updated,

            'author' => [
                'id' => $this->whenLoaded('author', fn () => $this->author->id),
                'name' => $this->whenLoaded('author', fn () => $this->author?->name ?? $this->author_name),
            ],

            'steps_count' => $this->steps_count,
            'linked_experiments_count' => $this->linked_experiments_count,

            'steps' => ProtocolStepResource::collection($this->whenLoaded('steps')),
            'tags' => TagResource::collection($this->whenLoaded('tags')),
            'experiments' => ExperimentResource::collection($this->whenLoaded('experiments')),

            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
