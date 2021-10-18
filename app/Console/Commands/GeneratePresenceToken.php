<?php

namespace App\Console\Commands;

use App\Models\User;

use Illuminate\Console\Command;
use Illuminate\Support\Str;

class GeneratePresenceToken extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'presence:generatetoken';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate a new presence token';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $count = 0;
        User::role('operator')->each(function($user) use (&$count){
            $user->generatePresenceToken();
            $count++;
        });

        $this->info("Success generating token for {$count} ".Str::plural('user', $count));
    }
}
