import React, { useEffect, useRef } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './alertContainer.css';

const AlertContainer = ({ watchlist }) => {
  const alerts = watchlist?.filter(item => item.alertPrice) || [];
  const notifiedTicks = useRef(new Set());

  useEffect(() => {
    alerts.forEach(alert => {
      const currentPrice = parseFloat(alert.curPrice);
      const alertPrice = parseFloat(alert.alertPrice);

      if (currentPrice === alertPrice && !notifiedTicks.current.has(alert.tick)) {
        toast.success(`Price matched for ${alert.tick} at ${currentPrice}`);
        notifiedTicks.current.add(alert.tick);
      }
    });
  }, [alerts]);

  return (
    <div className="alert-container">
      <ToastContainer />
      {alerts.length > 0 && (
        <div className="alerts-container">
          <h2>Alerts</h2>
          <table className="alert-table">
            <thead>
              <tr>
                <th>Tick</th>
                <th>Current Price</th>
                <th>Alert Price</th>
                <th>Matched</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((alert, index) => {
                const currentPrice = parseFloat(alert.curPrice);
                const alertPrice = parseFloat(alert.alertPrice);
                const matched = currentPrice === alertPrice;

                // Trigger the toast notification for matched alerts
                if (matched && !notifiedTicks.current.has(alert.tick)) {
                  toast.success(`Price matched for ${alert.tick} at ${currentPrice}`);
                  notifiedTicks.current.add(alert.tick);
                }

                return (
                  <tr key={index}>
                    <td>{alert.tick}</td>
                    <td>{alert.curPrice}</td>
                    <td>{alert.alertPrice}</td>
                    <td>{matched ? 'Yes' : 'No'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AlertContainer;
