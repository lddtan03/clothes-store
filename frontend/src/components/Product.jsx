import React, { useContext, useEffect, useState } from "react";
import Layout from "./common/Layout";
import { Link, useParams } from "react-router-dom";
import { Rating } from "react-simple-star-rating";
import { Swiper, SwiperSlide } from "swiper/react";
import { Thumbs, FreeMode, Navigation, Pagination } from "swiper/modules";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import ProductImgOne from "../assets/images/Mens/five.jpg";
import ProductImgTwo from "../assets/images/Mens/six.jpg";
import ProductImgThree from "../assets/images/Mens/seven.jpg";
import { apiUrl } from "./common/Http";
import { CartContext } from "./context/Cart";
import { toast } from "react-toastify";

const Product = () => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [rating, setRating] = useState(4);
  const [product, setProduct] = useState([]);
  const [productImages, setProductImages] = useState([]);
  const [productSizes, setProductSizes] = useState([]);
  const [sizeSelected, setSizeSelected] = useState(null);

  const params = useParams();
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = () => {
    if (productSizes.length > 0) {
      if (sizeSelected == null) {
        toast.error("Please select a size");
      } else {
        addToCart(product, sizeSelected);
        toast.success("Product successfully add to cart");
      }
    } else {
      addToCart(product, null);
      toast.success("Product successfully add to cart");
    }
  };

  const fetchProduct = async () => {
    const res = await fetch(`${apiUrl}/get-product/${params.id}`, {
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
          setProduct(result.data);
          setProductImages(result.data.product_images);
          setProductSizes(result.data.product_sizes);
        } else {
          console.log("Something went wrong");
        }
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  return (
    <Layout>
      <div className="container product-detail">
        <div className="row">
          <div className="col-md-12">
            <nav aria-label="breadcrumb" className="py-4">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/">Home</Link>
                </li>
                <li className="breadcrumb-item" aria-current="page">
                  <Link to="/shop">Shop</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Dummy Product Title
                </li>
              </ol>
            </nav>
          </div>
        </div>
        <div className="row mb-5">
          <div className="col-md-5">
            <div className="row">
              <div className="col-2">
                <Swiper
                  style={{
                    "--swiper-navigation-color": "#000",
                    "--swiper-pagination-color": "#000",
                  }}
                  onSwiper={setThumbsSwiper}
                  loop={true}
                  direction={`vertical`}
                  spaceBetween={10}
                  slidesPerView={6}
                  freeMode={true}
                  watchSlidesProgress={true}
                  modules={[FreeMode, Navigation, Thumbs, Pagination]}
                  className="mySwiper mt-2"
                >
                  {productImages &&
                    productImages.map((product_image) => {
                      return (
                        <SwiperSlide key={product_image.id}>
                          <div className="content">
                            <img
                              src={product_image.image_url}
                              alt=""
                              height={100}
                              className="w-100"
                            />
                          </div>
                        </SwiperSlide>
                      );
                    })}
                </Swiper>
              </div>
              <div className="col-10">
                <Swiper
                  style={{
                    "--swiper-navigation-color": "#000",
                    "--swiper-pagination-color": "#000",
                  }}
                  loop={true}
                  spaceBetween={0}
                  navigation={true}
                  thumbs={{ swiper: thumbsSwiper }}
                  modules={[FreeMode, Navigation, Thumbs, Pagination]}
                  className="mySwiper"
                >
                  {productImages &&
                    productImages.map((product_image) => {
                      return (
                        <SwiperSlide key={product_image.id}>
                          <div className="content">
                            <img
                              src={product_image.image_url}
                              alt=""
                              className="w-100"
                            />
                          </div>
                        </SwiperSlide>
                      );
                    })}
                </Swiper>
              </div>
            </div>
          </div>
          <div className="col-md-7">
            <h2>{product.title}</h2>
            <div className="d-flex">
              <Rating
                size={20}
                readonly
                initialValue={rating}
                /* Available Props */
              />
              <span className="pt-1 ps-2">10 Reviews</span>
            </div>
            <div className="price h3">
              {product.price} &nbsp;{" "}
              {product.compare_price && (
                <span className="text-decoration-line-through">
                  {product.compare_price}
                </span>
              )}
            </div>
            <div>{product.short_description}</div>
            <div className="pt-3">
              <strong>Select Sizes</strong>
              <div className="sizes pt-2">
                {productSizes &&
                  productSizes.map((product_size) => {
                    return (
                      <button
                        onClick={() => setSizeSelected(product_size.size.name)}
                        className={`btn btn-size me-2 ${sizeSelected == product_size.size.name ? 'active' : ''}`}
                        key={product_size.size.id}
                      >
                        {product_size.size.name}
                      </button>
                    );
                  })}
              </div>
            </div>
            <div className="add-to-cart my-4">
              <button
                onClick={() => handleAddToCart()}
                className="btn btn-primary text-uppercase"
              >
                Add To Cart
              </button>
            </div>
            <hr />
            <div>
              <strong>SKU: </strong>
              {product.sku}
            </div>
          </div>
        </div>
        <div className="row pb-5">
          <div className="col-md-12">
            <Tabs
              defaultActiveKey="description"
              id="uncontrolled-tab-example"
              className="mb-3"
            >
              <Tab eventKey="description" title="Description">
                <div
                  dangerouslySetInnerHTML={{ __html: product.description }}
                ></div>
              </Tab>
              <Tab eventKey="reviews" title="Reviews (10)">
                Reviews Area
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Product;
