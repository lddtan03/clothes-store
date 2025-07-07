<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductSize;
use App\Models\TempImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Validator;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class ProductController extends Controller
{
    //This method will return all products
    public function index()
    {
        $products = Product::orderBy('created_at', 'DESC')
            ->with(['product_images', 'product_sizes'])
            ->get();

        return response()->json([
            'status' => 200,
            'data' => $products
        ], 200);
    }

    //This method will store a new product
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required',
            'price' => 'required|numeric',
            'category' => 'required|integer',
            'sku' => 'required|unique:products,sku',
            'status' => 'required',
            'is_featured' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        $product = new Product();
        $product->title = $request->title;
        $product->price = $request->price;
        $product->compare_price = $request->compare_price;
        $product->description = $request->description;
        $product->short_description = $request->short_description;
        $product->img = $request->img;
        $product->category_id = $request->category;
        $product->brand_id = $request->brand;
        $product->quantity = $request->quantity;
        $product->sku = $request->sku;
        $product->barcode = $request->barcode;
        $product->status = $request->status;
        $product->is_featured = $request->is_featured;
        $product->save();

        if (!empty($request->sizes)) {
            foreach ($request->sizes as $sizeId) {
                $productSize = new ProductSize();
                $productSize->size_id = $sizeId;
                $productSize->product_id = $product->id;
                $productSize->save();
            }
        }

        if (!empty($request->gallery)) {
            foreach ($request->gallery as $key => $tempImageId) {
                $tempImage = TempImage::find($tempImageId);

                //Large thumbnail
                $extArray = explode('.', $tempImage->name);
                $ext = end($extArray);
                $ran = rand(1000, 10000);

                $imageName = $product->id . '-' . $ran . time() . '.' . $ext;
                $manager = new ImageManager(Driver::class);
                $img = $manager->read(public_path('uploads/temp/' . $tempImage->name));
                $img->scaleDown(1200);
                $img->save(public_path('uploads/products/large/' . $imageName));

                //Small thumbnail
                // $manager = new ImageManager(Driver::class);
                $img2 = $manager->read(public_path('uploads/temp/' . $tempImage->name));
                $img2->coverDown(400, 460);
                $img2->save(public_path('uploads/products/small/' . $imageName));

                $productImage = new ProductImage();
                $productImage->image = $imageName;
                $productImage->product_id = $product->id;
                $productImage->save();

                if ($key == 0) {
                    $product->img = $imageName;
                    $product->save();
                }
            }
        }

        return response()->json([
            'status' => 200,
            'message' => 'Product added successfully.',
            'data' => $product
        ], 200);
    }

    //This method will return a single product
    public function show($id)
    {
        $product = Product::with(['product_images', 'product_sizes'])->find($id);

        if ($product == null) {
            return response()->json([
                'status' => 404,
                'error' => 'Product not found.',
                'data' => []
            ], 404);
        }

        $productSizes = $product->product_sizes()->pluck('size_id');

        return response()->json([
            'status' => 200,
            'data' => $product,
            'productSizes' => $productSizes
        ]);
    }

    //This method will update a product
    public function update($id, Request $request)
    {
        $product = Product::find($id);

        if ($product == null) {
            return response()->json([
                'status' => 404,
                'error' => 'Product not found.',
                'data' => []
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'required',
            'price' => 'required|numeric',
            'category' => 'required|integer',
            'sku' => 'required|unique:products,sku,' . $id . 'id',
            'status' => 'required',
            'is_featured' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        $product->title = $request->title;
        $product->price = $request->price;
        $product->compare_price = $request->compare_price;
        $product->description = $request->description;
        $product->short_description = $request->short_description;
        $product->img = $request->img;
        $product->category_id = $request->category;
        $product->brand_id = $request->brand;
        $product->quantity = $request->quantity;
        $product->sku = $request->sku;
        $product->barcode = $request->barcode;
        $product->status = $request->status;
        $product->is_featured = $request->is_featured;
        $product->update();

        if (!empty($request->sizes)) {
            ProductSize::where("product_id", $product->id)->delete();
            foreach ($request->sizes as $sizeId) {
                $productSize = new ProductSize();
                $productSize->size_id = $sizeId;
                $productSize->product_id = $product->id;
                $productSize->save();
            }
        }

        return response()->json([
            'status' => 200,
            'message' => 'Product updated successfully.',
            'data' => $product
        ], 200);
    }

    //This method will delete a product
    public function destroy($id)
    {
        $product = Product::with('product_images')->find($id);

        if ($product == null) {
            return response()->json([
                'status' => 404,
                'error' => 'Product not found.',
                'data' => []
            ], 404);
        }

        if ($product->product_images) {
            foreach ($product->product_images as $productImage) {
                File::delete(public_path('uploads/products/large/' . $productImage->image));
                File::delete(public_path('uploads/products/small/' . $productImage->image));
            }
        }

        $product->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Product destroyed successfully.',
        ], 200);
    }


    public function saveProductImage(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'image' => 'required|required|image|mimes:jpeg,png,jpg,gif'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        //Store the image
        $image = $request->file('image');
        $imageName = $request->product_id . '-' . time() . '.' . $image->extension();

        //Large thumbnail

        $manager = new ImageManager(Driver::class);
        $img = $manager->read($image->getPathName());
        $img->scaleDown(1200);
        $img->save(public_path('uploads/products/large/' . $imageName));

        //Small thumbnail
        // $manager = new ImageManager(Driver::class);
        $img2 = $manager->read($image->getPathName());
        $img2->coverDown(400, 460);
        $img2->save(public_path('uploads/products/small/' . $imageName));


        //Insert a record in product_images table
        $productImage = new ProductImage();
        $productImage->image = $imageName;
        $productImage->product_id = $request->product_id;
        $productImage->save();

        return response()->json([
            'status' => 200,
            'message' => 'ProductImage uploaded successfully.',
            'data' => $productImage
        ], 200);
    }


    public function updateDefaultImage(Request $request)
    {
        $product = Product::find($request->product_id);
        $product->img = $request->img;
        $product->save();

        return response()->json([
            'status' => 200,
            'message' => 'Product default image changed successfully.',
            'data' => $product
        ], 200);
    }

    public function deleteProductImage($id)
    {
        $productImage = ProductImage::find($id);
        if ($productImage == null) {
            return response()->json([
                'status' => 400,
                'message' => 'Image not found',
            ], 400);
        }

        File::delete(public_path('uploads/products/large/' . $productImage->image));
        File::delete(public_path('uploads/products/small/' . $productImage->image));

        $productImage->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Product image deleted successfully.',
        ], 200);
    }
}
