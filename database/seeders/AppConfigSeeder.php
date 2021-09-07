<?php

namespace Database\Seeders;

use App\Models\AppConfig;

use Illuminate\Database\Seeder;

class AppConfigSeeder extends Seeder
{

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $data = collect([
            'default_password' => 'StdPwdSPBU2021',
        ]);

        $data->each(function($value, $key){
            if (AppConfig::where('key', $key)->exists()) return;
            $model = new AppConfig;
            $model->key = $key;
            $model->value = $value;
            $model->save();
        });
    }
}