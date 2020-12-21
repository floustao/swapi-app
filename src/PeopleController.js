import React, { useEffect, useState } from 'react';
import { camelizeKeys } from 'humps';
import { SpinnerDotted } from 'spinners-react';

import { getPeopleData } from './services/api';

export default function PeopleController () {
  const [people, setPeople] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [planetPages, setPlanetPages] = useState({});

  useEffect(() => {
    const fetchPeople = async () => {
      setIsFetching(true);
      const apiResponse = await getPeopleData().then(data => data);
        const camelizedPeople = camelizeKeys(apiResponse.results)
        setPeople(camelizedPeople);
        setIsFetching(false);
    };
    fetchPeople();
  }, []);

  if (isFetching) {
    return (
      <SpinnerDotted />
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '30x auto' }}>
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