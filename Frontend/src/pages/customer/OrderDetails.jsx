import { useEffect, useState } from "react";
import {
    Link,
    useParams,
} from "react-router-dom";

import { getOrderById } from "../../services/orderService";
import OrderStatusBadge from "../../components/order/OrderStatusBadge";
import OrderItems from "../../components/order/OrderItems";

function OrderDetails() {

    const { orderId } = useParams();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    useEffect(() => {

        const loadOrder = async () => {

            try {

                setLoading(true);
                setError("");

                const data = await getOrderById(orderId);

                setOrder(data);

            } catch (error) {

                setError(
                    error.response?.data?.detail ||
                    "Unable to load order details."
                );

            } finally {

                setLoading(false);

            }

        };


        loadOrder();

    }, [orderId]);


    // LOADING

    if (loading) {

        return (
            <div className="order-details-message">
                Loading order details...
            </div>
        );

    }


    // ERROR

    if (error) {

        return (
            <div className="order-details-message">

                <p className="home-error">
                    {error}
                </p>

                <Link
                    to="/my-orders"
                    className="confirmation-button"
                >
                    Back to My Orders
                </Link>

            </div>
        );

    }


    // ORDER NOT FOUND

    if (!order) {

        return (
            <div className="order-details-message">
                Order not found.
            </div>
        );

    }


    return (
        <div className="order-details-page">

            <div className="order-details-container">


                {/* BACK */}

                <Link
                    to="/my-orders"
                    className="food-back-link"
                >
                    ← Back to My Orders
                </Link>


                {/* HEADING */}

                <div className="order-details-heading">

                    <div>

                        <p className="section-small-title">
                            ORDER DETAILS
                        </p>

                        <h1>
                            Order #{order.id}
                        </h1>

                    </div>


                    <OrderStatusBadge
                        status={order.status}
                    />

                </div>


                {/* ORDER INFORMATION */}

                <div className="order-details-card">

                    <div className="order-details-row">

                        <span>
                            Order ID
                        </span>

                        <strong>
                            #{order.id}
                        </strong>

                    </div>

                    <OrderItems
                        items={order.order_items || []}
                    />

                    <div className="order-details-row">

                        <span>
                            Status
                        </span>

                        <OrderStatusBadge
                            status={order.status}
                        />

                    </div>


                    <div className="order-details-row">

                        <span>
                            Total Amount
                        </span>

                        <strong className="order-details-total">
                            Rs. {Number(
                                order.total_amount
                            ).toFixed(2)}
                        </strong>

                    </div>


                    {order.created_at && (

                        <div className="order-details-row">

                            <span>
                                Order Date
                            </span>

                            <strong>
                                {new Date(
                                    order.created_at
                                ).toLocaleString()}
                            </strong>

                        </div>

                    )}

                </div>

            </div>

        </div>
    );
}


export default OrderDetails;