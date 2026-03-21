<?php

declare(strict_types=1);

namespace App\Modules\Inventory\Controllers;

use App\Http\Controllers\Controller;

use App\Modules\Inventory\Requests\Profile\UpdateProfileRequest;
use App\Modules\Inventory\Resources\AchievementResource;
use App\Modules\Inventory\Resources\UserResource;
use App\Modules\Inventory\Services\ProfileService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProfileController extends Controller
{
    public function __construct(
        private readonly ProfileService $profileService,
    ) {}

    /**
     * GET /api/profile
     */
    public function show(): JsonResponse
    {
        $user = auth('api')->user();
        $profile = $this->profileService->getProfile($user);

        return response()->json([
            'data' => [
                'user' => new UserResource($profile['user']),
                'permissions' => $profile['permissions'],
                'summary' => $profile['summary'],
            ],
        ]);
    }

    /**
     * PUT /api/profile
     */
    public function update(UpdateProfileRequest $request): JsonResponse
    {
        $user = auth('api')->user();

        $updated = DB::transaction(fn () => $this->profileService->update($user, $request->validated()));

        return response()->json([
            'message' => 'Profile updated successfully.',
            'data' => new UserResource($updated),
        ]);
    }

    /**
     * GET /api/profile/contributions
     */
    public function contributions(): JsonResponse
    {
        $user = auth('api')->user();

        return response()->json([
            'data' => $this->profileService->getContributions($user),
        ]);
    }

    /**
     * GET /api/profile/achievements
     */
    public function achievements(): JsonResponse
    {
        $user = auth('api')->user();
        $earned = $this->profileService->getAchievements($user);

        return response()->json([
            'data' => AchievementResource::collection($earned),
        ]);
    }

    /**
     * GET /api/profile/activity
     */
    public function activity(Request $request): JsonResponse
    {
        $user = auth('api')->user();
        $from = $request->input('from', now()->subMonth()->toDateString());
        $to = $request->input('to', now()->toDateString());

        return response()->json([
            'data' => $this->profileService->getActivity($user, $from, $to),
        ]);
    }
}
