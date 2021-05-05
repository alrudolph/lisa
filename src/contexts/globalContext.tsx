import React, { createContext } from "react";
import { useStaticQuery, graphql } from "gatsby";

export const GlobalContext = createContext(null);

export const GlobalData = ({ children }) => {
  const {
    allGlobalMoranCsv: { nodes: data },
  } = useStaticQuery(graphql`
    query GlobalQuery {
      allGlobalMoranCsv {
        nodes {
          cs
          cm
          ss
          sm
        }
      }
    }
  `);

  return (
    <GlobalContext.Provider value={data}>{children}</GlobalContext.Provider>
  );
};
