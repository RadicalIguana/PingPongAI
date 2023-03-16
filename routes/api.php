<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\UserFriendController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::apiResource('/social', UserFriendController::class);
    Route::post('/find', [UserFriendController::class, 'find']);
    Route::post('/add', [UserFriendController::class, 'add']);
    Route::post('/delete', [UserFriendController::class, 'delete']);
    Route::put('/cancel', [UserFriendController::class, 'cancel']);
    
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});


Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);



