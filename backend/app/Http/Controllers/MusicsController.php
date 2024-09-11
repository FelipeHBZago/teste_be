<?php

namespace App\Http\Controllers;

use App\Models\Music;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class MusicsController extends Controller
{
    public function getUsersWithMusic()
    {
        $users = DB::select('
       SELECT 
            ur.id AS user_rel_music_id,
            u.id AS user_id,
            u.name AS user_name,
            u.email AS user_email,
            m.id AS music_id,
            m.title AS music_title,
            m.artist AS music_artist,
            m.url AS music_url
        FROM 
            user_rel_musics ur
        JOIN 
            users u ON ur.user_id = u.id
        JOIN 
            musics m ON ur.music_id = m.id;
    ');

        return response()->json([
            'users' => $users,
        ]);
    }

    public function getUserMusics(Request $request)
    {
        $user = Auth::user();

        if ($user) {
            $musics = DB::select("
                SELECT musics.*
                FROM musics
                INNER JOIN user_rel_musics ON user_rel_musics.music_id = musics.id
                WHERE user_rel_musics.user_id = ?
                ORDER BY musics.id
            ", [$user->id]);

            $otherMusics = DB::select("
            SELECT musics.*
            FROM musics
            LEFT JOIN user_rel_musics 
            ON user_rel_musics.music_id = musics.id 
            AND user_rel_musics.user_id = ?
            WHERE user_rel_musics.music_id IS NULL
            ORDER BY musics.id
        ", [$user->id]);

            return response()->json([
                'user' => $user,
                'musics' => $musics,
                'otherMusics' => $otherMusics,
            ]);
        } else {
            return response()->json([
                'error' => 'Usuário não autenticado',
            ], 401);
        }
    }

    public function linkSong(Request $request)
    {
        $user = Auth::user();
        $userRelation = User::where('id', $user->id)->first();
        $trackId = $request->input('trackId');
        $action = $request->input('action'); // 'link' ou 'unlink'

        if ($user) {
            if ($action === 'link') {
                if (!$userRelation->musics()->where('music_id', $trackId)->exists()) {
                    $userRelation->musics()->attach($trackId);
                    return response()->json([
                        'success' => true,
                        'message' => 'Música vinculada com sucesso.',
                    ]);
                } else {
                    return response()->json([
                        'error' => 'Música já está vinculada.',
                    ], 400);
                }
            } elseif ($action === 'unlink') {
                if ($userRelation->musics()->where('music_id', $trackId)->exists()) {
                    $userRelation->musics()->detach($trackId);
                    return response()->json([
                        'success' => true,
                        'message' => 'Música desvinculada com sucesso.',
                    ]);
                } else {
                    return response()->json([
                        'error' => 'Música não está vinculada.',
                    ], 400);
                }
            } else {
                return response()->json([
                    'error' => 'Ação inválida.',
                ], 400);
            }
        } else {
            return response()->json([
                'error' => 'Usuário não autenticado.',
            ], 401);
        }
    }

    public function associateUser($musicId, $userId){

        $user = User::where('id', $userId)->first();
        $user->musics()->attach($musicId);
    }
}
