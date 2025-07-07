import React, { useEffect, useState } from "react";
import Layout from "./common/Layout";
import { Link, useParams } from "react-router-dom";
import Sidebar from "./Sidebar";
import { apiUrl, userToken } from "./common/Http";
import { toast } from "react-toastify";

const Confirmation = () => {
  const [order, setOrder] = useState([]);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  const params = useParams();

  const fetchOrder = async () => {
    const res = await fetch(`${apiUrl}/get-order-detail/${params.id}`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${userToken()}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setLoading(false);
        if (result.status === 200) {
          setOrder(result.data);
          setItems(result.data.items);
        } else {
          console.log(result.message);
        }
      });
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  return (
    <Layout>
      <div className="container py-5">
        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}
        {!loading && order && (
          <div>
            <div className="row">
              <h1 className="text-center fw-bold text-success">Thank You!</h1>
              <p className="text-muted text-center">
                Your order has been successfully placed.
              </p>
            </div>
            <div className="card shadow">
              <div className="card-body">
                <h3 className="fw-bord">Order Summary</h3>
                <hr />
                <div className="row">
                  <div className="col-md-6">
                    <p>
                      <strong>Order ID: </strong> #{order.id}
                    </p>
                    <p>
                      <strong>Date: </strong> {order.create_at}
                    </p>
                    <p>
                      <strong>Status: </strong>
                      {order.status == "pending" && (
                        <span className="badge bg-warning">Pending</span>
                      )}

                      {order.status == "shipped" && (
                        <span className="badge bg-warning">Shipped</span>
                      )}

                      {order.status == "delevered" && (
                        <span className="badge bg-success">Delevered</span>
                      )}

                      {order.status == "cancelled" && (
                        <span className="badge bg-danger">Cancelled</span>
                      )}
                    </p>
                    <p>
                      <strong>Payment Method: </strong> COD
                    </p>
                  </div>
                  <div className="col-md-6">
                    <p>
                      <strong>Customer: </strong>
                      {order.name}
                    </p>
                    <p>
                      <strong>Address: </strong>
                      {order.address}, {order.city} {order.state} {order.zip}
                    </p>
                    <p>
                      <strong>Contact: </strong>
                      {order.mobile}
                    </p>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <table className="table table-bordered table-striped">
                        <thead className="table-light">
                          <tr>
                            <th>Item</th>
                            <th>Quantity</th>
                            <th width="150">Price</th>
                            <th width="150">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {items &&
                            items.map((item) => {
                              return (
                                <tr key={item.id}>
                                  <td>{item.name}</td>
                                  <td>{item.quantity}</td>
                                  <td>{item.unit_price}</td>
                                  <td>{item.price}</td>
                                </tr>
                              );
                            })}
                        </tbody>
                        <tfoot>
                          <tr>
                            <td colSpan={3}>Subtotal</td>
                            <td>${order.subtotal}</td>
                          </tr>
                          <tr>
                            <td className="text-end fw-bold" colSpan={3}>
                              Shipping
                            </td>
                            <td>${order.shipping}</td>
                          </tr>
                          <tr>
                            <td className="text-end fw-bold" colSpan={3}>
                              Grand Total
                            </td>
                            <td>${order.grand_total}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                    <div className="text-center">
                      <Link to="/account/orders" className="btn btn-primary">
                        View Order Details
                      </Link>
                      <Link to="/" className="btn btn-outline-secondary ms-2">
                        Continue Shopping
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {!loading && !order && (
          <div className="row">
            <h1 className="text-center fw-bold text-muted">Order Not Found</h1>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Confirmation;
