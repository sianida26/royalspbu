<?php

namespace App\Models;

use Carbon\Carbon;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

use Spatie\Permission\Traits\HasRoles;

use Laravel\Passport\HasApiTokens;


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

    /**
     * Get all of the totalizatorReports for the User
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function totalizatorReports(): HasMany
    {
        return $this->hasMany(TotalizatorReport::class, 'reporter_id');
    }

    /**
     * Get all of the persediaanReports for the User
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function persediaanReports(): HasMany
    {
        return $this->hasMany(PersediaanReport::class, 'reporter_id');
    }

    public static function getUsersOnDate($date){
        return self::withTrashed()
            ->whereDate('created_at','<=',$date)
            ->where(function($query) use ($date){
                return $query->whereNull('deleted_at')
                    ->orWhereDate('deleted_at','<=',$date);
            })
            ->get();
    }

    // helper functions
    public function isTodayPresence(){
        return $this->presences()->whereDate('timestamp', Carbon::today())->exists();
    }

    public function isPresenceOnDate($date){
        return $this->presences()->whereDate('timestamp', $date)->exists();
    }

    public function getPresenceOnDate($date){
        return $this->presences()->whereDate('timestamp', $date)->first();
    }
}
