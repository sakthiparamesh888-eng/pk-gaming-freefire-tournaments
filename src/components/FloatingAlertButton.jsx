import { useNotificationSetup } from "../hooks/useNotificationSetup";
import "../styles/FloatingAlertButton.css";

export default function FloatingAlertButton({ phone }) {
  const { enableNotifications } = useNotificationSetup();

  const handleClick = () => {
    // Prevent the "Phone number missing!" popup
    if (!phone) {
      console.warn("No phone number available for notifications.");
      return;
    }

    enableNotifications(phone);
  };

  return (
    <button
      onClick={handleClick}
      className="floating-alert-btn"
    >
      🔔 Enable Alerts
    </button>
  );
}
