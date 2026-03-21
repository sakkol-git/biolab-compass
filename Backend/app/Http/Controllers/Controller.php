<?php

namespace App\Http\Controllers;

use App\Concerns\ApiResponse;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

abstract class Controller
{
    use ApiResponse, AuthorizesRequests;
}
