import React, { useState, useRef, useMemo, useEffect } from "react";
import JoditEditor from "jodit-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../Sidebar";
import { useForm } from "react-hook-form";
import { adminToken, apiUrl } from "../../common/Http";
import { toast } from "react-toastify";
import Layout from "../../common/Layout";

export const Edit = ({ placeholder }) => {
  const [disable, setDisable] = useState(false);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [sizesChecked, setSizesChecked] = useState([]);
  const [products, setProducts] = useState([]);
  const [productImages, setProductImages] = useState([]);
  const params = useParams();

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: async () => {
      const res = await fetch(`${apiUrl}/products/${params.id}`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${adminToken()}`,
        },
      })
        .then((res) => {
          return res.json();
        })
        .then((result) => {
          // console.log(result);
          if (result.status === 200) {
            setProductImages(result.data.product_images);
            setSizesChecked(result.productSizes);
            reset({
              title: result.data.title,
              category: result.data.category_id,
              brand: result.data.brand_id,
              short_description: result.data.short_description,
              description: result.data.description,
              price: result.data.price,
              compare_price: result.data.compare_price,
              sku: result.data.sku,
              barcode: result.data.barcode,
              quantity: result.data.quantity,
              is_featured: result.data.is_featured,
              status: result.data.status,
              // image: result.data.image,
            });
          } else {
            console.log("Something went wrong");
          }
        })
        .catch((error) => console.log(error));
    },
  });

  const editor = useRef(null);
  const [content, setContent] = useState("");

  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: placeholder || "Start typings...",
    }),
    [placeholder]
  );

  const saveProduct = async (data) => {
    const formData = { ...data, description: content };
    // console.log(formData);
    setDisable(true);
    const res = await fetch(`${apiUrl}/products/${params.id}`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${adminToken()}`,
      },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        return res.json();
      })
      .then((result) => {
        // console.log(result);
        setDisable(false);
        if (result.status === 200) {
          toast.success(result.message);
          navigate("/admin/products");
        } else {
          const formErrors = result.errors;
          if (formErrors) {
            Object.keys(formErrors).forEach((field) => {
              setError(field, { message: formErrors[field][0] });
            });
            console.log(formErrors);
          }
        }
      })
      .catch((error) => console.log(error));
  };

  const fetchCategories = async () => {
    const res = await fetch(`${apiUrl}/categories`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${adminToken()}`,
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((result) => {
        // console.log(result);

        if (result.status === 200) {
          setCategories(result.data);
        } else {
          console.log("Something went wrong");
        }
      })
      .catch((error) => console.log(error));
  };

  const fetchBrands = async () => {
    const res = await fetch(`${apiUrl}/brands`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${adminToken()}`,
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((result) => {
        // console.log(result);

        if (result.status === 200) {
          setBrands(result.data);
        } else {
          console.log("Something went wrong");
        }
      })
      .catch((error) => console.log(error));
  };

  const fetchSizes = async () => {
    const res = await fetch(`${apiUrl}/sizes`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${adminToken()}`,
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((result) => {
        // console.log(result);

        if (result.status === 200) {
          setSizes(result.data);
        } else {
          console.log("Something went wrong");
        }
      })
      .catch((error) => console.log(error));
  };

  const handleFile = async (event) => {
    const formData = new FormData();
    const file = event.target.files[0];
    formData.append("image", file);
    formData.append("product_id", params.id);
    setDisable(true);

    const res = await fetch(`${apiUrl}/save-product-image`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${adminToken()}`,
      },
      body: formData,
    })
      .then((res) => {
        return res.json();
      })
      .then((result) => {
        console.log(result);
        setDisable(false);
        event.target.value = "";
        // gallery.push(result.data.id);
        // setGallery(gallery);

        // galleryImages.push(result.data.image_url);
        // setGalleryImages(galleryImages);
        if (result.status === 200) {
          productImages.push(result.data);
          setProductImages(productImages);
          // setBrands(result.data);
        } else {
          toast.error(result.errors.image[0]);
        }
      })
      .catch((error) => console.log(error));
  };

  const deleteImage = async (id) => {
    // console.log(1);
    if (confirm("Are you sure you want to delete image?")) {
      const res = await fetch(`${apiUrl}/delete-product-image/${id}`, {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${adminToken()}`,
        },
        // body:
      })
        .then((res) => {
          return res.json();
        })
        .then((result) => {
          // console.log(result);

          if (result.status === 200) {
            const newProductImages = productImages.filter(
              (image) => image.id != id
            );
            setProductImages(newProductImages);
            toast.success(result.message);
          } else {
            console.log("Something went wrong");
          }
        })
        .catch((error) => console.log(error));
    }
  };

  const changeImage = async (image) => {    
    const res = await fetch(
      `${apiUrl}/change-product-default-image?product_id=${params.id}&img=${image}`,
      {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${adminToken()}`,
        },
        // body:
      }
    )
      .then((res) => {
        return res.json();
      })
      .then((result) => {
        // console.log(result);

        if (result.status === 200) {
          toast.success(result.message);
        } else {
          console.log("Something went wrong");
        }
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    fetchCategories();
    fetchBrands();
    fetchSizes();
  }, []);

  return (
    <Layout>
      <div className="container mb-5">
        <div className="row">
          <div className="d-flex justify-content-between mt-5 pb-3">
            <h4 className="h4 pb-0 mb-0">Products | Edit</h4>
            <Link to="/admin/products" className="btn btn-primary">
              Back
            </Link>
          </div>
          <div className="col-md-3">
            <Sidebar />
          </div>
          <div className="col-md-9">
            <form onSubmit={handleSubmit(saveProduct)}>
              <div className="card shadow">
                <div className="card-body p-4">
                  <div className="mb-3">
                    <label htmlFor="" className="form-label">
                      Title
                    </label>
                    <input
                      {...register("title", {
                        required: "The title field is required",
                      })}
                      type="text"
                      className={`form-control ${errors.title && "is-invalid"}`}
                      placeholder="Title"
                    />{" "}
                    {errors.title && (
                      <p className="invalid-feedback">
                        {errors.title?.message}
                      </p>
                    )}
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="" className="form-label">
                          Category
                        </label>
                        <select
                          {...register("category", {
                            required: "Please select Category",
                          })}
                          className={`form-control ${
                            errors.category && "is-invalid"
                          }`}
                        >
                          <option value="">Select a Category</option>
                          {categories &&
                            categories.map((category) => {
                              return (
                                <option
                                  key={`category - ${category.id}`}
                                  value={category.id}
                                >
                                  {category.name}
                                </option>
                              );
                            })}
                        </select>
                        {errors.category && (
                          <p className="invalid-feedback">
                            {errors.category?.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="" className="form-label">
                          Brand
                        </label>
                        <select {...register("brand")} className="form-control">
                          <option value="">Select a Brand</option>
                          {brands &&
                            brands.map((brand) => {
                              return (
                                <option
                                  key={`brand - ${brand.id}`}
                                  value={brand.id}
                                >
                                  {brand.name}
                                </option>
                              );
                            })}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="" className="form-label">
                      Short Description
                    </label>
                    <textarea
                      {...register("short_description")}
                      className="form-control"
                      placeholder="Short Description"
                      rows={5}
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="" className="form-label">
                      Description
                    </label>
                    <JoditEditor
                      ref={editor}
                      value={content}
                      config={config}
                      tabIndex={1} // tabIndex of textarea
                      onBlur={(newContent) => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
                    />
                  </div>

                  <h3 className="py-3 mb-3 border-bottom">Price</h3>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="" className="form-label">
                          Price
                        </label>
                        <input
                          {...register("price", {
                            required: "The price field is required",
                          })}
                          type="text"
                          placeholder="Price"
                          className={`form-control ${
                            errors.price && "is-invalid"
                          }`}
                        />
                        {errors.price && (
                          <p className="invalid-feedback">
                            {errors.price?.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="" className="form-label">
                          Discounted Price
                        </label>
                        <input
                          {...register("compare_price")}
                          type="text"
                          placeholder="Discounted Price"
                          className="form-control"
                        />
                      </div>
                    </div>
                  </div>

                  <h3 className="py-3 mb-3 border-bottom">Inventory</h3>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="" className="form-label">
                          SKU
                        </label>
                        <input
                          {...register("sku", {
                            required: "The sku field is required",
                          })}
                          type="text"
                          placeholder="Sku"
                          className={`form-control ${
                            errors.sku && "is-invalid"
                          }`}
                        />
                        {errors.sku && (
                          <p className="invalid-feedback">
                            {errors.sku?.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="" className="form-label">
                          Barcode
                        </label>
                        <input
                          {...register("barcode")}
                          type="text"
                          placeholder="Barcode"
                          className="form-control"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="" className="form-label">
                          Quantity
                        </label>
                        <input
                          {...register("quantity")}
                          type="text"
                          placeholder="Quantity"
                          className="form-control"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="" className="form-label">
                          Status
                        </label>
                        <select
                          {...register("status", {
                            required: "Please select a status",
                          })}
                          className={`form-control ${
                            errors.status && "is-invalid"
                          }`}
                        >
                          <option value="">Select a Status</option>
                          <option value="1">Active</option>
                          <option value="0">Block</option>
                        </select>
                        {errors.status && (
                          <p className="invalid-feedback">
                            {errors.status?.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="" className="form-label">
                        Featured
                      </label>
                      <select
                        {...register("is_featured", {
                          required: "Please select a featured",
                        })}
                        className={`form-control ${
                          errors.is_featured && "is-invalid"
                        }`}
                      >
                        <option value="">Select a Featured</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                      {errors.is_featured && (
                        <p className="invalid-feedback">
                          {errors.is_featured?.message}
                        </p>
                      )}
                    </div>

                    <h3 className="py-3 mb-3 border-bottom">Sizes</h3>
                    <div className="mb-3">
                      {sizes &&
                        sizes.map((size) => {
                          return (
                            <div
                              className="form-check-inline ps-2"
                              key={`size-${size.id}`}
                            >
                              <input
                                {...register("sizes")}
                                className="form-check-input"
                                type="checkbox"
                                value={size.id}
                                checked={sizesChecked.includes(size.id)}
                                id={`size-${size.id}`}
                                onChange={(event) => {
                                  if (event.target.checked) {
                                    setSizesChecked([...sizesChecked, size.id]);
                                  } else {
                                    setSizesChecked(
                                      sizesChecked.filter(
                                        (sid) => sid != size.id
                                      )
                                    );
                                  }
                                }}
                              />
                              <label
                                className="form-check-label ps-1"
                                htmlFor={`size-${size.id}`}
                              >
                                {size.name}
                              </label>
                            </div>
                          );
                        })}
                    </div>

                    <h3 className="py-3 mb-3 border-bottom">Gallery</h3>
                    <div className="mb-3">
                      <label htmlFor="" className="form-label">
                        Image
                      </label>
                      <input
                        onChange={handleFile}
                        type="file"
                        placeholder="Choose file"
                        className="form-control"
                      />
                    </div>

                    <div className="mb-3">
                      <div className="row">
                        {productImages &&
                          productImages.map((image, index) => {
                            return (
                              <div
                                className="col-md-3"
                                key={`image-${image}-${index}`}
                              >
                                <div className="card shadow">
                                  <img
                                    src={image.image_url}
                                    alt=""
                                    className="w-100"
                                  />
                                </div>
                                <button
                                  type="button"
                                  className="btn btn-danger my-1 w-100"
                                  onClick={() => deleteImage(image.id)}
                                >
                                  Delete
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-secondary mb-5 w-100"
                                  onClick={() => changeImage(image.image)}
                                >
                                  Set as Default
                                </button>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <button disabled={disable} className="btn btn-primary mt-3">
                Update
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};
