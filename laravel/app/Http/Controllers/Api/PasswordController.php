<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash;

/**
 * Summary of PasswordController
 */
class PasswordController extends Controller
{
    public function index(): Response
    {
        return response('PasswordController works!!!', 200);
    }

    public function update(Request $request)
    {
        $request->validate([
            'old_password' => 'required',
            'new_password' => 'required|confirmed'
        ]);

        if (!Hash::check($request->old_password, auth()->user()->password)) {
            return back()->with("error", "Old password doesn't match");
        }

        User::where(auth()->user()->id)->update([
            'password' => Hash::make($request->new_password)
        ]);

        return back()->with("status", "Password chanched successfully!");

    }
}
