import { useState } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";

const CollapsiblePanels = ({
  title,
  badge,
  children,
  opened = false,
  titleContent = null,
}) => {
  const [isOpen, setOpen] = useState(opened);

  return (
    <section className="no-border p-2 mt-2">
      <div className="section-header d-flex justify-content-between px-2">
        <div className="flex-row-centered">
          {titleContent ? (
            titleContent
          ) : (
            <h1 className="bebas-thick text--primary mr-3">{title}</h1>
          )}
          {badge && (
            <div className="section-badge flex-row-centered">{badge}</div>
          )}
        </div>
        <button className="section-toggle" onClick={() => setOpen(!isOpen)}>
          {isOpen ? (
            <FaChevronUp size={18} style={{ color: "#207B69" }} />
          ) : (
            <FaChevronDown size={18} style={{ color: "#207B69" }} />
          )}
        </button>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1.5 }}
            className="section-body p-2"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

CollapsiblePanels.propTypes = {
  opened: PropTypes.bool,
  children: PropTypes.node,
  title: PropTypes.string,
};

export default CollapsiblePanels;
