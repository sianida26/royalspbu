<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Permission\Traits\HasRoles;
use Laravel\Passport\HasApiTokens;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class User extends Authenticatable
{
    use HasFactory, Notifiable, SoftDeletes, HasRoles, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'email',
        'username',
        'password',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [];

    /**
     * Get the presenceToken associated with the User
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function presenceToken(): HasOne
    {
        return $this->hasOne(PresenceToken::class);
    }

    /**
     * Get all of the presence for the User
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function presences(): HasMany
    {
        return $this->hasMany(Presence::class);
    }

    /**
     * Get all of the dailyPumpReports for the User
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function dailyPumpReports(): HasMany
    {
        return $this->hasMany(DailyPumpReport::class, 'reporter_id');
    }


    // helper functions
    public function isTodayPresence(){
        return $this->presence()->whereDate('timestamp', Carbon::today())->exists();
    }
}
