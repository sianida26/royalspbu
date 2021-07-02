<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $userNames = [
            [
                'name' => 'developer',
                'username' => 'developer',
                'password' => 'repoleved',
                'roles' => ['developer'],
            ],
            [
                'name' => 'admin',
                'username' => 'admin',
                'password' => 'admin',
                'roles' => ['admin'],
            ],
            [
                'name' => 'operator',
                'username' => 'operator',
                'password' => 'operator',
                'roles' => ['operator'],
            ],
        ];

        collect($userNames)->map(function($name){

            $user = User::firstWhere('username',$name['username']);
            if ($user == null){
                $user = User::create([
                    'name' => $name['name'],
                    'username' => $name['username'],
                    'password' => Hash::make($name['password']),
                    'is_active' => true,
                ]);
                $user->syncRoles($name['roles']);
            }
        });
    }
}
