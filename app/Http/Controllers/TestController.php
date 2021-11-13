<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use PDF;
use App;


class TestController extends Controller
{
    //

    public function PDF(Request $request){
        // $html = '<h1>Bill</h1><p>You owe me money, dude.</p>';
        // $snappy = App::make('snappy.pdf');
        // $pdf = App::make('snappy.pdf.wrapper');
        // $pdf->loadHTML('<h1>Test</h1>');

        // $header = view()->make('PDF.persediaan.header')->render();

        $pdf = PDF::loadView('PDF.stock')
            ->setOption('dpi', 300)
            ->setOption('disable-smart-shrinking', true);
            // ->setOrientation('landscape')
            // ->setOption('header-html', $header)
            // ->setOption('margin-top', 0);
        return $pdf->inline('aaa.pdf');
    }
}
