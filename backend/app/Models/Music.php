<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Music extends Model
{

    protected $table = 'musics';
   
    protected $fillable = [
        'title', 'artist', 'album','isrc','platform','trackId','duration','url'
    ];

    public function users()
    {
        return $this->belongsToMany(User::class, 'user_rel_musics', 'music_id', 'user_id');
    }
}
 