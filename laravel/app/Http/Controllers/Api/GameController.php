<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;

class GameController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        return response('Index works!', 200);
    }

    public function storeResult(Request $request): Response
    {
        $winner = $request['winner'];
        $loser = $request['loser'];
        $winner_name = $request['winner_name'];
        $loser_name = $request['loser_name'];
        $game_result = $request['game_result'];

        DB::table('games')->insert([
            'winner_id' => $winner,
            'loser_id' => $loser,
            'winner_name' => $winner_name,
            'loser_name' => $loser_name,
            'game_result' => $game_result
        ]);

        return response('Result added', 200);
    }

    public function result(Request $request): JsonResponse
    {
        $id = $request['id'];

        $result = DB::table('games')
            ->select('winner_name', 'loser_name', 'game_result')
            ->where('winner_id', '=', $id)
            ->orWhere('loser_id', '=', $id)
            ->get();

        return response()->json([
            'data' => $result
        ], 200);
    }

    public function total(Request $request): JsonResponse
    {
        $id = $request['id'];

        $total = DB::table('games')
            ->where('winner_id', '=', $id)
            ->orWhere('loser_id', '=', $id)
            ->count();

        return response()->json([
            'data' => $total
        ], 200);
    }

    public function winrate(Request $request): JsonResponse
    {
        $id = $request['id'];

        $total = DB::table('games')
            ->where('winner_id', '=', $id)
            ->orWhere('loser_id', '=', $id)
            ->count();

        $wins = DB::table('games')
            ->where('winner_id', '=', $id)
            ->count();

        if ($wins == 0) {
            return response()->json([
                'data' => 0
            ], 200);
        }

        $winrate = floor($wins / $total * 100);

        return response()->json([
            'data' => $winrate
        ], 200);
    }
}