<?php

namespace App\Http\Controllers;

use App\Models\User;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;


class AuthController extends Controller
{
    //

    public function login(Request $request){

        $rules = [
            'username' => ['required'],
            'password' => ['required'],
        ];

        $messages = [
            'required' => 'Harus diisi',
        ];

        $request->validate($rules, $messages);
        if (Auth::attempt(['username' => $request->username, 'password' => $request->password, 'is_active' => true])){
            $user = User::firstWhere('username', $request->username);
            return [
                'username' => $user->username,
                'name' => $user->name,
                'role' => $user->roles->first()->name,
                'token' => $user->createToken('auth token')->accessToken,
            ];
        } else {
            abort(422, 'username atau password salah');
        }
    }

    public function logout(Request $request){

        if ($request->user() !== null){
            $request->user()->token()->revoke();
            return 'ok';
        }
        abort(404);
    }

    public function submitNewPassword(Request $request){

        return 'ok';
    }

    //TODO: prevent submitting new password same as old password
    public function changePassword(Request $request){
        $user = Auth::user();

        $rules = [
            'old' => [
                'required',
                function($attribute, $value, $fail){ //validate old password
                    if (!Hash::check($value, Auth::user()->password)){
                        $fail('Password salah');
                    }
                },
            ],
            'new' => ['required','min:8'],
        ];

        $messages = [
            'required' => 'Harus diisi',
        ];

        $request->validate($rules, $messages);

        return 'ok';
    }
}
