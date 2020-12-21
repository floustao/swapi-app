import React from 'react';

export default function CharacterCard ({
  birthYear = '',
  homeworld = '',
  name = ''
}) {
  return (
    <div>
      <div>{name}</div>
      <div>{birthYear}</div>
      <div>{homeworld}</div>
    </div>
  );
}