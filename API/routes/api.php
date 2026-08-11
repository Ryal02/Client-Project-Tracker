<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProjectController;
use Illuminate\Support\Facades\Route;


/**
 * Register a new user account.
 *
 * @see AuthController::register
 */
Route::post('/register', [AuthController::class, 'register']);


/**
 * Authenticate an existing user and return an access token.
 *
 * @see AuthController::login
 */
Route::post('/login', [AuthController::class, 'login']);


/**
 * Authenticated routes.
 *
 * All routes within this group require a valid Laravel Sanctum
 * authentication token.
 */
Route::middleware('auth:sanctum')->group(function () {

    /**
     * Log out the currently authenticated user.
     *
     * @see AuthController::logout
     */
    Route::post('/logout', [AuthController::class, 'logout']);


    /**
     * Retrieve the currently authenticated user's information.
     *
     * @see AuthController::me
     */
    Route::get('/me', [AuthController::class, 'me']);


    /**
     * Manage projects using the standard CRUD operations.
     *
     * Provides routes for creating, retrieving, updating,
     * and deleting projects.
     *
     * @see ProjectController
     */
    Route::apiResource('projects', ProjectController::class);
});
