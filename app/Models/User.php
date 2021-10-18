<?php

namespace App\Models;

use App\Models\PresenceToken;

use Carbon\Carbon;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Arr;

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

    public function generatePresenceToken(){
        if ($this->hasRole('operator')){
            $token = PresenceToken::firstOrNew(['user_id' => $this->id]);
            $chars = ['1','2','3','4','5','6','7','8','9','0','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
            $tokenChars = implode(Arr::random($chars,6));
            while (PresenceToken::firstWhere('token',$tokenChars) != null) $tokenChars = implode(Arr::random($chars,6)); //preventing duplicates
            $token->token = $tokenChars;
            $token->save();
            return $token;
        }
    }

    public function getPresenceToken(){
        $token = $this->presenceToken;
        if ($token == null) {
            $token = $this->generatePresenceToken();
        }
        return $token;
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
