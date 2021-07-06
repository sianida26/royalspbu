<?php

namespace App\Rules;

use Illuminate\Support\Facades\Storage;
use Illuminate\Contracts\Validation\Rule;

class FileExists implements Rule
{
    /**
     * Create a new rule instance.
     *
     * @return void
     */

    private $path;

    public function __construct($path = "/")
    {
        $this->path = $path;
    }

    /**
     * Determine if the validation rule passes.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @return bool
     */
    public function passes($attribute, $value)
    {
        return Storage::disk('local')->exists($this->path.$value);
        //
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return 'File tidak tersedia';
    }
}
