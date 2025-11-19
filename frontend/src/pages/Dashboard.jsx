import React from "react";
import OrdersTable from "../components/OrdersTable";

export default function Dashboard() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Panel de Pedidos Pardos Chicken</h1>
      <OrdersTable />
    </div>
  );
}
