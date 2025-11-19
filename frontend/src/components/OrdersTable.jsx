import React, { useEffect, useState } from "react";
import { api } from "../api";

export default function OrdersTable() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("ALL");

  const fetchOrders = async () => {
    const res = await api.get("/orders");
    setOrders(res.data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const advanceState = async (orderId, action) => {
    await api.post(`/${action}/${orderId}`);
    fetchOrders();
  };

  // Filtrar pedidos según el estado seleccionado
  const filteredOrders =
    filter === "ALL" ? orders : orders.filter(o => o.status === filter);

  return (
    <div>
      <h2>Pedidos</h2>

      {/* Selector de filtro */}
      <label>
        Filtrar por estado:{" "}
        <select value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="ALL">Todos</option>
          <option value="RECEIVED">Recibidos</option>
          <option value="COOKING">En cocina</option>
          <option value="PACKING">Empacando</option>
          <option value="DELIVERY">En reparto</option>
          <option value="DELIVERED">Entregados</option>
          <option value="CANCELLED">Cancelados</option>
        </select>
      </label>

      <table border="1" style={{ width: "100%", marginTop: "20px" }}>
        <thead>
          <tr>
            <th>Pedido</th>
            <th>Cliente</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map(o => (
            <tr key={o.orderId}>
              <td>{o.orderId}</td>
              <td>{o.customerName}</td>
              <td>{o.status}</td>
              <td>
                {o.status === "RECEIVED" && (
                  <button onClick={() => advanceState(o.orderId, "kitchen/start")}>
                    Iniciar cocina
                  </button>
                )}
                {o.status === "COOKING" && (
                  <button onClick={() => advanceState(o.orderId, "kitchen/complete")}>
                    Completar cocina
                  </button>
                )}
                {o.status === "PACKING" && (
                  <button onClick={() => advanceState(o.orderId, "packing/complete")}>
                    Completar empaque
                  </button>
                )}
                {o.status === "DELIVERY" && (
                  <button onClick={() => advanceState(o.orderId, "delivery/delivered")}>
                    Marcar entregado
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
