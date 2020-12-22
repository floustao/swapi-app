import React from 'react';
import styled from 'styled-components';

export default function CharacterCard ({
  birthYear = '',
  name = '',
  planet = {}
}) {
  const { name: planetName, population } = planet || {};
  return (
    <Card>
      <div>Name: {name}</div>
      <div>Birth year: {birthYear}</div>
      <div style={{color: 'red'}}>Planet Name: {planetName}</div>
      <div style={{color: 'red'}}>Planet pop: {population}</div>
    </Card>
  );
}

const Card = styled.div`
  border: 1px solid black;
  padding: 10px;
  margin: 10px auto;
`;