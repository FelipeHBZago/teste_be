<?php

namespace App\Console\Commands;

use App\Models\Music;
use App\Models\User;
use Illuminate\Console\Command;

class ReadCsv extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:read-csv';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->importCsv();
    }

    public function csvToArray($filename = '', $delimiter = ',')
    {
        if (!file_exists($filename) || !is_readable($filename))
            return false;

        $header = null;
        $data = array();
        if (($handle = fopen($filename, 'r')) !== false) {
            while (($row = fgetcsv($handle, 1000, $delimiter)) !== false) {
                if (!$header)
                    $header = $row;
                else
                    $data[] = array_combine($header, $row);
            }
            fclose($handle);
        }

        return $data;
    }

    public function importCsv()
    {
        $musicFile = public_path('music.csv');
        $musicsArray = $this->csvToArray($musicFile);
    
        foreach ($musicsArray as $music) {
            $cleanedMusic = [];
            foreach ($music as $key => $value) {
                $cleanKey = preg_replace('/^\x{FEFF}/u', '', $key);
                $cleanedMusic[$cleanKey] = $value;
            }
            $validateMusic = Music::where('trackId', $cleanedMusic['trackId'])->first();
            
            if (!$validateMusic) {
                Music::create($cleanedMusic);
            }
        }
    
        return 'done';
    }
}
