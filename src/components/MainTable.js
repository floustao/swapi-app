import React from 'react';
import styled from 'styled-components';

import CharacterCard from './CharacterCard';

export default function MainTable ({
  people = []
}) {
  return (
    <MainContainer>
      {people.map((character, index) => {
        const {
          birthYear,
          name,
          planetName,
          planetPopulation
        } = character || {};

        return (
          <CharacterCard
            key={`character-${index}`}
            birthYear={birthYear}
            name={name}
            planetName={planetName}
            planetPopulation={planetPopulation}
          />
        );
      })}
    </MainContainer>
  );
}

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 50px;
`;