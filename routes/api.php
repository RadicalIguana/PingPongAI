<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\GameController;
use App\Http\Controllers\Api\PasswordController;
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

    Route::apiResource('/user', UserController::class);
    Route::post('/data', [UserController::class, 'data']);

    Route::apiResource('/social', UserFriendController::class);
    Route::post('/find', [UserFriendController::class, 'find']);
    Route::post('/add', [UserFriendController::class, 'add']);
    Route::post('/delete', [UserFriendController::class, 'delete']);
    Route::post('/denied', [UserFriendController::class, 'denied']);
    Route::put('/accept', [UserFriendController::class, 'accept']);
    Route::get('/check', [UserFriendController::class, 'check']);

    // Game's result
    Route::post('/storeResult', [GameController::class, 'storeResult']);
    Route::post('/result', [GameController::class, 'result']);
    Route::post('/total', [GameController::class, 'total']);
    Route::post('/winrate', [GameController::class, 'winrate']);

    // Password change
    Route::apiResource('/password', PasswordController::class);
    

    
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});


Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);



