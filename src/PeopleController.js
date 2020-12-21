import React, { useEffect, useState } from 'react';
import { camelizeKeys } from 'humps';

import { getPeopleData } from './services/api';

export default function PeopleController () {
  const [people, setPeople] = useState([]);
  const [planetPages, setPlanetPages] = useState({});

  useEffect(() => {
    const fetchPeople = async () => {
      const apiResponse = await getPeopleData().then(data => data);
        const camelizedPeople = camelizeKeys(apiResponse.results)
        setPeople(camelizedPeople);
    };
    fetchPeople();
  }, []);

  return (
    <div>
      {people.map((character, index) => {
        const {
          birthYear,
          homeworld,
          name
        } = character || {};
        return (
          <div key={`character-${index}`}>
            <div>{name}</div>
            <div>{birthYear}</div>
            <div>{homeworld}</div>
          </div>
        );
      })}
    </div>
  );
}