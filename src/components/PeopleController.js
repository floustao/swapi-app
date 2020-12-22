import React, { useEffect, useState } from 'react';
import { SpinnerDotted } from 'spinners-react';

import { getPeopleData, getPlanetData } from '../services/api';
import MainTable from './MainTable';

export default function PeopleController () {
  const [people, setPeople] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [planetIds, setPlanetIds] = useState({});
  const [currentUrl, setCurrentUrl] = useState('http://swapi.dev/api/people/?page=1')

  // Handle fetching of all characters
  useEffect(() => {
    const loadPeople = async () => {
      setIsFetching(true);
      const apiResponse = await getPeopleData({ url: currentUrl }).then(data => data);
      
      setCurrentUrl(apiResponse.next);
      const peopleData = cleanPeopleData({ people: apiResponse.results });
      setPeople(people => [...people, ...peopleData]);
      setIsFetching(false);
    };

    if (currentUrl) {
      loadPeople();
    }

  }, [currentUrl]);

  // Handle populating planet ids
  useEffect(() => {
    let planetIds = {};
    
    if (people) {
      people.forEach(character => {
        const { homeworld } = character;
        const planetId = getCharacterPlanetID({ homeworld });
        planetIds[planetId] = null;
      });
      setPlanetIds(planetIds);
    }
  }, [people]);

  // useEffect(() => {
  //   const loadPlanet = async ({ planetId }) => {
  //     setIsFetching(true);
  //     const apiResponse = await getPlanetData({ planetId }).then(data => data);
      
  //     const newPlanetIds = {
  //       ...planetIds,
  //       planetId: {
  //         planetName: apiResponse && apiResponse.name,
  //         planetPopulation: apiResponse && apiResponse.residents && apiResponse.residents.length
  //       }
  //     };

  //     setPlanetIds(newPlanetIds);
  //     setIsFetching(false);
  //   };

  //   if (Object.keys(planetIds)) {
  //     Object.keys(planetIds).forEach(planetId => loadPlanet({ planetId }));
  //   }
  // }, [planetIds]);
  
  function getCharacterPlanetID ({ homeworld = '' }) {
    if (!homeworld) { return null };

    const planetId = homeworld
      .match(/\/(\d+)+[\/]?/g)[0]
      .replace(/\//g, "");

    return planetId;
  }

  /**
   * Extract data we need from people.
   */
  function cleanPeopleData ({ people = [] }) {
    if (!people.length) {
      return [];
    }

    const peopleData = people.map(character => {
      const { name, birth_year, homeworld } = character || {};
      const planetId = getCharacterPlanetID({ homeworld });
      
      return {
        name,
        birthYear: birth_year,
        planetId,
        homeworld
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
