import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const StreetForm = () => {
  const [regions, setRegions] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [streetName, setStreetName] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8000/api/regions')
      .then(response => {
        if (Array.isArray(response.data)) {
          setRegions(response.data);
        } else {
          console.error('Unexpected data format for regions:', response.data);
        }
      })
      .catch(error => {
        console.error('Error fetching regions:', error);
      });
  }, []);

  useEffect(() => {
    if (selectedRegion) {
      axios.get(`http://localhost:8000/api/regions/${selectedRegion}/provinces`)
        .then(response => {
          if (Array.isArray(response.data)) {
            setProvinces(response.data);
          } else {
            console.error('Unexpected data format for provinces:', response.data);
            setProvinces([]);
          }
          setCities([]);
          setSelectedProvince('');
          setSelectedCity('');
        })
        .catch(error => {
          console.error('Error fetching provinces:', error);
        });
    }
  }, [selectedRegion]);

  useEffect(() => {
    if (selectedProvince) {
      axios.get(`http://localhost:8000/api/provinces/${selectedProvince}/cities`)
        .then(response => {
          if (Array.isArray(response.data)) {
            setCities(response.data);
          } else {
            console.error('Unexpected data format for cities:', response.data);
            setCities([]);
          }
          setSelectedCity('');
        })
        .catch(error => {
          console.error('Error fetching cities:', error);
        });
    }
  }, [selectedProvince]);

  const handleStreetSubmit = (e) => {
    e.preventDefault();

    // Validaciones
    if (!selectedRegion || !selectedProvince || !selectedCity || !streetName) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Todos los campos son obligatorios.',
      });
      return;
    }

    const newStreet = {
      name: streetName,
      region_id: selectedRegion,
      province_id: selectedProvince,
      city_id: selectedCity,
    };

    axios.post('http://localhost:8000/api/streets', newStreet)
      .then(response => {
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Calle guardada correctamente.',
        });
     
        setStreetName('');
        setSelectedRegion('');
        setSelectedProvince('');
        setSelectedCity('');
      })
      .catch(error => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al guardar la calle.',
        });
        console.error('Error saving street:', error);
      });
  };

  return (
    <div className="container-fluid mt-4">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">Ingresa tus calles</h6>
            </div>
            <div className="card-body">
              <form onSubmit={handleStreetSubmit}>
                <div className="form-group">
                  <label>Región:</label>
                  <select
                    className="form-control"
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                  >
                    <option value="">Seleccione una región</option>
                    {regions.map((region) => (
                      <option key={region.id} value={region.id}>
                        {region.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Provincia:</label>
                  <select
                    className="form-control"
                    value={selectedProvince}
                    onChange={(e) => setSelectedProvince(e.target.value)}
                    disabled={!selectedRegion}
                  >
                    <option value="">Seleccione una provincia</option>
                    {provinces.map((province) => (
                      <option key={province.id} value={province.id}>
                        {province.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Ciudad:</label>
                  <select
                    className="form-control"
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    disabled={!selectedProvince}
                  >
                    <option value="">Seleccione una ciudad</option>
                    {cities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Nombre de la Calle:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={streetName}
                    onChange={(e) => setStreetName(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn btn-primary">
                  Guardar Calle
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreetForm;
