import React from 'react'
import styled from 'styled-components'

import Page from "../components/page"
import Map from "../components/lasso/map"

const Container = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
`

const Lasso = () => {

    const width = 760;
    const height = 500;
    const mapsTranslate: [number, number] = [width / 2, height / 2];
    const mapsScale = height * 2;
  
    const MapSettings = {
      width,
      height,
      translate: mapsTranslate,
      scale: mapsScale,
    };

    return (
        <Page>
            <Container>
                <Map MapSettings={MapSettings} />
            </Container>
        </Page>
    )
}

export default Lasso;