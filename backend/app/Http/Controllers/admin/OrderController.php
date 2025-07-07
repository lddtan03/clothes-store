<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index()
    {
        $order = Order::orderBy('created_at', 'DESC')->get();

        return response()->json([
            'status' => 200,
            'data' => $order,
        ], 200);
    }

    public function show($id)
    {
        $order = Order::with('items', 'items.product')->find($id);

        if ($order == null) {
            return response()->json([
                'status' => 400,
                'message' => 'Image not found',
                'data' => []
            ], 400);
        }

        return response()->json([
            'status' => 200,
            'data' => $order,
        ], 200);
    }

    public function update($id, Request $request)
    {
        $order = Order::find($id);

        if ($order == null) {
            return response()->json([
                'status' => 404,
                'message' => 'Order not found.',
            ], 404);
        }

        $order->status = $request->status;
        $order->payment_status = $request->payment_status;
        $order->save();

        return response()->json([
            'status' => 200,
            'data' => $order,
            'message' => 'Order updated successfully.',
        ], 200);
    }
}
