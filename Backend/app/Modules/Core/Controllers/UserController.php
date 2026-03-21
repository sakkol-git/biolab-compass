<?php

declare(strict_types=1);

namespace App\Modules\Core\Controllers;

use App\Concerns\EscapesSearchTerm;
use App\Http\Controllers\Controller;

use App\Modules\Core\Requests\User\StoreUserRequest;
use App\Modules\Core\Requests\User\UpdateUserRequest;
use App\Modules\Inventory\Resources\UserResource;
use App\Modules\Core\Models\User;
use App\Modules\Core\Services\UserService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    use EscapesSearchTerm;

    public function __construct(
        private readonly UserService $userService,
    ) {}
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $this->authorize('viewAny', User::class);
        $query = User::query()->latest();

        if ($request->filled('search')) {
            $term = $this->escapeLike($request->input('search'));
            $query->where(function ($q) use ($term) {
                $q->where('name', 'like', "%{$term}%")
                    ->orWhere('email', 'like', "%{$term}%");
            });
        }

        if ($request->filled('role')) {
            $query->where('role', $request->input('role'));
        }

        $perPage = min($request->integer('per_page', 15), 100);

        return UserResource::collection($query->paginate($perPage));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request): JsonResponse
    {
        $this->authorize('create', User::class);

        $user = $this->userService->create($request->validated());

        return (new UserResource($user))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user): UserResource
    {
        $this->authorize('view', $user);

        return new UserResource($user);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user): UserResource
    {
        $this->authorize('update', $user);

        $updated = $this->userService->update($user, $request->validated());

        return new UserResource($updated);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user): JsonResponse
    {
        $this->authorize('delete', $user);

        $this->userService->delete($user);

        return response()->json(['message' => 'User deleted successfully.']);
    }
}
