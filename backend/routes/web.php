<?php

use App\Http\Controllers\MusicsController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/get-musics', [MusicsController::class, 'getUsersWithMusic']);
Route::get('/get-user-musics', [MusicsController::class, 'getUserMusics']);
Route::post('/music/{music}/user/{user}', [MusicsController::class, 'associateUser']);

Route::post('/link-song', [MusicsController::class, 'linkSong']);
require __DIR__.'/auth.php';
