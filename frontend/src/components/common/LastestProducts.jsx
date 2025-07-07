import React, { useEffect, useState } from "react";
import ProductImg from "../../assets/images/Mens/eight.jpg";
import { adminToken, apiUrl } from "./Http";

const LastestProducts = () => {
  const [latestProducts, setLatestProducts] = useState([]);

  const fetchLatestProducts = async () => {
    const res = await fetch(`${apiUrl}/get-latest-products`, {
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
        if (result.status === 200) {
          setLatestProducts(result.data);
        } else {
          console.log("Something went wrong");
        }
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    fetchLatestProducts();
  }, []);

  
  return (
    <section className="section-2 pt-5">
      <div className="container">
        <h2>New Arrivals</h2>
        <div className="row mt-4">
          {latestProducts &&
            latestProducts.map((product) => {
              return (
                <div className="col-md-3 col-6" key={product.id}>
                  <div className="product card border-0">
                    <div className="card-img">
                      <img src={product.image_url} alt="" className="w-100" />
                    </div>
                    <div className="card-body pt-3">
                      <a href="">{product.title}</a>
                      <div className="price">
                        {product.price} &nbsp;
                        {product.compare_price && (
                          <span className="text-decoration-line-through">
                            {product.compare_price}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

          {/* <div className="col-md-3 col-6">
            <div className="product card border-0">
              <div className="card-img">
                <img src={ProductImg} alt="" className="w-100" />
              </div>
              <div className="card-body pt-3">
                <a href="">Red Check Shirt for Men</a>
                <div className="price">
                  $50 <span className="text-decoration-line-through">$80</span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-3 col-6">
            <div className="product card border-0">
              <div className="card-img">
                <img src={ProductImg} alt="" className="w-100" />
              </div>
              <div className="card-body pt-3">
                <a href="">Red Check Shirt for Men</a>
                <div className="price">
                  $50 <span className="text-decoration-line-through">$80</span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-3 col-6">
            <div className="product card border-0">
              <div className="card-img">
                <img src={ProductImg} alt="" className="w-100" />
              </div>
              <div className="card-body pt-3">
                <a href="">Red Check Shirt for Men</a>
                <div className="price">
                  $50 <span className="text-decoration-line-through">$80</span>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default LastestProducts;
