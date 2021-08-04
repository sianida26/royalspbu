<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * table name: tabungans
 * 
 * columns:
 * - id : unsignedBigInteger, pk, ai
 * - amount : unsignedBigInteger, default: 0
 * - report_filename : string
 * - created_at : timestamp
 */

class Tabungan extends Model
{
    use HasFactory;

    public $timestamps = false;
}
