import React, { useEffect, useState } from "react";
import Layout from "./common/Layout";
import ProductImg from "../assets/images/Mens/eight.jpg";
import { Link, useSearchParams } from "react-router-dom";
import { apiUrl } from "./common/Http";

function Shop() {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [categoryChecked, setCategoryChecked] = useState(() => {
    const category = searchParams.get("category");
    return category ? category.split(",") : [];
  });
  const [brandChecked, setBrandChecked] = useState(() => {
    const brand = searchParams.get("brand");
    return brand ? brand.split(",") : [];
  });

  const fetchProducts = async () => {
    let search = [];
    let params = "";

    if (categoryChecked.length > 0) {
      search.push(["category", categoryChecked]);
    }

    if (brandChecked.length > 0) {
      search.push(["brand", brandChecked]);
    }

    if (search.length > 0) {
      params = new URLSearchParams(search);
      setSearchParams(params);
    } else {
      setSearchParams([]);
    }

    const res = await fetch(`${apiUrl}/get-products?${params}`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((result) => {
        if (result.status === 200) {
          setProducts(result.data);
        } else {
          console.log("Something went wrong");
        }
      })
      .catch((error) => console.log(error));
  };

  const fetchCategories = async () => {
    const res = await fetch(`${apiUrl}/get-categories`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((result) => {
        if (result.status === 200) {
          setCategories(result.data);
        } else {
          console.log("Something went wrong");
        }
      })
      .catch((error) => console.log(error));
  };

  const fetchBrands = async () => {
    const res = await fetch(`${apiUrl}/get-brands`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((result) => {
        if (result.status === 200) {
          setBrands(result.data);
        } else {
          console.log("Something went wrong");
        }
      })
      .catch((error) => console.log(error));
  };

  const handleCategory = (event) => {
    const { checked, value } = event.target;
    if (checked) {
      setCategoryChecked((prev) => [...prev, value]);
    } else {
      setCategoryChecked(categoryChecked.filter((id) => id !== value));
    }
  };

  const handleBrand = (event) => {
    const { checked, value } = event.target;
    if (checked) {
      setBrandChecked((prev) => [...prev, value]);
    } else {
      setBrandChecked(brandChecked.filter((id) => id !== value));
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchBrands();
    fetchProducts();
  }, [categoryChecked, brandChecked]);

  return (
    <Layout>
      <div className="container">
        <nav aria-label="breadcrumb" className="py-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="#">Home</a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Shop
            </li>
          </ol>
        </nav>
        <div className="row">
          <div className="col-md-3">
            <div className="card shadow border-0 mb-3">
              <div className="card-body p-4">
                <h3 className="mb-3">Categories</h3>
                <ul>
                  {categories &&
                    categories.map((category) => {
                      return (
                        <li className="mb-2" key={category.id}>
                          <input
                            defaultChecked={
                              searchParams.get("category")
                                ? searchParams
                                    .get("category")
                                    .includes(category.id)
                                : false
                            }
                            type="checkbox"
                            value={category.id}
                            onClick={handleCategory}
                          />
                          <label htmlFor="" className="ps-2">
                            {category.name}
                          </label>
                        </li>
                      );
                    })}
                </ul>
              </div>
            </div>
            <div className="card shadow border-0 mb-3">
              <div className="card-body p-4">
                <h3 className="mb-3">Brands</h3>
                <ul>
                  {brands &&
                    brands.map((brand) => {
                      return (
                        <li className="mb-2" key={brand.id}>
                          <input
                            defaultChecked={
                              searchParams.get("brand")
                                ? searchParams.get("brand").includes(brand.id)
                                : false
                            }
                            type="checkbox"
                            value={brand.id}
                            onClick={handleBrand}
                          />
                          <label htmlFor="" className="ps-2">
                            {brand.name}
                          </label>
                        </li>
                      );
                    })}
                </ul>
              </div>
            </div>
          </div>
          <div className="col-md-9">
            <div className="row pb-5">
              {products &&
                products.map((product) => {
                  return (
                    <div className="col-md-4 col-6" key={product.id}>
                      <div className="product card border-0">
                        <div className="card-img">
                          <Link to={`/product/${product.id}`}>
                            <img
                              src={product.image_url}
                              alt=""
                              className="w-100"
                            />
                          </Link>
                        </div>
                        <div className="card-body pt-3">
                          <Link to={`/product/${product.id}`}>
                            {product.title}
                          </Link>
                          <div className="price">
                            {product.price} &nbsp;
                            <span className="text-decoration-line-through">
                              {product.compare_price}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Shop;
