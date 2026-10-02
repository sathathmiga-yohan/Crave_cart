function OrderStatusBadge({ status }) {

  const getStatusClass = () => {

    switch (status) {

      case "Pending":
        return "status-pending";

      case "Confirmed":
        return "status-confirmed";

      case "Preparing":
        return "status-preparing";

      case "Out for Delivery":
        return "status-delivery";

      case "Delivered":
        return "status-delivered";

      case "Cancelled":
        return "status-cancelled";

      default:
        return "status-default";
    }

  };


  return (
    <span
      className={`order-status-badge ${getStatusClass()}`}
    >
      {status}
    </span>
  );
}


export default OrderStatusBadge;