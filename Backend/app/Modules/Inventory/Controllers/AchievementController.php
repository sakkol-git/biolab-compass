<?php

declare(strict_types=1);

namespace App\Modules\Inventory\Controllers;

use App\Concerns\EscapesSearchTerm;
use App\Http\Controllers\Controller;

use App\Modules\Inventory\Requests\Achievement\StoreAchievementRequest;
use App\Modules\Inventory\Requests\Achievement\UpdateAchievementRequest;
use App\Modules\Inventory\Resources\AchievementResource;
use App\Modules\Inventory\Models\Achievement;
use App\Modules\Inventory\Services\AchievementService;
use App\Modules\Core\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;

class AchievementController extends Controller
{
    use EscapesSearchTerm;

    public function __construct(
        private readonly AchievementService $achievementService,
    ) {}
    /**
     * GET /api/achievements
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $this->authorize('viewAny', Achievement::class);

        $query = Achievement::query();

        if ($request->filled('search')) {
            $term = $this->escapeLike($request->input('search'));
            $query->where('name', 'like', "%{$term}%");
        }

        return AchievementResource::collection($query->paginate(15));
    }

    /**
     * POST /api/achievements
     */
    public function store(StoreAchievementRequest $request): JsonResponse
    {
        $this->authorize('create', Achievement::class);

        $achievement = $this->achievementService->create($request->validated());

        return (new AchievementResource($achievement))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * GET /api/achievements/{achievement}
     */
    public function show(Achievement $achievement): AchievementResource
    {
        $this->authorize('view', $achievement);

        return new AchievementResource($achievement);
    }

    /**
     * PUT /api/achievements/{achievement}
     */
    public function update(UpdateAchievementRequest $request, Achievement $achievement): AchievementResource
    {
        $this->authorize('update', $achievement);

        $updated = $this->achievementService->update($achievement, $request->validated());

        return new AchievementResource($updated);
    }

    /**
     * DELETE /api/achievements/{achievement}
     */
    public function destroy(Achievement $achievement): JsonResponse
    {
        $this->authorize('delete', $achievement);

        $this->achievementService->delete($achievement);

        return response()->json(['message' => 'Achievement deleted successfully.']);
    }

    /**
     * POST /api/achievements/{achievement}/assign/{user}
     */
    public function assign(Achievement $achievement, User $user): JsonResponse
    {
        $this->authorize('update', $achievement);

        if (! $this->achievementService->assign($achievement, $user)) {
            return response()->json(['message' => 'User already has this achievement.'], 409);
        }

        return response()->json([
            'message' => "Achievement '{$achievement->name}' assigned to {$user->name}.",
        ]);
    }

    /**
     * DELETE /api/achievements/{achievement}/revoke/{user}
     */
    public function revoke(Achievement $achievement, User $user): JsonResponse
    {
        $this->authorize('update', $achievement);

        $this->achievementService->revoke($achievement, $user);

        return response()->json([
            'message' => "Achievement '{$achievement->name}' revoked from {$user->name}.",
        ]);
    }
}
