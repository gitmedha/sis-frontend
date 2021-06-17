import api from "../../apis";
import { useState, useEffect } from "react";
import Collapsible from "../../components/content/CollapsiblePanels";
import Details from "./batchComponents/Details";
import Sessions from "./batchComponents/Sessions";
import Students from "./batchComponents/Students";

const Batch = () => {
  const [batch, setBatch] = useState(null);
  const [isLoading, setLoading] = useState(false);

  return (
    <div>
      <Collapsible title="Batch Details" opened={true}>
        <Details />
      </Collapsible>
      <Collapsible title="Sessions">
        <Sessions />
      </Collapsible>
      <Collapsible title="Students">
        <Students />
      </Collapsible>
    </div>
  );
};

export default Batch;
