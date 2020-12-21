import React, { useEffect, useState } from 'react';
import { SpinnerDotted } from 'spinners-react';

import { getPeopleData, getPlanetData } from './services/api';
import MainTable from './MainTable';

export default function PeopleController () {
  const [people, setPeople] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [planetIds, setPlanetIds] = useState({});

  // Handle fetching of characters
  useEffect(() => {
    const fetchPeople = async () => {
      setIsFetching(true);
      const apiResponse = await getPeopleData().then(data => data);
        const peopleData = setPeopleData({ people: apiResponse.results });
        
        setPeople(peopleData);
        setIsFetching(false);
    };
    fetchPeople();
  }, []);

  // Handle populating planet ids
  useEffect(() => {
    let planetIds = {};
    people.forEach(character => {
      const planetId = getCharacterPlanetID({ character });
      planetIds[planetId] = planetId;
    });
    setPlanetIds(planetIds);
  }, [people]);

  useEffect(() => {
    const fetchPlanet = async ({ planetId }) => {
      // setIsFetching(true);
      const apiResponse = await getPlanetData({ planetId }).then(data => data);
        debugger;
        // const camelizedPeople = camelizeKeys(apiResponse.results)
        // setPeople(camelizedPeople);
        // setIsFetching(false);
    };

    people.map(character => {

      fetchPlanet({ planetId });
    })
  }, [planetIds]);
  
  function getCharacterPlanetID ({ character = {} }) {
    const { homeworld } = character;
    const planetId = homeworld
      .match(/\/(\d+)+[\/]?/g)[0]
      .replace(/\//g, "");

    return planetId;
  }

  /**
   * Extract data we need from people.
   */
  function setPeopleData ({ people = [] }) {
    if (!people.length) {
      return [];
    }

    const peopleData = people.map(character => {
      const { name, birth_year } = character || {};
      const planetId = getCharacterPlanetID({ character });
      
      return {
        name,
        birthYear: birth_year,
        planetId
      };
    });

    return peopleData;
  }

  if (isFetching) {
    return (
      <SpinnerDotted />
    );
  }

  return (
    <MainTable
      people={people}
    />
  );
}
