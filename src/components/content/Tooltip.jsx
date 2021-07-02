import { Tooltip, OverlayTrigger } from "react-bootstrap";

const TooltipRenderer = ({ children, title, placement = "right" }) => (
  <OverlayTrigger
    delay={{ show: 250, hide: 400 }}
    placement={placement}
    overlay={(props) => (
      <Tooltip id="button-tooltip" {...props}>
        {title}
      </Tooltip>
    )}
  >
    {children}
  </OverlayTrigger>
);

export default TooltipRenderer;
