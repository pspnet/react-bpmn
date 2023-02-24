import { GraphConfigData } from "@logicflow/core";

const adapterOut = (data: GraphConfigData) => {
  console.log(13, data);
  return { nodess: data.nodes, edgess: data.edges };
};

export default adapterOut;
