import React from "react"
import styled from "styled-components"

import Page from "../components/page"
import Sparse from "../utility/sparse"

type Props = {
    data: [Array<Sparse>, Array<Sparse>, Array<Sparse>, Array<Sparse>];
  };

const Bivariate = ({ data }: Props) => {

    return (
        <Page>
            <div>
                <p>Hello</p>
            </div>
        </Page>
    );

}

export default Bivariate;