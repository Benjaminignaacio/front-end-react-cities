import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StreetsTable = () => {
  const [streets, setStreets] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8000/api/streets').then((response) => {
      setStreets(response.data);
    });
  }, []);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const filteredStreets = streets.filter((street) =>
    street.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h2>Grilla de Calles</h2>
      <input
        type="text"
        placeholder="Buscar calles..."
        value={search}
        onChange={handleSearchChange}
      />
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Región</th>
            <th>Provincia</th>
            <th>Ciudad</th>
          </tr>
        </thead>
        <tbody>
          {filteredStreets.map((street) => (
            <tr key={street.id}>
              <td>{street.name}</td>
              <td>{street.region_name}</td>
              <td>{street.province_name}</td>
              <td>{street.city_name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StreetsTable;
